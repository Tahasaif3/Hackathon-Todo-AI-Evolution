from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select, and_, func
from typing import List
from uuid import UUID
from datetime import datetime

from ..models.user import User
from ..models.project import Project, ProjectCreate, ProjectUpdate, ProjectRead
from ..models.task import Task
from ..database import get_session_dep
from ..utils.deps import get_current_user


router = APIRouter(prefix="/api/{user_id}/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectRead])
def list_projects(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """List all projects for the authenticated user."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Build the query with user_id filter
    query = select(Project).where(Project.user_id == user_id)
    
    # Apply ordering (newest first)
    query = query.order_by(Project.created_at.desc())
    
    projects = session.exec(query).all()
    return projects


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    *,
    user_id: UUID,
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Create a new project for the authenticated user."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Create the project
    project = Project(
        name=project_data.name,
        description=project_data.description,
        color=project_data.color,
        user_id=user_id
    )
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    *,
    user_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get a specific project by ID for the authenticated user."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Fetch the project
    project = session.get(Project, project_id)
    
    # Check if project exists and belongs to the user
    if not project or project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectRead)
def update_project(
    *,
    user_id: UUID,
    project_id: UUID,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Update an existing project for the authenticated user."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Fetch the project
    project = session.get(Project, project_id)
    
    # Check if project exists and belongs to the user
    if not project or project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update the project
    project_data_dict = project_data.dict(exclude_unset=True)
    for key, value in project_data_dict.items():
        setattr(project, key, value)
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project


@router.delete("/{project_id}")
def delete_project(
    *,
    user_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Delete a project for the authenticated user."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Fetch the project
    project = session.get(Project, project_id)
    
    # Check if project exists and belongs to the user
    if not project or project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Delete the project
    session.delete(project)
    session.commit()
    
    return {"message": "Project deleted successfully"}


@router.get("/{project_id}/tasks", response_model=List[Task])
def list_project_tasks(
    *,
    user_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """List all tasks for a specific project."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Fetch the project
    project = session.get(Project, project_id)
    
    # Check if project exists and belongs to the user
    if not project or project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Build the query with project_id filter
    query = select(Task).where(Task.project_id == project_id)
    
    # Apply ordering (newest first)
    query = query.order_by(Task.created_at.desc())
    
    tasks = session.exec(query).all()
    return tasks


@router.get("/{project_id}/progress")
def get_project_progress(
    *,
    user_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """Get progress statistics for a specific project."""
    
    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Fetch the project
    project = session.get(Project, project_id)
    
    # Check if project exists and belongs to the user
    if not project or project.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get task counts
    total_tasks_query = select(func.count()).where(Task.project_id == project_id)
    completed_tasks_query = select(func.count()).where(and_(Task.project_id == project_id, Task.completed == True))
    
    total_tasks = session.exec(total_tasks_query).first()
    completed_tasks = session.exec(completed_tasks_query).first()
    
    # Calculate progress
    progress = 0
    if total_tasks > 0:
        progress = round((completed_tasks / total_tasks) * 100, 2)
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": total_tasks - completed_tasks,
        "progress": progress
    }