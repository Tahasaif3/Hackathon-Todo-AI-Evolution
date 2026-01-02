from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Task:
    """
    Represents a todo task with ID, title, description, status, and creation timestamp.
    """
    id: int
    title: str
    description: Optional[str] = None
    status: bool = False  # False = incomplete, True = complete
    created_date: str = None

    def __post_init__(self):
        if self.created_date is None:
            self.created_date = datetime.now().isoformat()

    def __str__(self) -> str:
        """
        Returns a string representation of the task for display purposes.
        """
        status_indicator = "✓" if self.status else " "
        return f"[{status_indicator}] {self.id}. {self.title}"