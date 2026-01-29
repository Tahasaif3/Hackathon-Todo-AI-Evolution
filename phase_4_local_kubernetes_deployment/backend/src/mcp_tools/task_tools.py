# No MCP import needed - this file only defines tool parameters and functions
from pydantic import BaseModel, Field
from typing import List, Optional
import json
from sqlmodel import Session, select
from uuid import UUID
import sys
import os

# Add the src directory to the path so we can import our models
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import uuid
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.project import Project, ProjectCreate, ProjectUpdate
from ..models.user import User
from ..database import engine


class AddTaskParams(BaseModel):
    user_id: str = Field(description="User ID to create task for")
    title: str = Field(description="Task title, 1-200 characters")
    description: Optional[str] = Field(default=None, description="Task description, optional, max 1000 chars")
    due_date: Optional[str] = Field(default=None, description="Due date in ISO format (YYYY-MM-DD)")
    project_name: Optional[str] = Field(default=None, description="Optional name of the project to associate this task with")


class AddTaskResult(BaseModel):
    task_id: int
    status: str
    title: str


class ListTasksParams(BaseModel):
    user_id: str = Field(description="User ID to list tasks for")
    status: Optional[str] = Field(default="all", description="Task status filter: 'all', 'pending', 'completed'")


class ListTasksResultItem(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: str


class ListTasksResult(BaseModel):
    tasks: List[ListTasksResultItem]


class CompleteTaskParams(BaseModel):
    user_id: str = Field(description="User ID of the task owner")
    task_id: int = Field(description="ID of the task to complete")


class CompleteTaskResult(BaseModel):
    task_id: int
    status: str
    title: str


class DeleteTaskParams(BaseModel):
    user_id: str = Field(description="User ID of the task owner")
    task_id: int = Field(description="ID of the task to delete")


class DeleteTaskResult(BaseModel):
    task_id: int
    status: str
    title: str


class UpdateTaskParams(BaseModel):
    user_id: str = Field(description="User ID of the task owner")
    task_id: int = Field(description="ID of the task to update")
    title: Optional[str] = Field(default=None, description="New task title")
    description: Optional[str] = Field(default=None, description="New task description")


class UpdateTaskResult(BaseModel):
    task_id: int
    status: str
    title: str


class CreateProjectParams(BaseModel):
    user_id: str = Field(description="User ID to create project for")
    name: str = Field(description="Project name")
    description: Optional[str] = Field(default=None, description="Project description")
    color: Optional[str] = Field(default="#3b82f6", description="Hex color code")


class CreateProjectResult(BaseModel):
    project_id: str
    status: str
    name: str


class ListProjectsParams(BaseModel):
    user_id: str = Field(description="User ID to list projects for")


class ProjectResultItem(BaseModel):
    id: str
    name: str
    description: Optional[str]
    color: Optional[str]


class ListProjectsResult(BaseModel):
    projects: List[ProjectResultItem]


class GetCalendarParams(BaseModel):
    user_id: str = Field(description="User ID")
    start_date: str = Field(description="Start date ISO string")
    end_date: str = Field(description="End date ISO string")


class CalendarItem(BaseModel):
    id: int
    title: str
    due_date: str
    completed: bool
    project_name: Optional[str]


class GetCalendarResult(BaseModel):
    items: List[CalendarItem]


def get_task_tools_for_gemin_api():
    """Returns a list of all task-related tools in Gemini API format, hiding user_id from AI"""
    def get_schema_without_user_id(model):
        schema = model.model_json_schema()
        if "properties" in schema and "user_id" in schema["properties"]:
            del schema["properties"]["user_id"]
        if "required" in schema and "user_id" in schema["required"]:
            schema["required"].remove("user_id")
        return schema

    tools = [
        {
            "type": "function",
            "function": {
                "name": "add_task",
                "description": "Create a new task for the user. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(AddTaskParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_tasks",
                "description": "Retrieve user's tasks. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(ListTasksParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "complete_task",
                "description": "Mark a task as complete. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(CompleteTaskParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "delete_task",
                "description": "Remove a task. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(DeleteTaskParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_task",
                "description": "Modify task details. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(UpdateTaskParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "create_project",
                "description": "Create a new project. Projects can hold multiple tasks. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(CreateProjectParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_projects",
                "description": "List all projects for the user. Do not ask for user_id.",
                "parameters": get_schema_without_user_id(ListProjectsParams)
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_calendar",
                "description": "Get tasks and events for a specific date range (Calendar view). Do not ask for user_id.",
                "parameters": get_schema_without_user_id(GetCalendarParams)
            }
        }
    ]
    return tools


def get_task_tools():
    """Returns a list of all task-related MCP tools (for MCP usage)"""
    tools = [
        {
            "name": "add_task",
            "description": "Create a new task for the user",
            "input_schema": AddTaskParams.model_json_schema()
        },
        {
            "name": "list_tasks",
            "description": "Retrieve user's tasks",
            "input_schema": ListTasksParams.model_json_schema()
        },
        {
            "name": "complete_task",
            "description": "Mark a task as complete",
            "input_schema": CompleteTaskParams.model_json_schema()
        },
        {
            "name": "delete_task",
            "description": "Remove a task",
            "input_schema": DeleteTaskParams.model_json_schema()
        },
        {
            "name": "update_task",
            "description": "Modify task details",
            "input_schema": UpdateTaskParams.model_json_schema()
        }
    ]
    return tools


def execute_add_task(params: AddTaskParams) -> AddTaskResult:
    """Execute the add_task tool"""
    try:
        # Validate user_id format
        try:
            user_uuid = uuid.UUID(params.user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id format: {params.user_id}")

        # Create a database session
        with Session(engine) as db_session:
            # Verify user exists
            user_exists = db_session.exec(
                select(User).where(User.id == user_uuid)
            ).first()

            if not user_exists:
                raise ValueError(f"User with id {params.user_id} not found")

            # Parse due date if provided
            due_date_dt = None
            if params.due_date:
                try:
                    due_date_dt = datetime.fromisoformat(params.due_date.replace('Z', '+00:00'))
                except ValueError:
                    # Try simple YYYY-MM-DD
                    try:
                        due_date_dt = datetime.strptime(params.due_date, "%Y-%m-%d")
                    except ValueError:
                        pass

            # Handle project association
            project_id = None
            if params.project_name:
                project = db_session.exec(
                    select(Project).where(
                        Project.name == params.project_name,
                        Project.user_id == user_uuid
                    )
                ).first()
                if project:
                    project_id = project.id

            # Create the task
            task = Task(
                title=params.title,
                description=params.description,
                due_date=due_date_dt,
                user_id=user_uuid,
                project_id=project_id
            )

            db_session.add(task)
            db_session.commit()
            db_session.refresh(task)

            return AddTaskResult(
                task_id=task.id,
                status="created",
                title=task.title
            )
    except Exception as e:
        raise e


def execute_list_tasks(params: ListTasksParams) -> ListTasksResult:
    """Execute the list_tasks tool"""
    try:
        # Validate user_id format
        try:
            user_uuid = uuid.UUID(params.user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id format: {params.user_id}")

        # Create a database session
        with Session(engine) as db_session:
            # Build query based on status filter
            query = select(Task).where(Task.user_id == user_uuid)

            if params.status and params.status.lower() == "completed":
                query = query.where(Task.completed == True)
            elif params.status and params.status.lower() == "pending":
                query = query.where(Task.completed == False)

            # Execute query
            tasks = db_session.exec(query).all()

            # Convert to result format
            task_items = [
                ListTasksResultItem(
                    id=task.id,
                    title=task.title,
                    completed=task.completed,
                    created_at=task.created_at.isoformat() if task.created_at else ""
                )
                for task in tasks
            ]

            return ListTasksResult(tasks=task_items)
    except Exception as e:
        raise e


def execute_complete_task(params: CompleteTaskParams) -> CompleteTaskResult:
    """Execute the complete_task tool"""
    try:
        # Validate user_id format
        try:
            user_uuid = uuid.UUID(params.user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id format: {params.user_id}")

        # Create a database session
        with Session(engine) as db_session:
            # Find the task and verify it belongs to the user
            task = db_session.exec(
                select(Task).where(
                    Task.id == params.task_id,
                    Task.user_id == user_uuid
                )
            ).first()

            if not task:
                raise ValueError(f"Task with id {params.task_id} not found for user {params.user_id}")

            # Update task as completed
            task.completed = True
            db_session.add(task)
            db_session.commit()
            db_session.refresh(task)

            return CompleteTaskResult(
                task_id=task.id,
                status="completed",
                title=task.title
            )
    except Exception as e:
        raise e


def execute_delete_task(params: DeleteTaskParams) -> DeleteTaskResult:
    """Execute the delete_task tool"""
    try:
        # Validate user_id format
        try:
            user_uuid = uuid.UUID(params.user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id format: {params.user_id}")

        # Create a database session
        with Session(engine) as db_session:
            # Find the task and verify it belongs to the user
            task = db_session.exec(
                select(Task).where(
                    Task.id == params.task_id,
                    Task.user_id == user_uuid
                )
            ).first()

            if not task:
                raise ValueError(f"Task with id {params.task_id} not found for user {params.user_id}")

            # Delete the task
            db_session.delete(task)
            db_session.commit()

            return DeleteTaskResult(
                task_id=task.id,
                status="deleted",
                title=task.title
            )
    except Exception as e:
        raise e


def execute_update_task(params: UpdateTaskParams) -> UpdateTaskResult:
    """Execute the update_task tool"""
    try:
        # Validate user_id format
        try:
            user_uuid = uuid.UUID(params.user_id)
        except ValueError:
            raise ValueError(f"Invalid user_id format: {params.user_id}")

        # Create a database session
        with Session(engine) as db_session:
            # Find the task and verify it belongs to the user
            task = db_session.exec(
                select(Task).where(
                    Task.id == params.task_id,
                    Task.user_id == user_uuid
                )
            ).first()

            if not task:
                raise ValueError(f"Task with id {params.task_id} not found for user {params.user_id}")

            # Update the task with provided parameters
            if params.title is not None:
                task.title = params.title
            if params.description is not None:
                task.description = params.description

            db_session.add(task)
            db_session.commit()
            db_session.refresh(task)

            return UpdateTaskResult(
                task_id=task.id,
                status="updated",
                title=task.title
            )
    except Exception as e:
        raise e


def execute_create_project(params: CreateProjectParams) -> CreateProjectResult:
    """Execute the create_project tool"""
    try:
        user_uuid = uuid.UUID(params.user_id)
        with Session(engine) as db_session:
            project = Project(
                name=params.name,
                description=params.description,
                color=params.color,
                user_id=user_uuid
            )
            db_session.add(project)
            db_session.commit()
            db_session.refresh(project)
            return CreateProjectResult(
                project_id=str(project.id),
                status="created",
                name=project.name
            )
    except Exception as e:
        raise e


def execute_list_projects(params: ListProjectsParams) -> ListProjectsResult:
    """Execute the list_projects tool"""
    try:
        user_uuid = uuid.UUID(params.user_id)
        with Session(engine) as db_session:
            projects = db_session.exec(
                select(Project).where(Project.user_id == user_uuid)
            ).all()
            
            project_items = [
                ProjectResultItem(
                    id=str(p.id),
                    name=p.name,
                    description=p.description,
                    color=p.color
                ) for p in projects
            ]
            return ListProjectsResult(projects=project_items)
    except Exception as e:
        raise e


def execute_get_calendar(params: GetCalendarParams) -> GetCalendarResult:
    """Execute the get_calendar tool"""
    try:
        user_uuid = uuid.UUID(params.user_id)
        start_dt = datetime.fromisoformat(params.start_date.replace('Z', '+00:00'))
        end_dt = datetime.fromisoformat(params.end_date.replace('Z', '+00:00'))
        
        with Session(engine) as db_session:
            query = select(Task).where(
                Task.user_id == user_uuid,
                Task.due_date >= start_dt,
                Task.due_date <= end_dt
            )
            tasks = db_session.exec(query).all()
            
            items = []
            for task in tasks:
                p_name = None
                if task.project_id:
                    p = db_session.exec(select(Project).where(Project.id == task.project_id)).first()
                    if p:
                        p_name = p.name
                
                items.append(CalendarItem(
                    id=task.id,
                    title=task.title,
                    due_date=task.due_date.isoformat() if task.due_date else "",
                    completed=task.completed,
                    project_name=p_name
                ))
            
            return GetCalendarResult(items=items)
    except Exception as e:
        raise e