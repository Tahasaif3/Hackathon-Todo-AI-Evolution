from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime, Enum as SAEnum
import uuid
from .conversation import Conversation  # Import Conversation model for relationship


class MessageBase(SQLModel):
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    user_id: uuid.UUID
    role: str = Field(sa_column=Column("role", SAEnum("user", "assistant", name="message_role")))
    content: str


class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    user_id: uuid.UUID
    role: str = Field(sa_column=Column("role", SAEnum("user", "assistant", name="message_role")))
    content: str
    created_at: datetime = Field(sa_column=Column(DateTime, default=datetime.utcnow))

    # Relationship to conversation
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    pass


class MessageRead(MessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MessageUpdate(SQLModel):
    content: Optional[str] = None