from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime, JSON
import uuid


class DeadLetterQueueBase(SQLModel):
    event_id: str = Field(index=True)  # Original event ID
    event_type: str = Field(max_length=50)  # Original event type
    user_id: str  # Original user ID
    task_id: int  # Original task ID
    event_data: dict = Field(sa_column=Column(JSON))  # Original event data
    error_message: str = Field(sa_column=Column(SQLModel.get_sqlalchemy_type(str)))  # Error that caused DLQ placement
    original_timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow))  # When event was originally received
    dlq_timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow))  # When event was placed in DLQ
    retry_count: int = Field(default=0)  # Number of times this event was retried before being placed in DLQ


class DeadLetterQueue(DeadLetterQueueBase, table=True):
    """
    Table to store failed events that could not be processed.
    Contains original event details, error information, and timestamps.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    event_id: str = Field(index=True)  # Original event ID
    event_type: str = Field(max_length=50)  # Original event type
    user_id: str  # Original user ID
    task_id: int  # Original task ID
    event_data: dict = Field(sa_column=Column(JSON))  # Original event data
    error_message: str = Field(sa_column=Column(SQLModel.get_sqlalchemy_type(str)))  # Error that caused DLQ placement
    original_timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow))  # When event was originally received
    dlq_timestamp: datetime = Field(sa_column=Column(DateTime(timezone=True), default=datetime.utcnow))  # When event was placed in DLQ
    retry_count: int = Field(default=0)  # Number of times this event was retried before being placed in DLQ


class DeadLetterQueueCreate(DeadLetterQueueBase):
    pass


class DeadLetterQueueRead(DeadLetterQueueBase):
    id: int
    dlq_timestamp: datetime

    class Config:
        from_attributes = True