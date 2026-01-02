#!/usr/bin/env python3
"""
Main entry point for the Todo App console application.
"""

from todo_app.managers.task_manager import TaskManager
from todo_app.ui.console_ui import ConsoleUI


def main() -> None:
    """
    Main function that initializes the application components and starts the UI loop.
    """
    try:
        # Initialize the task manager
        task_manager = TaskManager()

        # Initialize the console UI with the task manager
        console_ui = ConsoleUI(task_manager)

        # Start the application loop
        console_ui.run()

    except KeyboardInterrupt:
        print("\n\n[INFO] Application interrupted. Goodbye!")
    except Exception as e:
        print(f"\n[ERROR] An unexpected error occurred: {str(e)}")
        print("Please try restarting the application.")


if __name__ == "__main__":
    main()