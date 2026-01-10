# API Contracts

This directory contains the OpenAPI specifications for the Task Management application. These contracts define the API endpoints, request/response schemas, and authentication requirements.

## Available Contracts

### Authentication API
- **File**: `auth.openapi.yaml`
- **Purpose**: User registration and login functionality
- **Endpoints**:
  - `POST /auth/register` - Create new user account
  - `POST /auth/login` - Authenticate user and return JWT token

### Task Management API
- **File**: `tasks.openapi.yaml`
- **Purpose**: Complete CRUD operations for user tasks
- **Endpoints**:
  - `GET /tasks` - List user's tasks with optional filtering
  - `POST /tasks` - Create a new task
  - `GET /tasks/{task_id}` - Retrieve a specific task
  - `PUT /tasks/{task_id}` - Update an existing task
  - `DELETE /tasks/{task_id}` - Delete a task
  - `POST /tasks/{task_id}/toggle` - Toggle task completion status

## Security Requirements

All task-related endpoints require JWT authentication using the Bearer scheme:
- Authentication: `Authorization: Bearer <jwt_token>`
- Token validity: 7-day expiration
- Unauthorized access: Returns 404 (not 403) for security

## Data Validation

### User Registration
- Email: Valid email format, unique
- Password: Minimum 8 characters

### Task Operations
- Title: 1-200 characters (required)
- Description: Max 1000 characters (optional)
- Completed: Boolean value (default: false)

## Error Handling

All APIs return consistent error responses with the following structure:
```json
{
  "detail": "Error message",
  "status_code": 400,
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

## Versioning

- API Version: 1.0.0
- Base URL: `http://localhost:8000/api` (development)
- Compatible with both development (Docker) and production (Neon) PostgreSQL

## Usage

These OpenAPI contracts should be used as the single source of truth for:
1. Backend implementation - ensure all endpoints match the specification
2. Frontend API client generation - create type-safe API calls
3. Testing - validate API behavior against contracts
4. Documentation - auto-generate API documentation

## Compliance

These contracts comply with the feature specification requirements:
- User data isolation through user_id filtering
- JWT authentication with proper validation
- Complete CRUD operations for task management
- Proper error handling and response codes
- Input validation and sanitization