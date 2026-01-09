# Claude Agent Instructions - Backend

## Context

You are working in the **FastAPI backend** of a full-stack task management application.

**Parent Instructions**: See root `CLAUDE.md` for global rules.

## Technology Stack

- **FastAPI** 0.115+
- **SQLModel** 0.0.24+ (NOT raw SQLAlchemy)
- **Pydantic v2** for validation
- **PostgreSQL 16** via Neon
- **UV** package manager
- **Alembic** for migrations
- **Python 3.13+**

## Critical Requirements

### SQLModel (NOT SQLAlchemy)

**Correct** (SQLModel):
```python
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str

    tasks: list["Task"] = Relationship(back_populates="owner")
```

**Forbidden** (raw SQLAlchemy):
```python
from sqlalchemy import Column, Integer, String  # NO!
```

### User Data Isolation (CRITICAL)

**ALWAYS filter by user_id**:
```python
from fastapi import Depends, HTTPException
from sqlmodel import select

async def get_user_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify ownership
    if user_id != current_user.id:
        raise HTTPException(status_code=404)  # NOT 403!

    # Filter by user_id
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks
```

### JWT Authentication

**Token Validation**:
```python
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(
    token: str = Depends(security)
) -> User:
    try:
        payload = jwt.decode(
            token.credentials,
            settings.BETTER_AUTH_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
    except JWTError:
        raise HTTPException(status_code=401)

    user = get_user_from_db(user_id)
    if user is None:
        raise HTTPException(status_code=401)
    return user
```

### Password Security

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

## Project Structure

```
src/
├── main.py              # FastAPI app, CORS, startup
├── config.py            # Environment variables
├── database.py          # SQLModel engine, session
├── models/
│   ├── user.py          # User SQLModel
│   └── task.py          # Task SQLModel
├── schemas/
│   ├── auth.py          # Request/response schemas
│   └── task.py          # Request/response schemas
├── routers/
│   ├── auth.py          # /api/auth/* endpoints
│   └── tasks.py         # /api/{user_id}/tasks/* endpoints
├── middleware/
│   └── auth.py          # JWT validation
└── utils/
    ├── security.py      # bcrypt, JWT helpers
    └── deps.py          # Dependency injection
```

## API Patterns

### Endpoint Structure

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])

@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Authorization check
    if user_id != current_user.id:
        raise HTTPException(status_code=404)

    # Query with user_id filter
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()
    return tasks
```

### Error Responses

```python
# 401 Unauthorized - Invalid/missing JWT
raise HTTPException(
    status_code=401,
    detail="Invalid authentication credentials"
)

# 404 Not Found - Resource doesn't exist OR unauthorized access
raise HTTPException(
    status_code=404,
    detail="Task not found"
)

# 400 Bad Request - Validation error
raise HTTPException(
    status_code=400,
    detail="Title must be between 1-200 characters"
)

# 409 Conflict - Duplicate resource
raise HTTPException(
    status_code=409,
    detail="An account with this email already exists"
)
```

## Database Migrations

**Creating Migrations**:
```bash
uv run alembic revision --autogenerate -m "Add users and tasks tables"
```

**Applying Migrations**:
```bash
uv run alembic upgrade head
```

**Migration File Structure**:
```python
def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(), unique=True),
        sa.Column('password_hash', sa.String()),
    )
    op.create_index('ix_user_email', 'user', ['email'])
```

## Testing

**Fixtures** (`tests/conftest.py`):
```python
import pytest
from sqlmodel import Session, create_engine
from fastapi.testclient import TestClient

@pytest.fixture
def session():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture
def client(session):
    app.dependency_overrides[get_session] = lambda: session
    yield TestClient(app)
```

**Test Example**:
```python
def test_create_task(client, auth_headers):
    response = client.post(
        "/api/1/tasks",
        headers=auth_headers,
        json={"title": "Test Task", "description": "Test"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
BETTER_AUTH_SECRET=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
```

## Common Mistakes to Avoid

❌ Using raw SQLAlchemy instead of SQLModel
✅ Use SQLModel for all database models

❌ Trusting user_id from request parameters
✅ Always extract from validated JWT token

❌ Returning 403 for unauthorized access
✅ Return 404 to prevent information leakage

❌ SQL string concatenation
✅ SQLModel parameterized queries only

❌ Plaintext passwords
✅ bcrypt hashing always

## References

- Root Instructions: `../CLAUDE.md`
- Feature Spec: `../specs/001-task-crud-auth/spec.md`
- Constitution: `../.specify/memory/constitution.md`