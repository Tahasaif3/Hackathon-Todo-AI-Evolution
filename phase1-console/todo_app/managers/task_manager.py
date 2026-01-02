from typing import List, Optional
from datetime import datetime
from ..models.task import Task


class TaskNotFoundError(Exception):
    """Raised when a task with a specific ID is not found."""
    pass


class ValidationError(Exception):
    """Raised when input validation fails."""
    pass


class TaskManager:
    """
    Manages in-memory collection of tasks with CRUD operations and validation.
    """

    def __init__(self):
        self._tasks: List[Task] = []
        self._next_id: int = 1

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """
        Add a new task with validation.

        Args:
            title: Task title (1-200 characters)
            description: Optional task description (0-1000 characters)

        Returns:
            Task: The created task object

        Raises:
            ValidationError: If title or description validation fails
        """
        # Validate inputs
        if not title or len(title) < 1 or len(title) > 200:
            raise ValidationError("Title is required and must be between 1 and 200 characters")

        if description and len(description) > 1000:
            raise ValidationError("Description must be between 0 and 1000 characters")

        # Create task with auto-generated ID
        task = Task(
            id=self._next_id,
            title=title,
            description=description,
            status=False,
            created_date=datetime.now().isoformat()
        )

        self._tasks.append(task)
        self._next_id += 1

        return task

    def list_tasks(self, filter_type: str = "all", sort_by: str = "id", 
                  descending: bool = False, keyword: Optional[str] = None) -> List[Task]:
        """
        Return filtered and sorted list of tasks.

        Args:
            filter_type: "all", "pending", or "completed"
            sort_by: "id", "title", "status", or "date"
            descending: Sort order (True for descending, False for ascending)
            keyword: Optional search keyword to filter by title/description

        Returns:
            List[Task]: Filtered and sorted list of tasks
        """
        # 1. Filter by status
        if filter_type == "pending":
            filtered_tasks = [task for task in self._tasks if not task.status]
        elif filter_type == "completed":
            filtered_tasks = [task for task in self._tasks if task.status]
        else:  # "all"
            filtered_tasks = self._tasks[:]  # Create a copy

        # 2. Filter by keyword
        if keyword:
            k = keyword.lower()
            filtered_tasks = [
                t for t in filtered_tasks 
                if k in t.title.lower() or (t.description and k in t.description.lower())
            ]

        # 3. Sort
        if sort_by == "title":
            filtered_tasks.sort(key=lambda x: x.title.lower(), reverse=descending)
        elif sort_by == "status":
            filtered_tasks.sort(key=lambda x: x.status, reverse=descending)
        elif sort_by == "date":
            filtered_tasks.sort(key=lambda x: x.created_date, reverse=descending)
        else:  # "id"
            filtered_tasks.sort(key=lambda x: x.id, reverse=descending)

        return filtered_tasks

    def get_task(self, task_id: int) -> Task:
        """
        Find and return a task by ID.

        Args:
            task_id: The ID of the task to retrieve

        Returns:
            Task: The task object

        Raises:
            TaskNotFoundError: If task with given ID doesn't exist
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        raise TaskNotFoundError(f"Task with ID {task_id} not found")

    def update_task(self, task_id: int, title: Optional[str] = None,
                   description: Optional[str] = None) -> Task:
        """
        Update an existing task with validation.

        Args:
            task_id: The ID of the task to update
            title: New title (1-200 characters) or None to keep existing
            description: New description (0-1000 characters) or None to keep existing

        Returns:
            Task: The updated task object

        Raises:
            TaskNotFoundError: If task with given ID doesn't exist
            ValidationError: If validation of new values fails
        """
        task = self.get_task(task_id)

        # Validate new inputs if provided
        if title is not None:
            if not title or len(title) < 1 or len(title) > 200:
                raise ValidationError("Title must be between 1 and 200 characters")
            task.title = title

        if description is not None:
            if len(description) > 1000:
                raise ValidationError("Description must be between 0 and 1000 characters")
            task.description = description

        return task

    def delete_task(self, task_id: int) -> bool:
        """
        Remove a task by ID.

        Args:
            task_id: The ID of the task to delete

        Returns:
            bool: True if task was deleted, False if not found
        """
        task = self.get_task(task_id)
        self._tasks.remove(task)
        return True

    def mark_complete(self, task_id: int, completed: bool = True) -> Task:
        """
        Toggle or set the completion status of a task.

        Args:
            task_id: The ID of the task to update
            completed: Whether the task should be marked as complete (default: True)

        Returns:
            Task: The updated task object

        Raises:
            TaskNotFoundError: If task with given ID doesn't exist
        """
        task = self.get_task(task_id)
        task.status = completed
        return task

    def get_task_count(self, filter_type: str = "all") -> int:
        """
        Count tasks based on filter.

        Args:
            filter_type: "all", "pending", or "completed"

        Returns:
            int: Number of tasks matching the filter
        """
        return len(self.list_tasks(filter_type))