# Todo App - Task Implementation Plan

## Feature Overview
Todo App console application implementing five core features: Add Task, View Tasks, Update Task, Delete Task, Mark Task Complete/Incomplete.

## Implementation Strategy
This plan delivers the Todo App in phases, starting with foundational setup and progressing through each user story. Each phase builds upon the previous to ensure a working application at every step.

## Dependencies
- Python 3.13+
- UV package manager
- Standard library only (no external dependencies)

## Parallel Execution Examples
- UI components can be developed in parallel with business logic after data models are established
- Individual feature UI implementations can be parallelized once TaskManager is complete

---

## Phase 1: Project Setup

### Goal
Establish project structure and foundational files required for all user stories.

### Independent Test Criteria
- Project directory structure is created
- Package configuration is valid
- Basic imports work without errors

### Tasks
- [ ] T001 Create complete project structure with all directories: src/, src/todo_app/, src/todo_app/models/, src/todo_app/managers/, src/todo_app/ui/
- [ ] T002 Create all __init__.py files in package directories
- [ ] T003 Create pyproject.toml with Python 3.13+ requirement and proper configuration
- [ ] T004 [P] Create README.md with project description, features list, setup instructions, and usage examples
- [ ] T005 [P] Create CLAUDE.md with project structure explanation, workflow, and development guidelines

---

## Phase 2: Foundational Components

### Goal
Implement core data models and business logic layer that will support all user stories.

### Independent Test Criteria
- Task model can be instantiated with required fields
- TaskManager can create, store, and retrieve tasks
- All validation logic works correctly
- Error handling is implemented

### Tasks
- [ ] T006 [P] Implement Task data model in src/todo_app/models/task.py with id, title, description, status, created_date fields and __str__ method
- [ ] T007 [P] Implement TaskManager core structure in src/todo_app/managers/task_manager.py with tasks list and next_id counter
- [ ] T008 [P] [US1] Implement TaskManager.add_task() method with title and description validation (1-200 chars for title, 0-1000 for description)
- [ ] T009 [P] [US2] Implement TaskManager.list_tasks() method with filtering by all/pending/completed
- [ ] T010 [P] [US2] Implement TaskManager.get_task_count() method with filtering capability
- [ ] T011 [P] [US2] Implement TaskManager.get_task() method to find task by ID
- [ ] T012 [P] [US3] Implement TaskManager.update_task() method with validation for updating title/description
- [ ] T013 [P] [US4] Implement TaskManager.delete_task() method to remove task by ID
- [ ] T014 [P] [US5] Implement TaskManager.mark_complete() method to toggle task completion status
- [ ] T015 [P] Implement custom exception classes TaskNotFoundError and ValidationError

---

## Phase 3: User Story 1 - Add Task

### Goal
Enable users to add new tasks with title and optional description.

### User Story
As a user, I want to add tasks to my todo list so that I can keep track of things I need to do.

### Independent Test Criteria
- User can add a task with a valid title and no description
- User can add a task with both title and description
- Input validation prevents invalid titles (empty, too long)
- Input validation prevents invalid descriptions (too long)
- Added tasks are stored and can be retrieved

### Tasks
- [ ] T016 [P] [US1] Implement ConsoleUI.add_task_ui() method to handle user input for task creation
- [ ] T017 [P] [US1] Add display_main_menu() method in ConsoleUI with ASCII formatted menu
- [ ] T018 [P] [US1] Implement ConsoleUI initialization with TaskManager dependency injection
- [ ] T019 [P] [US1] Create main.py with TaskManager and ConsoleUI initialization
- [ ] T020 [P] [US1] Add if __name__ == "__main__": main() block to run the application
- [ ] T021 [P] [US1] Test basic add functionality with valid inputs
- [ ] T022 [P] [US1] Test validation for empty title
- [ ] T023 [P] [US1] Test validation for title too long (>200 chars)
- [ ] T024 [P] [US1] Test validation for description too long (>1000 chars)

---

## Phase 4: User Story 2 - View Tasks

### Goal
Enable users to view their tasks in a formatted table with filtering options.

### User Story
As a user, I want to view my tasks so that I can see what I need to do and track my progress.

### Independent Test Criteria
- User can view all tasks in a formatted table
- User can filter tasks by pending/completed status
- Task count is displayed correctly
- Empty task list shows friendly message
- Status indicators are correct ([ ] for pending, [✓] for completed)

### Tasks
- [ ] T025 [P] [US2] Implement ConsoleUI.view_tasks_ui() method to display tasks in formatted table
- [ ] T026 [P] [US2] Implement format_task_row() helper method to format individual task rows
- [ ] T027 [P] [US2] Implement format_date() helper method to format timestamps nicely
- [ ] T028 [P] [US2] Add filter selection to view_tasks_ui() method
- [ ] T029 [P] [US2] Test viewing all tasks when none exist (empty list)
- [ ] T030 [P] [US2] Test viewing all tasks when multiple tasks exist
- [ ] T031 [P] [US2] Test viewing pending tasks only
- [ ] T032 [P] [US2] Test viewing completed tasks only
- [ ] T033 [P] [US2] Test proper formatting of task table with borders and headers

