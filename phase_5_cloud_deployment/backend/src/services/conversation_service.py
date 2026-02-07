from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import uuid
from ..models.conversation import Conversation, ConversationCreate
from ..models.message import Message, MessageCreate


class ConversationService:
    @staticmethod
    def create_conversation(user_id: uuid.UUID, db_session: Session) -> Conversation:
        """Create a new conversation for a user"""
        conversation = Conversation(user_id=user_id)
        db_session.add(conversation)
        db_session.commit()
        db_session.refresh(conversation)
        return conversation

    @staticmethod
    def get_conversation_by_id(conversation_id: int, user_id: uuid.UUID, db_session: Session) -> Optional[Conversation]:
        """Get a conversation by ID for a specific user (enforces user isolation)"""
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        return db_session.exec(statement).first()

    @staticmethod
    def get_messages(conversation_id: int, user_id: uuid.UUID, db_session: Session, limit: int = 20) -> List[Message]:
        """Get messages from a conversation with user isolation enforced"""
        # First verify the conversation belongs to the user
        conversation = ConversationService.get_conversation_by_id(conversation_id, user_id, db_session)
        if not conversation:
            return []

        # Get messages for this conversation
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.desc()).limit(limit)

        messages = db_session.exec(statement).all()
        # Reverse to return in chronological order (oldest first)
        return list(reversed(messages))

    @staticmethod
    def add_message(conversation_id: int, user_id: uuid.UUID, role: str, content: str, db_session: Session) -> Message:
        """Add a message to a conversation with user isolation enforced"""
        # Verify the conversation belongs to the user
        conversation = ConversationService.get_conversation_by_id(conversation_id, user_id, db_session)
        if not conversation:
            raise ValueError("Conversation not found or does not belong to user")

        message = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role=role,
            content=content
        )
        db_session.add(message)
        db_session.commit()
        db_session.refresh(message)
        return message

    @staticmethod
    def get_latest_conversation(user_id: uuid.UUID, db_session: Session) -> Optional[Conversation]:
        """Get the most recent conversation for a user"""
        statement = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(Conversation.created_at.desc()).limit(1)

        return db_session.exec(statement).first()