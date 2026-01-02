# Todo App - Claude CLI Development Guide

## Project Structure

This project follows the architecture specified in the constitution and implements all five required features:

- **Data Models**: Located in `src/todo_app/models/`
- **Business Logic**: Located in `src/todo_app/managers/`
- **User Interface**: Located in `src/todo_app/ui/`
- **Entry Point**: `src/main.py`

## Development Workflow

### Code Generation

All code for this project must be generated using Claude CLI. Manual code changes are prohibited per the project constitution.

### Implementation Process

1. Specifications are written first in the `specs/` directory
2. Implementation plans are created based on specifications
3. Code is generated following the implementation plan
4. Tests are implemented to verify functionality
5. Implementation is verified against the original specification

### Quality Standards

- All functions must have type hints
- All public methods must have docstrings
- Maximum cyclomatic complexity of 5 per function
- Maximum 50 lines per function
- Meaningful variable and function names
- Proper error handling with custom exceptions

### Architecture

The application follows a clear separation of concerns:

- **Models**: Define data structures (Task)
- **Managers**: Handle business logic (TaskManager)
- **UI**: Handle user interaction (ConsoleUI)
- **Main**: Orchestrates the application

## Key Components

### Task Model
- Dataclass with ID, title, description, status, and creation timestamp
- Automatic ID generation starting from 1
- Default incomplete status
- ISO format timestamp for creation date

### Task Manager
- In-memory storage of tasks
- CRUD operations for tasks
- Input validation
- Custom exception handling

### Console UI
- Menu-driven interface
- Formatted table display for tasks
- Input validation and error handling
- User-friendly messages

## Testing Strategy

Tests should cover:
- All five core features
- Input validation scenarios
- Error handling
- Edge cases
- Integration between components

## Deployment

The application is a console application with in-memory storage. No deployment beyond running the Python script is required.

## Active Technologies
- Python 3.10+ + typer (CLI framework), rich (terminal output), python-dateutil (natural language date parsing), pydantic (data validation) (001-enhanced-todo-cli)
- JSON file (~/.todo_app/tasks.json with fallback to ./tasks.json) (001-enhanced-todo-cli)

## Recent Changes
- 001-enhanced-todo-cli: Added Python 3.10+ + typer (CLI framework), rich (terminal output), python-dateutil (natural language date parsing), pydantic (data validation)
