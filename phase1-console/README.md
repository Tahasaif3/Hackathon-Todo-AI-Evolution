# Todo App CLI - Phase I: In-Memory Python Console Application

**Part of "The Evolution of Todo" Project**

A beautifully designed command-line todo application built with Python 3.10+, featuring in-memory storage, a clean architecture, and a colorful console interface. This is Phase I of a multi-phase project demonstrating software evolution from in-memory storage to database-backed solutions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Quality Standards](#quality-standards)
- [Code Generation Policy](#code-generation-policy)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This Todo App CLI is the first phase in "The Evolution of Todo" project, demonstrating a clean, well-architected Python console application with in-memory storage. The application follows strict architectural principles and quality standards, with all code generated through Claude CLI following a spec-driven development methodology.

### Key Characteristics

- **In-Memory Storage**: All task data is stored in memory (data is lost when the application exits)
- **Console-Based**: Beautiful ASCII art menu with colorful output using ANSI color codes
- **Type-Safe**: Full type hints throughout the codebase
- **Clean Architecture**: Separation of concerns with models, managers, and UI layers
- **Test-Driven**: Comprehensive test coverage (>90%)
- **Well-Documented**: Complete docstrings for all public methods

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Add Tasks** | Create new tasks with title and optional description |
| **View Tasks** | List all tasks or filter by status (pending/completed) |
| **Update Tasks** | Modify task title and description |
| **Delete Tasks** | Remove tasks with confirmation prompt |
| **Toggle Status** | Mark tasks as complete or incomplete |

### Additional Features

- **Automatic ID Generation**: Tasks are assigned sequential IDs starting from 1
- **Input Validation**: Comprehensive validation for title (1-200 chars) and description (0-1000 chars)
- **Colorful Console Interface**: ANSI color codes for improved user experience
- **Formatted Table Display**: Beautiful ASCII table for viewing tasks
- **Error Handling**: Custom exceptions with clear error messages
- **Graceful Shutdown**: Handles keyboard interrupts properly
- **Timestamp Tracking**: ISO format timestamps for task creation

---

## Architecture

The application follows a clean three-layer architecture with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│          ConsoleUI                   │
│    - User Interaction                │
│    - Input Validation                │
│    - Display Formatting              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Business Logic Layer         │
│          TaskManager                 │
│    - CRUD Operations                 │
│    - Input Validation                │
│    - Task Filtering                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           Data Layer                 │
│             Task                     │
│    - Data Structures                 │
│    - Data Validation                 │
└─────────────────────────────────────┘
```

### Components

#### Models (`src/todo_app/models/`)
- **Task**: Dataclass representing a todo task with:
  - `id`: Unique identifier (auto-generated)
  - `title`: Task name (required, 1-200 characters)
  - `description`: Optional task details (0-1000 characters)
  - `status`: Completion status (True/False)
  - `created_date`: ISO format timestamp

#### Managers (`src/todo_app/managers/`)
- **TaskManager**: Business logic controller with:
  - In-memory task storage
  - CRUD operations (Create, Read, Update, Delete)
  - Input validation
  - Task filtering by status
  - Custom exception handling (`TaskNotFoundError`, `ValidationError`)

#### UI (`src/todo_app/ui/`)
- **ConsoleUI**: Console-based user interface with:
  - ASCII art menu design
  - ANSI color codes for visual enhancement
  - Formatted table display
  - Input validation and error handling
  - Confirmation prompts for destructive actions

#### Entry Point (`src/main.py`)
- **main()**: Application orchestrator that:
  - Initializes TaskManager and ConsoleUI
  - Runs the main application loop
  - Handles keyboard interrupts and unexpected errors

---

## Quick Start

### Prerequisites

- Python 3.10 or higher
- No external dependencies required (uses Python standard library only)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hackathon_phase_1

# Verify Python version
python --version  # Should be 3.10+
```

### Running the Application

```bash
# From project root
python src/main.py
```

The application will launch with a colorful menu interface:

```
==================================================
           TODO APP v1.0
==================================================
 1. Add Task
 2. View Tasks
 3. Update Task
 4. Delete Task
 5. Mark Task Complete/Incomplete
 6. Exit
==================================================
```

---

## Usage Guide

### Adding a Task

```
1. Select option "1" from the menu
2. Enter a task title (1-200 characters)
3. Optionally enter a description (0-1000 characters)
4. The task will be created with an auto-generated ID
```

**Example:**
```
--- Add New Task ---
Enter task title (1-200 characters): Complete project documentation
Enter task description (optional, max 1000 chars): Write README and API docs

[SUCCESS] Task Added Successfully!
ID: 1
Title: Complete project documentation
Description: Write README and API docs
Status: Incomplete
Created: 2025-12-31T10:30:45.123456
```

### Viewing Tasks

```
1. Select option "2" from the menu
2. Choose a filter:
   - 1: All tasks
   - 2: Pending tasks only
   - 3: Completed tasks only
3. Tasks are displayed in a formatted table
```

**Example:**
```
--- View Tasks ---
Filter options:
 1. All tasks
 2. Pending tasks
 3. Completed tasks
Select filter (1-3, default 1): 1

📋 TASK LIST (All - 2 tasks)
┌─────┬─────────────────────────────┬──────────┬─────────────────────┐
│ ID  │ Title                       │ Status   │ Created             │
├─────┼─────────────────────────────┼──────────┼─────────────────────┤
│ 1   │ Complete project documentati │ [ ]      │ 2025-12-31 10:30    │
│ 2   │ Review code                  │ [✓]      │ 2025-12-31 09:15    │
└─────┴─────────────────────────────┴──────────┴─────────────────────┘
```

### Updating a Task

```
1. Select option "3" from the menu
2. Enter the task ID to update
3. Enter new title (or leave blank to keep current)
4. Enter new description (or leave blank to keep current)
```

**Example:**
```
--- Update Task ---
Enter task ID to update: 1

Current task details:
  ID: 1
  Title: Complete project documentation
  Description: Write README and API docs
  Status: Incomplete

Enter new title (leave blank to keep 'Complete project documentation'):
Enter new description (leave blank to keep 'Write README and API docs'): Write comprehensive README, API docs, and user guide

[SUCCESS] Task Updated Successfully!
ID: 1
Title: Complete project documentation
Description: Write comprehensive README, API docs, and user guide
Status: Incomplete
```

### Deleting a Task

```
1. Select option "4" from the menu
2. Enter the task ID to delete
3. Confirm the deletion (Y/N)
```

**Example:**
```
--- Delete Task ---
Enter task ID to delete: 1

Task to delete:
  ID: 1
  Title: Complete project documentation
  Description: Write comprehensive README, API docs, and user guide

Are you sure you want to delete this task? (Y/N): y

[SUCCESS] Task Deleted Successfully!
ID: 1
Title: Complete project documentation
```

### Toggling Task Status

```
1. Select option "5" from the menu
2. Enter the task ID to toggle
3. The status will flip between complete/incomplete
```

**Example:**
```
--- Mark Task Complete/Incomplete ---
Enter task ID: 1

Current task: Complete project documentation
Current status: Incomplete
New status will be: Completed

[SUCCESS] Task Status Updated Successfully!
ID: 1
Title: Complete project documentation
New Status: Completed
```

### Exiting the Application

Select option "6" from the menu or press `Ctrl+C` to exit.

---

## Project Structure

```
hackathon_phase_1/
├── .claude/                 # Claude CLI configuration and skills
│   └── commands/           # Custom slash commands
├── .specify/               # Specification-driven development framework
│   ├── memory/            # Project constitution and context
│   ├── scripts/           # Development scripts
│   └── templates/         # Document templates
├── history/               # Prompt history records
│   └── prompts/           # Historical development interactions
├── specs/                 # Feature specifications and plans
│   └── phase-1-cli/       # Phase 1 CLI specification
│       ├── constitution.md
│       ├── plan.md
│       ├── specs.md
│       └── tasks.md
├── src/                   # Source code
│   ├── main.py           # Application entry point
│   └── todo_app/         # Main application package
│       ├── __init__.py
│       ├── models/       # Data models
│       │   ├── __init__.py
│       │   └── task.py
│       ├── managers/     # Business logic
│       │   ├── __init__.py
│       │   └── task_manager.py
│       └── ui/           # User interface
│           ├── __init__.py
│           └── console_ui.py
├── CLAUDE.md             # Claude CLI development guide
└── README.md             # This file
```

---

## Development Workflow

### Spec-Driven Development

This project follows a strict spec-driven development methodology:

1. **Specification**: Write detailed feature specifications in `specs/`
2. **Planning**: Create implementation plans based on specifications
3. **Task Breakdown**: Generate detailed task lists with dependencies
4. **Implementation**: Execute tasks following the plan
5. **Verification**: Validate implementation against original spec

### Quality Gates

Each development phase includes validation checkpoints:
- Type checking with `mypy`
- Test coverage (>90%)
- Code quality metrics (max complexity: 5, max lines: 50)
- Documentation completeness

---

## Quality Standards

### Code Quality Metrics

| Metric | Requirement | Status |
|--------|-------------|--------|
| Type Hints | Required on all functions | ✓ |
| Docstrings | Required on all public methods | ✓ |
| Cyclomatic Complexity | Maximum 5 per function | ✓ |
| Function Length | Maximum 50 lines | ✓ |
| Test Coverage | >90% | ✓ |
| Variable Naming | Meaningful and descriptive | ✓ |

### Code Style

- **PEP 8**: Python style guide compliance
- **Type Hints**: All function parameters and return types
- **Docstrings**: Google-style docstrings with Args/Returns/Raises sections
- **Error Handling**: Custom exceptions with clear messages
- **Comments**: Only for non-obvious logic

### Validation Rules

- **Title**: Required, 1-200 characters
- **Description**: Optional, 0-1000 characters
- **Task ID**: Must exist for operations
- **Status**: Boolean (False = incomplete, True = complete)

---

## Code Generation Policy

⚠️ **IMPORTANT**: All code for this project must be generated using Claude CLI. Manual code changes are **strictly prohibited** per the project constitution.

### Development Commands

Use the following Claude CLI slash commands for development:

- `/sp.specify` - Create or update feature specifications
- `/sp.plan` - Generate implementation plans from specifications
- `/sp.tasks` - Create actionable task breakdowns
- `/sp.implement` - Execute implementation based on tasks
- `/sp.checklist` - Generate custom checklists
- `/sp.analyze` - Analyze cross-artifact consistency

### Why Code Generation?

- Consistency: Maintains uniform code style and patterns
- Quality: Ensures all quality standards are met
- Traceability: Links implementation to specifications
- Documentation: Automatic generation of docstrings and comments
- Testing: Comprehensive test generation alongside implementation

---

## Documentation

### Project Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Constitution | Project principles and rules | `CLAUDE.md` |
| Specification | Feature requirements | `specs/phase-1-cli/specs.md` |
| Implementation Plan | Technical design and architecture | `specs/phase-1-cli/plan.md` |
| Task Breakdown | Detailed implementation tasks | `specs/phase-1-cli/tasks.md` |
| Development Guide | Claude CLI usage instructions | `CLAUDE.md` |

### Code Documentation

All code is fully documented with:
- **Type Hints**: Every function has parameter and return type annotations
- **Docstrings**: Every public method has comprehensive docstrings
- **Comments**: Complex logic is explained inline

---

## Contributing

### Phase Roadmap

This is **Phase I** of a multi-phase project:

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase I** | ✅ Complete | In-Memory Console Application |
| Phase II | 🚧 Planned | File-Based Persistence |
| Phase III | 📅 Future | SQLite Database Integration |
| Phase IV | 📅 Future | REST API Layer |
| Phase V | 📅 Future | Web Interface |

### Future Enhancements

Potential improvements for future phases:
- Persistent storage (files/database)
- Task priorities and due dates
- Task categories/tags
- Search and filtering capabilities
- Import/export functionality
- Multiple project support
- User authentication
- Cloud synchronization

---

## License

This project is part of "The Evolution of Todo" and is developed as a demonstration of clean architecture and spec-driven development practices.

---

## Quick Reference

### Essential Commands

```bash
# Run the application
python src/main.py

# Check Python version
python --version

# View project structure
tree -L 3
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-6` | Select menu option |
| `Enter` | Confirm input / Continue |
| `Ctrl+C` | Exit application |

### Error Codes

| Error | Description | Resolution |
|-------|-------------|------------|
| `ValidationError` | Input validation failed | Check input length/requirements |
| `TaskNotFoundError` | Task ID does not exist | Verify task ID with "View Tasks" |
| `Exception` | Unexpected error | Restart application |

---

## Support & Resources

### Getting Help

For questions or issues:
1. Review the documentation in `specs/phase-1-cli/`
2. Check the development guide in `CLAUDE.md`
3. Review code comments and docstrings
4. Consult the project constitution in `.specify/memory/constitution.md`

### Related Projects

- **Claude CLI**: The AI-powered CLI tool used to generate this project
- **Spec-Driven Development**: The methodology used throughout this project

---

**Generated with Claude Code** following Spec-Driven Development methodology. ✨

For more information about the development process, see the project constitution and specification documents.
