"""add is_ai_generated to tasks

Revision ID: 9a4b8c7d1e2f
Revises: 8e3b5a7c2d9f
Create Date: 2025-12-25 05:47:00.000000

"""
from alembic import op
import sqlalchemy as sa
import uuid


# revision identifiers
revision = '9a4b8c7d1e2f'
down_revision = '8e3b5a7c2d9f'
branch_labels = None
depends_on = None


def upgrade():
    # Add the is_ai_generated column to the tasks table
    op.add_column('task', sa.Column('is_ai_generated', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    # Remove the is_ai_generated column from the tasks table
    op.drop_column('task', 'is_ai_generated')