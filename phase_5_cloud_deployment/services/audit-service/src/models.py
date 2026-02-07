from sqlmodel import SQLModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import create_async_engine
import os


class AuditLogBase(SQLModel):
    event_id: str = Field(index=True)  # UUID for deduplication
    event_type: str = Field(max_length=50)  # created|updated|completed|deleted
    user_id: str  # String user identifier
    task_id: int  # Reference to the affected task
    event_data: Dict[str, Any] = Field(sa_column=Column(JSONB))  # JSONB field for event data
    timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow))


class AuditLog(AuditLogBase, table=True):
    """
    Persistent record of all task events for a user.
    Contains id, event_id, event_type, user_id, task_id, event_data (JSONB), and timestamp.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: str = Field(index=True, unique=True)  # Unique constraint for deduplication
    event_type: str = Field(max_length=50)  # created|updated|completed|deleted
    user_id: str  # String user identifier
    task_id: int  # Reference to the affected task
    event_data: Dict[str, Any] = Field(sa_column=Column(JSONB))  # JSONB field for event data
    timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow)


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogRead(AuditLogBase):
    id: int
    timestamp: datetime


# Create async database engine
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_LsojKQF8bGn2@ep-mute-pine-a4g0wfsu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
# Replace postgresql:// with postgresql+asyncpg:// for async operations
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
from sqlalchemy.ext.asyncio import create_async_engine
engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)