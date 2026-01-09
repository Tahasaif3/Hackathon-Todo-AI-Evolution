from sqlmodel import create_engine, Session
from contextlib import contextmanager
from .config import settings
# Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)


@contextmanager
def get_session():
    """Context manager for database sessions."""
    with Session(engine) as session:
        yield session


def get_session_dep():
    """Dependency for FastAPI to get database session."""
    with get_session() as session:
        yield session