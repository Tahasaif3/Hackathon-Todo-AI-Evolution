from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, DateTime
import uuid
from .user import User  # Import User model for relationship


class ConversationBase(SQLModel):
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)


class Conversation(ConversationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(sa_column=Column(DateTime, default=datetime.utcnow))
    updated_at: datetime = Field(sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow))

    # Relationship to user
    owner: Optional["User"] = Relationship(back_populates="conversations")

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class ConversationCreate(ConversationBase):
    pass


class ConversationRead(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationUpdate(SQLModel):
    pass