---

## Phase 5: User Story 3 - Update Task

### Goal
Enable users to update existing tasks by modifying title and/or description.

### User Story
As a user, I want to update my tasks so that I can modify titles or descriptions as needed.

### Independent Test Criteria
- User can select a task by ID and update its title
- User can select a task by ID and update its description
- User can update both title and description simultaneously
- User can keep existing values when not providing new ones
- Input validation prevents invalid updates

### Tasks
- [ ] T034 [P] [US3] Implement ConsoleUI.update_task_ui() method to handle task updates
- [ ] T035 [P] [US3] Add task ID input validation in update_task_ui()
- [ ] T036 [P] [US3] Show current task details before prompting for updates
- [ ] T037 [P] [US3] Allow keeping existing values when inputs are blank
- [ ] T038 [P] [US3] Test updating task title only
- [ ] T039 [P] [US3] Test updating task description only
- [ ] T040 [P] [US3] Test updating both title and description
- [ ] T041 [P] [US3] Test validation error for invalid title during update
- [ ] T042 [P] [US3] Test error when updating non-existent task

---

## Phase 6: User Story 4 - Delete Task

### Goal
Enable users to delete tasks with confirmation to prevent accidental deletion.

### User Story
As a user, I want to delete tasks so that I can remove items I no longer need to track.

### Independent Test Criteria
- User can select a task by ID and delete it
- Confirmation prompt prevents accidental deletion
- User can cancel deletion
- Deleted tasks no longer appear in the system
- Error handling for non-existent tasks

### Tasks
- [ ] T043 [P] [US4] Implement ConsoleUI.delete_task_ui() method with confirmation prompt
- [ ] T044 [P] [US4] Show task details before asking for confirmation
- [ ] T045 [P] [US4] Implement confirmation logic (Y/N)
- [ ] T046 [P] [US4] Show success message after deletion
- [ ] T047 [P] [US4] Test successful deletion of existing task
- [ ] T048 [P] [US4] Test error when deleting non-existent task
- [ ] T049 [P] [US4] Test confirmation prompt behavior
- [ ] T050 [P] [US4] Test that deleted task no longer appears in task list

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete

### Goal
Enable users to toggle the completion status of tasks.

### User Story
As a user, I want to mark tasks as complete or incomplete so that I can track my progress.

### Independent Test Criteria
- User can select a task by ID and toggle its completion status
- Current status is displayed before toggling
- Status change is reflected in the system
- Error handling for non-existent tasks

### Tasks
- [ ] T051 [P] [US5] Implement ConsoleUI.mark_complete_ui() method to toggle task status
- [ ] T052 [P] [US5] Show current task status before toggling
- [ ] T053 [P] [US5] Confirm successful status toggle
- [ ] T054 [P] [US5] Test marking incomplete task as complete
- [ ] T055 [P] [US5] Test marking complete task as incomplete
- [ ] T056 [P] [US5] Test error when toggling non-existent task
- [ ] T057 [P] [US5] Test status change reflects in task list display

---

## Phase 8: Application Integration & Polish

### Goal
Complete the main application loop and ensure all features work together seamlessly.

### Independent Test Criteria
- Main menu correctly routes to all feature methods
- Application handles invalid menu choices gracefully
- Application can be exited cleanly
- All features work together in sequence
- Error handling doesn't break application flow

### Tasks
- [ ] T058 [P] Implement ConsoleUI.run() main loop to handle menu navigation
- [ ] T059 [P] Add menu routing to connect main menu choices to feature methods
- [ ] T060 [P] Handle invalid menu choices gracefully with error messages
- [ ] T061 [P] Implement graceful exit functionality
- [ ] T062 [P] Add KeyboardInterrupt handling for graceful shutdown
- [ ] T063 [P] Test complete workflow: add → view → update → mark → delete
- [ ] T064 [P] Test multiple operations on the same task
- [ ] T065 [P] Test operations on multiple different tasks
- [ ] T066 [P] Test error handling doesn't break application flow
- [ ] T067 [P] Test application state consistency after all operations

---

## Dependencies Between User Stories

### User Story Completion Order
1. **User Story 1 (Add Task)** - Foundation for all other stories
2. **User Story 2 (View Tasks)** - Can be implemented after data models
3. **User Story 3 (Update Task)** - Depends on data models and get_task
4. **User Story 4 (Delete Task)** - Depends on data models and get_task
5. **User Story 5 (Mark Complete)** - Depends on data models and get_task

### Parallel Execution Opportunities
- After foundational components (T001-T015), all user story implementations can proceed in parallel
- UI methods for each feature can be developed independently
- Testing for each feature can be done independently after the feature is implemented

## MVP Scope
The minimum viable product includes:
- Project structure and configuration (T001-T005)
- Task model and manager with add functionality (T006-T008)
- Console UI with add task interface (T016-T020)
- This allows users to add tasks and forms the foundation for all other features.