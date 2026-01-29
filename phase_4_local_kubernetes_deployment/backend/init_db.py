import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database import engine
from src.models.user import User
from src.models.task import Task
from src.models.project import Project
from src.models.conversation import Conversation
from src.models.message import Message
from sqlmodel import SQLModel

# Create all tables
SQLModel.metadata.create_all(engine)
print('Database tables created successfully')