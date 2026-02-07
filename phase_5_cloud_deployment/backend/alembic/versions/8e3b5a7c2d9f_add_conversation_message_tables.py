"""add conversation and message tables

Revision ID: 8e3b5a7c2d9f
Revises: 6f0b6403a1d8
Create Date: 2025-12-24 01:50:45.930037

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8e3b5a7c2d9f'
down_revision: Union[str, Sequence[str], None] = '6f0b6403a1d8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '6f0b6403a1d8'


def upgrade() -> None:
    """Upgrade schema."""
    # Create conversation table
    op.create_table('conversation',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversation_user_id'), 'conversation', ['user_id'], unique=False)
    
    # Create message table
    op.create_table('message',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('role', sa.Enum('user', 'assistant', name='message_role'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversation.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_message_conversation_id'), 'message', ['conversation_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop message table
    op.drop_index(op.f('ix_message_conversation_id'), table_name='message')
    op.drop_table('message')
    
    # Drop conversation table
    op.drop_index(op.f('ix_conversation_user_id'), table_name='conversation')
    op.drop_table('conversation')
    
    # Drop enum type
    op.execute('DROP TYPE IF EXISTS message_role;')
