from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    due_date: Optional[datetime] = None
    project_id: Optional[UUID] = None


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: int
    user_id: UUID
    due_date: Optional[datetime] = None
    project_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    tasks: List[TaskRead]
    total: int
    offset: int
    limit: int