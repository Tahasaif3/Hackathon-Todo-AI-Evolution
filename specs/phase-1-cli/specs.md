# Todo App Specification Document

## Overview

This document specifies the requirements for a Phase I Todo App console application built using Python 3.13+ with in-memory storage. The application implements five core features: Add Task, View Tasks, Update Task, Delete Task, and Mark Task Complete/Incomplete. This specification follows the project constitution and ensures all code is generated using Claude CLI.

## Shared Components

### Task Model
- **ID**: Integer, auto-generated starting from 1
- **Title**: String, 1-200 characters (required)
- **Description**: String, 0-1000 characters (optional)
- **Status**: Boolean, default False (incomplete)
- **Created Date**: ISO format timestamp when task was created

### TaskManager
- Manages in-memory collection of tasks
- Provides CRUD operations for tasks
- Handles validation and error handling
- Maintains task ID sequence

### ConsoleUI
- Handles user input and validation
- Formats and displays output
- Manages user interaction flow
- Provides clear error and success messages

## Main Menu Design

```
╔══════════════════════════════════════╗
║           TODO APP v1.0              ║
╠══════════════════════════════════════╣
║ 1. Add Task                          ║
║ 2. View Tasks                        ║
║ 3. Update Task                       ║
║ 4. Delete Task                       ║
║ 5. Mark Task Complete/Incomplete     ║
║ 6. Exit                              ║
╚══════════════════════════════════════╝
```

## Overall User Flow

1. Application starts and displays main menu
2. User selects a feature from the menu
3. Feature-specific flow executes
4. User returns to main menu after feature completion
5. User selects "Exit" to terminate application

---

## FEATURE 1: ADD TASK

### Feature ID: FT-ADD-TASK-001

### User Story
As a user, I want to add tasks to my todo list so that I can keep track of things I need to do.

### Detailed Acceptance Criteria
1. User can enter a task title (required, 1-200 characters) and description (optional, max 1000 characters)
2. System generates a unique task ID starting from 1 and incrementing for each new task
3. Task is created with status "incomplete" and a timestamp of creation
4. System validates inputs and displays clear error messages for invalid inputs
5. System confirms successful task creation with details

### Input Validation Rules

| Input Field | Validation Rule | Error Message |
|-------------|-----------------|---------------|
| Title | Required, 1-200 characters | "Title is required and must be between 1 and 200 characters" |
| Description | Optional, 0-1000 characters | "Description must be between 0 and 1000 characters" |

### Edge Cases
1. Title with exactly 1 character or 200 characters
2. Description with exactly 0 characters or 1000 characters
3. Title with special characters and whitespace
4. Empty input when prompted for title

### User Interaction Flow
1. User selects "Add Task" from main menu
2. System prompts for task title
3. System validates title input
4. System prompts for task description (optional)
5. System validates description input if provided
6. System creates task with auto-generated ID, incomplete status, and timestamp
7. System displays success confirmation with task details
8. System returns to main menu

### Success Message Format
```
✅ Task Added Successfully!
ID: {id}
Title: {title}
Description: {description or "None"}
Status: Incomplete
Created: {timestamp}
```

### Error Message Format
```
❌ Error: {error_message}
```

### Data Model Reference
```
Task {
  id: int (auto-incrementing, starting from 1)
  title: str (1-200 chars, required)
  description: str (0-1000 chars, optional)
  status: bool (default: False)
  created_date: str (ISO format timestamp)
}
```

---

## FEATURE 2: VIEW TASKS

### Feature ID: FT-VIEW-TASKS-002

### User Story
As a user, I want to view my tasks so that I can see what I need to do and track my progress.

### Detailed Acceptance Criteria
1. System displays all tasks in a formatted table with ID, Title, Status, and Created Date
2. Status indicators: [ ] for pending tasks, [✓] for completed tasks
3. System allows filtering by All, Pending, or Completed tasks
4. System shows total task count
5. System displays a friendly message when the task list is empty

### Input Validation Rules

| Input Field | Validation Rule | Error Message |
|-------------|-----------------|---------------|
| Filter Option | Must be 1, 2, or 3 (All, Pending, Completed) | "Invalid filter option. Please select 1, 2, or 3." |

### Edge Cases
1. No tasks exist in the system
2. All tasks are completed
3. All tasks are pending
4. Only one task exists

### User Interaction Flow
1. User selects "View Tasks" from main menu
2. System prompts for filter option (All/Pending/Completed)
3. System validates filter input
4. System displays tasks in formatted table based on filter
5. System shows total count of displayed tasks
6. System returns to main menu

### Success Message Format
```
📋 TASK LIST ({filter_type} - {count} tasks)
┌─────┬─────────────────────────────┬──────────┬─────────────────────┐
│ ID  │ Title                       │ Status   │ Created             │
├─────┼─────────────────────────────┼──────────┼─────────────────────┤
│ {id} │ {title}                    │ [ ]/{✓}  │ {date}              │
└─────┴─────────────────────────────┴──────────┴─────────────────────┘
```

