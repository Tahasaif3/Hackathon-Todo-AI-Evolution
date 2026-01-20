from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select, and_, func
from typing import List
from uuid import UUID
from datetime import datetime, timedelta, date

from ..models.user import User
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from ..schemas.task import TaskListResponse
from ..database import get_session_dep
from ..utils.deps import get_current_user


router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.get("/stats")
def get_task_stats(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get advanced task statistics, streaks, and achievements."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    tasks = session.exec(select(Task).where(Task.user_id == user_id)).all()
    
    total = len(tasks)
    completed_tasks = [t for t in tasks if t.completed]
    completed_count = len(completed_tasks)
    pending_count = total - completed_count
    completion_rate = round((completed_count / total * 100), 1) if total > 0 else 0

    # Streak calculation
    # Group completed tasks by day (using updated_at as completion time for now)
    completed_dates = sorted(list(set([t.updated_at.date() for t in completed_tasks])), reverse=True)
    
    streak = 0
    if completed_dates:
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)
        
        # Check if the streak is still active (completed something today or yesterday)
        if completed_dates[0] == today or completed_dates[0] == yesterday:
            # We count the current active streak
            streak = 1
            for i in range(len(completed_dates) - 1):
                if completed_dates[i] - timedelta(days=1) == completed_dates[i+1]:
                    streak += 1
                else:
                    break
    
    # Achievements logic
    achievements = [
        {
            "id": "first_task", 
            "title": "First Step", 
            "description": "Complete your first task", 
            "unlocked": completed_count >= 1, 
            "icon": "Star",
            "progress": 100 if completed_count >= 1 else 0
        },
        {
            "id": "five_tasks", 
            "title": "High Five", 
            "description": "Complete 5 tasks", 
            "unlocked": completed_count >= 5, 
            "icon": "Zap",
            "progress": min(100, int(completed_count / 5 * 100))
        },
        {
            "id": "ten_tasks", 
            "title": "Task Master", 
            "description": "Complete 10 tasks", 
            "unlocked": completed_count >= 10, 
            "icon": "Trophy",
            "progress": min(100, int(completed_count / 10 * 100))
        },
        {
            "id": "streak_3", 
            "title": "Consistent", 
            "description": "3-day completion streak", 
            "unlocked": streak >= 3, 
            "icon": "Flame",
            "progress": min(100, int(streak / 3 * 100))
        },
        {
            "id": "streak_7", 
            "title": "Unstoppable", 
            "description": "7-day completion streak", 
            "unlocked": streak >= 7, 
            "icon": "Award",
            "progress": min(100, int(streak / 7 * 100))
        }
    ]

    # Productivity chart data (last 7 days)
    chart_data = []
    for i in range(6, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).date()
        count = len([t for t in completed_tasks if t.updated_at.date() == day])
        chart_data.append({
            "date": day.strftime("%a"), 
            "count": count,
            "isToday": i == 0
        })

    return {
        "total": total,
        "completed": completed_count,
        "pending": pending_count,
        "completionRate": completion_rate,
        "streak": streak,
        "achievements": achievements,
        "chartData": chart_data
    }


@router.get("/", response_model=TaskListResponse)
def list_tasks(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep),
    completed: bool = None,
    offset: int = 0,
    limit: int = 50
):
    """List all tasks for the authenticated user with optional filtering."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Build the query with user_id filter
    query = select(Task).where(Task.user_id == user_id)

    # Apply completed filter if specified
    if completed is not None:
        query = query.where(Task.completed == completed)

    # Apply ordering (newest first)
    query = query.order_by(Task.created_at.desc())

    # Apply pagination
    query = query.offset(offset).limit(limit)

    tasks = session.exec(query).all()

    # Get total count for pagination info
    total_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)
    if completed is not None:
        total_query = total_query.where(Task.completed == completed)
    total = session.exec(total_query).one()

    # Convert to response format
    task_responses = []
    for task in tasks:
        task_dict = {
            "id": task.id,
            "user_id": str(task.user_id),
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "project_id": str(task.project_id) if task.project_id else None,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat()
        }
        task_responses.append(task_dict)

    return TaskListResponse(
        tasks=task_responses,
        total=total,
        offset=offset,
        limit=limit
    )


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: UUID,
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Create a new task for the authenticated user."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Validate title length
    if len(task_data.title) < 1 or len(task_data.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be between 1 and 200 characters"
        )

    # Validate description length if provided
    if task_data.description and len(task_data.description) > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must be 1000 characters or less"
        )

    # Create new task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed,
        due_date=task_data.due_date,
        project_id=task_data.project_id,
        user_id=user_id
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        project_id=task.project_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    user_id: UUID,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get a specific task by ID for the authenticated user."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get the task
    task = session.get(Task, task_id)

    # Verify the task exists and belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        project_id=task.project_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    user_id: UUID,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Update an existing task for the authenticated user."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get the task
    task = session.get(Task, task_id)

    # Verify the task exists and belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields if provided
    if task_data.title is not None:
        if len(task_data.title) < 1 or len(task_data.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 200 characters"
            )
        task.title = task_data.title

    if task_data.description is not None:
        if len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be 1000 characters or less"
            )
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.project_id is not None:
        task.project_id = task_data.project_id

    # Update the timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        project_id=task.project_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.patch("/{task_id}", response_model=TaskRead)
def patch_task(
    user_id: UUID,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Partially update an existing task for the authenticated user."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get the task
    task = session.get(Task, task_id)

    # Verify the task exists and belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields if provided
    if task_data.title is not None:
        if len(task_data.title) < 1 or len(task_data.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 200 characters"
            )
        task.title = task_data.title

    if task_data.description is not None:
        if len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be 1000 characters or less"
            )
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.project_id is not None:
        task.project_id = task_data.project_id

    # Update the timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        due_date=task.due_date,
        project_id=task.project_id,
        created_at=task.created_at,
        updated_at=task.updated_at
    )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: UUID,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Delete a task for the authenticated user."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get the task
    task = session.get(Task, task_id)

    # Verify the task exists and belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()

    # Return 204 No Content
    return


@router.patch("/{task_id}/toggle", response_model=TaskRead)
def toggle_task_completion(
    user_id: UUID,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Toggle the completion status of a task."""

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Get the task
    task = session.get(Task, task_id)

    # Verify the task exists and belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle the completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskRead(
        id=task.id,
        user_id=task.user_id,
        title=task.title,
        description=task.description,
        completed=task.completed,
        created_at=task.created_at,
        updated_at=task.updated_at
    )