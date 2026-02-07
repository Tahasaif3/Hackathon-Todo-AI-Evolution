# Quickstart Guide: Task CRUD Operations with Authentication

## Prerequisites

Before starting development, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v24+) with Docker Compose v2+
- [Node.js](https://nodejs.org/) (v20+) and npm/yarn/pnpm
- [Python](https://www.python.org/) (v3.13+)
- [UV Package Manager](https://github.com/astral-sh/uv) (recommended) or pip
- Git and a GitHub account

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-name>
git checkout 001-task-crud-auth  # Feature branch
```

### 2. Environment Variables

Create the necessary environment files for both frontend and backend:

#### Backend Environment (`.env` in backend/ directory)

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_app_dev"

# JWT Configuration
SECRET_KEY="your-super-secret-key-change-this-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:8000"
```

#### Frontend Environment (`.env.local` in frontend/ directory)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:8000/api"

# Better Auth Configuration
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-better-auth-secret"
```

### 3. Development Environment Setup

#### Option A: Using Docker Compose (Recommended)

The project includes a `docker-compose.yml` file that sets up the complete development environment:

```bash
# Navigate to project root
cd /path/to/project

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# The services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - Database: localhost:5432 (internal: postgres:5432)
```

#### Option B: Local Installation

##### Backend Setup

```bash
# Navigate to backend directory
cd backend/

# Install dependencies using UV (recommended)
uv venv  # Create virtual environment
source .venv/bin/activate  # Activate virtual environment (Linux/Mac)
# On Windows: .venv\Scripts\activate

uv pip install -e .  # Install project dependencies

# Or if using pip:
pip install -e .
```

##### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install
# or yarn install
# or pnpm install
```

## Running the Application

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up --build

# In a separate terminal, run database migrations
docker-compose exec backend alembic upgrade head
```

### Manual Startup

#### Backend

```bash
# Terminal 1: Start backend
cd backend/
uv venv && source .venv/bin/activate  # Activate virtual environment
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
# Terminal 2: Start frontend
cd frontend/
npm run dev
# or yarn dev
# or pnpm dev
```

## Database Migrations

The project uses Alembic for database migrations:

```bash
# Navigate to backend directory
cd backend/

# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations to database
alembic upgrade head

# Downgrade to previous version
alembic downgrade -1
```

## Development Workflow

### Backend Development

1. Make changes to models in `backend/src/models/`
2. Update schemas in `backend/src/schemas/`
3. Modify API endpoints in `backend/src/routers/`
4. Create/update database migrations when changing schema
5. Run tests: `pytest`

### Frontend Development

1. Add new pages in `frontend/app/` following App Router conventions
2. Create reusable components in `frontend/components/ui/`
3. Add API calls in `frontend/lib/api.ts`
4. Update types in `frontend/lib/types.ts`
5. Run tests: `npm test` or `npm run test:watch`

## Running Tests

### Backend Tests

```bash
cd backend/

# Run all tests
pytest

# Run tests with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run tests with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend/

# Run component tests
npm test

# Run E2E tests
npx playwright test

# Run tests in watch mode
npm run test:watch
```

## API Documentation

The backend automatically generates OpenAPI documentation:

- Interactive docs: http://localhost:8000/docs
- Alternative JSON format: http://localhost:8000/openapi.json

## Common Commands

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# Reset database (removes all data)
docker-compose down -v && docker-compose up --build

# Access backend container
docker-compose exec backend bash

# Access database container
docker-compose exec db psql -U postgres -d task_app_dev

# Run backend tests inside container
docker-compose exec backend pytest

# Run frontend tests inside container
docker-compose exec frontend npm test
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Ensure ports 3000, 8000, and 5432 are available
2. **Database Connection Issues**: Verify DATABASE_URL in backend/.env
3. **Environment Variables Not Loading**: Check that .env files are properly configured
4. **Dependency Issues**: Clean installation with `rm -rf node_modules && npm install` or recreate Python venv

### Development Tips

- Use VS Code with Python and TypeScript extensions for best experience
- Enable format-on-save to maintain code consistency
- Use the provided CLAUDE.md files for AI agent instructions
- Refer to the API contracts in `specs/001-task-crud-auth/contracts/` for API specifications
- All database queries must filter by user_id for security compliance

## Ready to Develop!

Once you've completed the setup, you should have:

- ✅ Backend running at http://localhost:8000
- ✅ Frontend running at http://localhost:3000
- ✅ Database accessible at localhost:5432
- ✅ Working authentication flow
- ✅ Ready-to-use development environment with hot reload