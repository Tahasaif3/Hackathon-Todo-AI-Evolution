<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.0.0 (initial creation)
Added sections: All sections (initial constitution)
Removed sections: None
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Todo App Constitution

## Core Principles

### I. Code Generation Mandate
All code for the Todo App must be generated exclusively by Claude CLI; no manual code writing is permitted. This ensures consistency, adherence to clean code principles, and full utilization of the spec-driven development approach.

### II. Python Console Application
The application must be a Python 3.13+ console application with command-line interface for all user interactions. The interface shall be intuitive, provide clear feedback, and follow standard CLI conventions.

### III. In-Memory Storage (NON-NEGOTIABLE)
All data storage must be in-memory only; no external databases, files, or persistent storage mechanisms are allowed. This constraint supports the hackathon requirement for a lightweight, self-contained application.

### IV. Five Core Features
The application must implement exactly five essential features: Add Task, View Tasks, Update Task, Delete Task, and Mark Task Complete. No additional features should be implemented during Phase I.

### V. Clean Code Standards
All generated code must follow clean code principles: proper separation of concerns, meaningful variable names, appropriate type hints, comprehensive error handling, and clear documentation.

### VI. Spec-Driven Development
Development must follow strict spec-driven methodology: specifications written first → user approves → code generated → tests implemented → implementation verified against spec.

## Technology Stack Constraints

### Language and Runtime
- Python 3.13+ is the mandatory language for all implementation
- UV package manager must be used for all dependency management
- No external libraries beyond what's necessary for the core functionality
- Standard library should be preferred over third-party packages

### Project Structure
- Main application entry point: `main.py`
- Business logic modules in `src/todo_app/` directory
- Type definitions in `src/todo_app/types.py`
- Task management logic in `src/todo_app/tasks.py`
- Command-line interface in `src/todo_app/cli.py`
- Configuration in `src/config.py`
- Tests in `tests/` directory following the same structure as source
- Documentation in `docs/` directory

### Architecture Requirements
- In-memory data structures only (lists, dictionaries, classes)
- Proper separation between presentation (CLI), business logic (task management), and data layers
- Dependency injection where appropriate
- Single responsibility principle applied to all functions and classes

## Development Workflow

### Specification Process
- All features must begin with a detailed specification document
- Specifications must include acceptance criteria and edge cases
- Specifications must be reviewed and approved before implementation
- Specifications must be stored in `specs/` directory with feature-specific names

### Implementation Process
- Claude CLI generates all code based on specifications
- Each feature should be implemented in small, testable increments
- Code must be tested immediately after generation
- Iterative development with frequent verification against specifications

### Quality Assurance
- Unit tests must cover all business logic functions
- Integration tests must verify CLI functionality
- Error handling must be tested for all edge cases
- Code must pass type checking (mypy) before acceptance

### Version Control
- Each feature should be developed in its own branch
- Pull requests must include specification references
- All tests must pass before merging
- Commit messages must reference the corresponding specification

## Quality Standards

### Code Quality
- All functions must have type hints
- All public methods must have docstrings
- Maximum cyclomatic complexity of 5 per function
- Maximum 50 lines per function
- Meaningful variable and function names
- Proper error handling with custom exceptions where appropriate

### User Experience
- Clear and consistent command-line interface
- Helpful error messages for invalid inputs
- Confirmation prompts for destructive operations (delete tasks)
- Progress indicators for longer operations (though minimal in this case)
- Consistent formatting of task lists and information

### Error Handling
- All potential error scenarios must be anticipated
- User-friendly error messages that guide corrective action
- Graceful degradation when possible
- Logging of unexpected errors for debugging

## Governance

This constitution serves as the governing document for all development activities in the Todo App project. All team members must adhere to these principles and constraints. Any deviations must be documented as amendments to this constitution with proper justification and approval.

Amendments to this constitution require:
1. Clear justification for the change
2. Impact assessment on existing code and specifications
3. Approval from project stakeholders
4. Updates to all dependent artifacts (templates, specifications, etc.)

**Version**: 1.0.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2025-12-11