### Error Message Format
```
❌ Error: {error_message}
```

---

## FEATURE 3: UPDATE TASK

### Feature ID: FT-UPDATE-TASK-003

### User Story
As a user, I want to update my tasks so that I can modify titles or descriptions as needed.

### Detailed Acceptance Criteria
1. User can select a task by ID
2. System allows updating title and/or description
3. System provides option to keep existing values or enter new ones
4. System validates new inputs with same rules as Add Task
5. System confirms successful update
6. System handles task not found errors gracefully

### Input Validation Rules

| Input Field | Validation Rule | Error Message |
|-------------|-----------------|---------------|
| Task ID | Must exist in the system | "Task with ID {id} not found" |
| Title | 1-200 characters (if provided) | "Title must be between 1 and 200 characters" |
| Description | 0-1000 characters (if provided) | "Description must be between 0 and 1000 characters" |

### Edge Cases
1. User enters non-existent task ID
2. User leaves title/description unchanged
3. User enters empty string to clear description
4. User enters maximum length for title or description

### User Interaction Flow
1. User selects "Update Task" from main menu
2. System prompts for task ID
3. System validates task exists
4. System displays current task details
5. System prompts for new title (with option to keep existing)
6. System prompts for new description (with option to keep existing)
7. System validates new inputs
8. System updates task with validated inputs
9. System displays success confirmation
10. System returns to main menu

### Success Message Format
```
✅ Task Updated Successfully!
ID: {id}
Title: {updated_title}
Description: {updated_description or "None"}
Status: {"Completed" if status else "Incomplete"}
```

### Error Message Format
```
❌ Error: {error_message}
```

---

## FEATURE 4: DELETE TASK

### Feature ID: FT-DELETE-TASK-004

### User Story
As a user, I want to delete tasks so that I can remove items I no longer need to track.

### Detailed Acceptance Criteria
1. User can select a task by ID
2. System displays task details before deletion for confirmation
3. System asks for confirmation (Y/N)
4. System only deletes if user confirms with 'Y' or 'y'
5. System shows success message after deletion
6. System handles task not found errors gracefully

### Input Validation Rules

| Input Field | Validation Rule | Error Message |
|-------------|-----------------|---------------|
| Task ID | Must exist in the system | "Task with ID {id} not found" |
| Confirmation | Must be 'Y', 'y', 'N', or 'n' | "Please enter 'Y' to confirm or 'N' to cancel" |

### Edge Cases
1. User enters non-existent task ID
2. User enters 'N' or 'n' for confirmation (cancels deletion)
3. User enters invalid confirmation response
4. Last remaining task is deleted

### User Interaction Flow
1. User selects "Delete Task" from main menu
2. System prompts for task ID
3. System validates task exists
4. System displays task details for confirmation
5. System asks for confirmation (Y/N)
6. System validates confirmation input
7. If confirmed, system deletes the task
8. System displays success message
9. System returns to main menu

### Success Message Format
```
✅ Task Deleted Successfully!
ID: {id}
Title: {title}
```

### Error Message Format
```
❌ Error: {error_message}
```

---

## FEATURE 5: MARK TASK COMPLETE/INCOMPLETE

### Feature ID: FT-MARK-TASK-005

### User Story
As a user, I want to mark tasks as complete or incomplete so that I can track my progress.

### Detailed Acceptance Criteria
1. User can select a task by ID
2. System toggles the completion status of the task
3. System shows current status before toggling
4. System confirms successful status toggle
5. System handles task not found errors gracefully

### Input Validation Rules

| Input Field | Validation Rule | Error Message |
|-------------|-----------------|---------------|
| Task ID | Must exist in the system | "Task with ID {id} not found" |

### Edge Cases
1. User enters non-existent task ID
2. Task is already marked as complete
3. Task is already marked as incomplete
4. User toggles status multiple times

### User Interaction Flow
1. User selects "Mark Task Complete/Incomplete" from main menu
2. System prompts for task ID
3. System validates task exists
4. System displays current task status
5. System toggles the task status
6. System displays success confirmation with new status
7. System returns to main menu

### Success Message Format
```
✅ Task Status Updated Successfully!
ID: {id}
Title: {title}
New Status: {"Completed" if new_status else "Incomplete"}
```

### Error Message Format
```
❌ Error: {error_message}
```

---

## Implementation Notes

### Assumptions
1. The application runs in a console/terminal environment
2. User inputs are validated in real-time
3. In-memory storage means data is lost when the application exits
4. The application maintains state only during the current session
5. No authentication or user accounts are required

### Dependencies and Constraints
1. Python 3.13+ with UV package manager
2. In-memory storage only (no persistent storage)
3. All code must be generated by Claude CLI
4. Console-based user interface
5. No external libraries beyond standard library requirements

### Success Criteria
1. Users can successfully add, view, update, delete, and mark tasks complete/incomplete
2. All input validation works as specified with clear error messages
3. User experience is intuitive and follows the specified interaction flows
4. Application handles all edge cases gracefully without crashing
5. Task data integrity is maintained throughout all operations