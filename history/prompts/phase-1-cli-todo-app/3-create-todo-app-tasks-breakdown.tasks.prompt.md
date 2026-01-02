---
id: 3
title: Create Todo App Tasks Breakdown
stage: tasks
date: 2025-12-11
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-app
branch: master
user: claude
command: /sp.tasks
labels: [tasks, breakdown, cli-todo-app, implementation]
links:
  spec: specs/phase-1-cli/specs.md
  plan: specs/phase-1-cli/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/phase-1-cli/tasks.md
tests:
 - none
---

## Prompt

Break down the implementation plan in specs/plans/all-features-plan.md into specific, actionable tasks for implementing ALL 5 features.

Each task should be atomic with exact file paths, imports, and implementation details.

Generate these tasks:

TASK 1: Setup Complete Project Structure
- Create all directories: src/, src/models/, src/managers/, src/ui/
- Create all __init__.py files
- Create pyproject.toml with Python 3.13+ requirement
- Show complete directory tree

TASK 2: Implement Task Data Model
File: src/models/task.py
- Import: dataclasses, datetime
- Create Task dataclass with fields:
  - id: int
  - title: str
  - description: str
  - completed: bool = False
  - created_at: datetime = field(default_factory=datetime.now)
- Add __str__ method for nice display

TASK 3: Implement TaskManager - Core Structure
File: src/managers/task_manager.py
- Import: List, Tuple, Optional from typing
- Import: Task from ..models.task
- Class TaskManager with:
  - tasks: List[Task] = []
  - next_id: int = 1

TASK 4: Implement TaskManager - Add Task (Feature 1)
File: src/managers/task_manager.py
- Method: add_task(title: str, description: str = "") -> Tuple[Optional[Task], str]
- Validation logic:
  - Strip whitespace
  - Check title not empty
  - Check title ≤ 200 chars
  - Check description ≤ 1000 chars
- Create task, increment ID, append to list
- Return (task, success_message) or (None, error_message)

TASK 5: Implement TaskManager - List & Get (Feature 2)
File: src/managers/task_manager.py
- Method: list_tasks(filter: str = "all") -> List[Task]
  - Filter by "all", "pending", "completed"
- Method: get_task_count(filter: str = "all") -> int
- Method: get_task(task_id: int) -> Optional[Task]
  - Find task by ID

TASK 6: Implement TaskManager - Update (Feature 3)
File: src/managers/task_manager.py
- Method: update_task(task_id: int, title: str = None, description: str = None) -> Tuple[Optional[Task], str]
- Find task by ID
- Validate new title/description if provided
- Update task fields
- Return (task, success_message) or (None, error_message)

TASK 7: Implement TaskManager - Delete (Feature 4)
File: src/managers/task_manager.py
- Method: delete_task(task_id: int) -> Tuple[bool, str]
- Find task by ID
- Remove from list
- Return (True, success_message) or (False, error_message)

TASK 8: Implement TaskManager - Mark Complete (Feature 5)
File: src/managers/task_manager.py
- Method: mark_complete(task_id: int, completed: bool) -> Tuple[Optional[Task], str]
- Find task by ID
- Toggle completed status
- Return (task, success_message) or (None, error_message)

TASK 9: Implement ConsoleUI - Core Structure & Menu
File: src/ui/console_ui.py
- Import TaskManager
- Initialize with TaskManager instance
- Method: display_main_menu() -> str
  - Show ASCII formatted menu with 6 options
  - Get user choice
  - Validate choice 1-6
  - Return choice

TASK 10: Implement ConsoleUI - Add Task UI (Feature 1)
File: src/ui/console_ui.py
- Method: add_task_ui() -> None
- Display header "=== Add New Task ==="
- Prompt for title
- Prompt for description
- Call task_manager.add_task()
- Display success or error
- Wait for Enter to continue

TASK 11: Implement ConsoleUI - View Tasks UI (Feature 2)
File: src/ui/console_ui.py
- Method: view_tasks_ui() -> None
- Display header with table borders
- Get tasks from task_manager.list_tasks()
- Display in formatted table with columns
- Show task count
- Prompt for filter option
- Redisplay if filter changed
- Helper: format_task_row(task) -> str
- Helper: format_date(datetime) -> str

TASK 12: Implement ConsoleUI - Update Task UI (Feature 3)
File: src/ui/console_ui.py
- Method: update_task_ui() -> None
- Prompt for task ID
- Show current task details
- Prompt for new title (or keep existing)
- Prompt for new description (or keep existing)
- Call task_manager.update_task()
- Display success or error

TASK 13: Implement ConsoleUI - Delete Task UI (Feature 4)
File: src/ui/console_ui.py
- Method: delete_task_ui() -> None
- Prompt for task ID
- Show task details
- Ask for confirmation (Y/N)
- Call task_manager.delete_task() if confirmed
- Display result message

TASK 14: Implement ConsoleUI - Mark Complete UI (Feature 5)
File: src/ui/console_ui.py
- Method: mark_complete_ui() -> None
- Prompt for task ID
- Show current status
- Ask to toggle (Y/N)
- Call task_manager.mark_complete()
- Display success message

TASK 15: Implement ConsoleUI - Main Loop
File: src/ui/console_ui.py
- Method: run() -> None
- Loop until user exits
- Display menu and get choice
- Route to appropriate UI method:
  - 1 → add_task_ui()
  - 2 → view_tasks_ui()
  - 3 → update_task_ui()
  - 4 → delete_task_ui()
  - 5 → mark_complete_ui()
  - 6 → break and exit
- Handle invalid choices

TASK 16: Implement Main Application
File: src/main.py
- Import TaskManager and ConsoleUI
- Function: main() -> None
  - Create TaskManager instance
  - Create ConsoleUI instance
  - Call ui.run()
  - Handle KeyboardInterrupt gracefully
- Add if __name__ == "__main__": main()

TASK 17: Create README
File: README.md
- Project description
- Features list (all 5)
- Setup instructions with UV
- How to run
- Usage examples

TASK 18: Create CLAUDE.md
File: CLAUDE.md
- Project structure explanation
- How to add new features
- Spec-driven workflow

Make each task implementation-ready with complete details.

Save as: specs/tasks.md

## Response snapshot

Created a comprehensive task breakdown for the Todo App with 67 specific, actionable tasks organized into 8 phases. The tasks are structured to follow the user stories from the specification and enable parallel development where possible. Each task follows the required format with checkboxes, task IDs, and story labels where appropriate.

## Outcome

- ✅ Impact: Created detailed task breakdown enabling parallel development of all 5 features
- 🧪 Tests: none
- 📁 Files: Created specs/tasks.md with complete task breakdown
- 🔁 Next prompts: Will use this task breakdown for implementation
- 🧠 Reflection: Tasks are organized by user stories and dependencies to enable efficient development

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation of tasks in parallel