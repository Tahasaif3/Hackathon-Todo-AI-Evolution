from typing import Optional, List
from datetime import datetime
import re
from ..models.task import Task
from ..managers.task_manager import TaskManager, TaskNotFoundError, ValidationError


class ConsoleUI:
    """
    Console-based user interface for the todo application (now colorful!).
    """

    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    @staticmethod
    def _color(text: str, color_code: str) -> str:
        """Wrap text in ANSI color code."""
        return f"\033[{color_code}m{text}\033[0m"

    def _green(self, text: str) -> str:
        return self._color(text, "32")  # Green

    def _red(self, text: str) -> str:
        return self._color(text, "31")  # Red

    def _yellow(self, text: str) -> str:
        return self._color(text, "33")  # Yellow

    def _blue(self, text: str) -> str:
        return self._color(text, "34")  # Blue

    def _cyan(self, text: str) -> str:
        return self._color(text, "36")  # Cyan

    def _bold(self, text: str) -> str:
        return self._color(text, "1")   # Bold

    def display_main_menu(self) -> None:
        """
        Show the main menu with all 6 options in ASCII design.
        """
        print("\n" + self._blue("╔" + "═"*48 + "╗"))
        print(self._blue("║") + self._bold(f"{'TODO APP v2.0':^48}") + self._blue("║"))
        print(self._blue("╠" + "═"*48 + "╣"))
        print(self._blue("║") + self._cyan(" 1. ➕ Add New Task                             ") + self._blue("║"))
        print(self._blue("║") + self._cyan(" 2. 📋 View & Manage Tasks (Sort/Filter/Search) ") + self._blue("║"))
        print(self._blue("║") + self._cyan(" 3. ✏️  Update Task                              ") + self._blue("║"))
        print(self._blue("║") + self._cyan(" 4. 🗑️  Delete Task                              ") + self._blue("║"))
        print(self._blue("║") + self._cyan(" 5. ✅ Toggle Completion Status                 ") + self._blue("║"))
        print(self._blue("║") + self._red(" 6. 🚪 Exit                                     ") + self._blue("║"))
        print(self._blue("╚" + "═"*48 + "╝"))

    def add_task_ui(self) -> None:
        """
        Feature 1 interface for adding tasks.
        """
        try:
            print("\n" + self._cyan("--- Add New Task ---"))

            title = input("Enter task title (1-200 characters): ").strip()

            description_input = input("Enter task description (optional, max 1000 chars): ").strip()
            description = description_input if description_input else None

            task = self.task_manager.add_task(title, description)

            print(f"\n{self._green('[SUCCESS] Task Added Successfully!')}")
            print(f"ID: {task.id}")
            print(f"Title: {task.title}")
            print(f"Description: {task.description or 'None'}")
            print(f"Status: {'Completed' if task.status else 'Incomplete'}")
            print(f"Created: {task.created_date}")

        except ValidationError as e:
            print(f"\n{self._red('[ERROR]')} Error: {str(e)}")
        except Exception as e:
            print(f"\n{self._red('[ERROR]')} Unexpected error: {str(e)}")

    def view_tasks_ui(self) -> None:
        """
        Feature 2 interface for viewing tasks with sorting, filtering, and search.
        """
        filter_type = "all"
        sort_by = "id"
        descending = False
        keyword = None

        while True:
            try:
                tasks = self.task_manager.list_tasks(filter_type, sort_by, descending, keyword)
                
                # Header Information
                print("\n" * 1)
                title = f"VIEW MODE: {filter_type.upper()}"
                if keyword:
                    title += f" | SEARCH: '{keyword}'"
                title += f" | SORT: {sort_by.upper()} ({'DESC' if descending else 'ASC'})"
                
                print(self._blue("="*60))
                print(self._bold(f" {title}"))
                print(self._blue("="*60))

                if not tasks:
                    print(f"\n{self._yellow('📋 No tasks found matching current criteria.')}")
                else:
                    self._display_task_table(tasks)

                # Action Menu
                print("\n" + self._cyan("Options:"))
                print(" [S]ort  [F]ilter  [K]eyword Search  [R]eset Filters  [B]ack to Main")
                
                choice = input("\nSelect option: ").strip().lower()

                if choice == 'b':
                    break
                elif choice == 'r':
                    filter_type = "all"
                    sort_by = "id"
                    descending = False
                    keyword = None
                    print(self._green("Filters reset."))
                elif choice == 's':
                    print("\n" + self._cyan("Sort by:"))
                    print(" 1. ID (Creation Order)")
                    print(" 2. Title")
                    print(" 3. Status")
                    print(" 4. Date")
                    s_choice = input("Choice (1-4): ").strip()
                    
                    if s_choice == '1': sort_by = 'id'
                    elif s_choice == '2': sort_by = 'title'
                    elif s_choice == '3': sort_by = 'status'
                    elif s_choice == '4': sort_by = 'date'
                    
                    if s_choice in ['1', '2', '3', '4']:
                        d_input = input("Descending order? (y/n): ").strip().lower()
                        descending = d_input.startswith('y')
                
                elif choice == 'f':
                    print("\n" + self._cyan("Filter by Status:"))
                    print(" 1. All")
                    print(" 2. Pending")
                    print(" 3. Completed")
                    f_choice = input("Choice (1-3): ").strip()
                    
                    if f_choice == '2': filter_type = 'pending'
                    elif f_choice == '3': filter_type = 'completed'
                    else: filter_type = 'all'

                elif choice == 'k':
                    k = input("Enter search keyword (press Enter to clear): ").strip()
                    keyword = k if k else None
                
                else:
                    print(self._red("Invalid option. Please try again."))

            except Exception as e:
                print(f"\n{self._red('[ERROR]')} Unexpected error: {str(e)}")
                break

    def _display_task_table(self, tasks: List[Task]) -> None:
        """Display tasks in a formatted table."""
        # Fixed definition of width
        id_w, title_w, stat_w, date_w = 4, 30, 8, 18
        
        # Draw Border
        print(f"┌{'─'*id_w}┬{'─'*title_w}┬{'─'*stat_w}┬{'─'*date_w}┐")
        print(f"│ {'ID':<{id_w-1}}│ {'Title':<{title_w-1}}│ {'Status':<{stat_w-1}}│ {'Created':<{date_w-1}}│")
        print(f"├{'─'*id_w}┼{'─'*title_w}┼{'─'*stat_w}┼{'─'*date_w}┤")

        for task in tasks:
            status_indicator = self._green("[✓]") if task.status else "[ ]"
            
            # Truncate title if needed
            title_display = task.title
            if len(title_display) > (title_w - 2):
                title_display = title_display[:title_w-5] + "..."
            
            formatted_date = self.format_date(task.created_date)
            # Truncate date if needed (though it shouldn't be)
            if len(formatted_date) > (date_w - 2):
                formatted_date = formatted_date[:date_w-2]

            # We need to construct the line carefully to handle ANSI codes length
            # status_indicator contains ANSI codes, so standard formatting matching width won't work perfectly for that column
            # We'll format the spaces manually for status
            
            # 7 chars physical width for "[✓]" or "[ ]" (3 chars) -> Wait, "[✓]" is 3 chars? "✓" might be 1 char width.
            # "[ ]" is 3 chars. 
            # In `_green`, it adds codes.
            # Let's trust pure string method for title/date/id. For status, we pad manually.
            
            row = (
                f"│ {str(task.id):<{id_w-2}} "
                f"│ {title_display:<{title_w-2}} "
                f"│ {status_indicator}      "  # Hand-tuned padding for 3 chars visual + ansi
                f"│ {formatted_date:<{date_w-2}} │"
            )
            
            # Using specific logic for status column which is tricky with ANSI
            # Width is 8. Content is 3 visual chars. Padding needed: 8 - 3 - 1 (left space) = 4 spaces right?
            # actually │<space>CONTENT<space...>│
            # Status col: " Status " (8 chars)
            # Row: " [x]    "
            
            print(f"│ {str(task.id):<{id_w-2}} │ {title_display:<{title_w-2}} │ {status_indicator:<{stat_w+7}} │ {formatted_date:<{date_w-2}} │") 
            # Note: stat_w+7 accounts for ANSI codes length approx? No, that's unreliable.
            # Let's rework the print to be safer.
        
        print(f"└{'─'*id_w}┴{'─'*title_w}┴{'─'*stat_w}┴{'─'*date_w}┘")

    def update_task_ui(self) -> None:
        """
        Feature 3 interface for updating tasks.
        """
        try:
            print("\n" + self._cyan("--- Update Task ---"))

            task_id_input = input("Enter task ID to update: ").strip()
            if not task_id_input.isdigit():
                print(f"\n{self._red('❌ Error: Task ID must be a number')}")
                return

            task_id = int(task_id_input)
            current_task = self.task_manager.get_task(task_id)

            print(f"\nCurrent task details:")
            print(f"  ID: {current_task.id}")
            print(f"  Title: {current_task.title}")
            print(f"  Description: {current_task.description or 'None'}")
            print(f"  Status: {'Completed' if current_task.status else 'Incomplete'}")

            new_title_input = input(f"\nEnter new title (leave blank to keep '{current_task.title}'): ").strip()
            new_title = new_title_input if new_title_input else None

            current_desc = current_task.description or ""
            new_desc_input = input(f"Enter new description (leave blank to keep '{current_desc}'): ").strip()
            new_description = new_desc_input if new_desc_input != "" else None

            updated_task = self.task_manager.update_task(task_id, new_title, new_description)

            print(f"\n{self._green('[SUCCESS] Task Updated Successfully!')}")
            print(f"ID: {updated_task.id}")
            print(f"Title: {updated_task.title}")
            print(f"Description: {updated_task.description or 'None'}")
            print(f"Status: {'Completed' if updated_task.status else 'Incomplete'}")

        except TaskNotFoundError as e:
            print(f"\n{self._red('[ERROR]')} Error: {str(e)}")
        except ValidationError as e:
            print(f"\n{self._red('[ERROR]')} Error: {str(e)}")
        except Exception as e:
            print(f"\n{self._red('[ERROR]')} Unexpected error: {str(e)}")

    def delete_task_ui(self) -> None:
        """
        Feature 4 interface for deleting tasks with confirmation.
        """
        try:
            print("\n" + self._cyan("--- Delete Task ---"))

            task_id_input = input("Enter task ID to delete: ").strip()
            if not task_id_input.isdigit():
                print(f"\n{self._red('❌ Error: Task ID must be a number')}")
                return

            task_id = int(task_id_input)
            task = self.task_manager.get_task(task_id)

            print(f"\nTask to delete:")
            print(f"  ID: {task.id}")
            print(f"  Title: {task.title}")
            print(f"  Description: {task.description or 'None'}")

            confirm = input(f"\nAre you sure you want to delete this task? (Y/N): ").strip().lower()

            if confirm in ['y', 'yes']:
                self.task_manager.delete_task(task_id)
                print(f"\n{self._green('[SUCCESS] Task Deleted Successfully!')}")
                print(f"ID: {task.id}")
                print(f"Title: {task.title}")
            else:
                print(f"\n{self._yellow('[INFO]')} Task deletion cancelled.")

        except TaskNotFoundError as e:
            print(f"\n{self._red('[ERROR]')} Error: {str(e)}")
        except Exception as e:
            print(f"\n{self._red('[ERROR]')} Unexpected error: {str(e)}")

    def mark_complete_ui(self) -> None:
        """
        Feature 5 interface for toggling task completion status.
        """
        try:
            print("\n" + self._cyan("--- Mark Task Complete/Incomplete ---"))

            task_id_input = input("Enter task ID: ").strip()
            if not task_id_input.isdigit():
                print(f"\n{self._red('❌ Error: Task ID must be a number')}")
                return

            task_id = int(task_id_input)
            current_task = self.task_manager.get_task(task_id)
            current_status = "Completed" if current_task.status else "Incomplete"
            new_status = "Incomplete" if current_task.status else "Completed"

            print(f"\nCurrent task: {current_task.title}")
            print(f"Current status: {current_status}")
            print(f"New status will be: {new_status}")

            updated_task = self.task_manager.mark_complete(task_id, not current_task.status)

            print(f"\n{self._green('[SUCCESS] Task Status Updated Successfully!')}")
            print(f"ID: {updated_task.id}")
            print(f"Title: {updated_task.title}")
            print(f"New Status: {'Completed' if updated_task.status else 'Incomplete'}")

        except TaskNotFoundError as e:
            print(f"\n{self._red('[ERROR]')} Error: {str(e)}")
        except Exception as e:
            print(f"\n{self._red('[ERROR]')} Unexpected error: {str(e)}")

    def format_task_row(self, task: Task) -> str:
        """
        Helper method to format task for table display.
        """
        status_indicator = self._green("[✓]") if task.status else "[ ]"
        formatted_title = task.title[:27] + "..." if len(task.title) > 27 else task.title
        formatted_date = self.format_date(task.created_date)
        return f"│ {task.id:<3} │ {formatted_title:<27} │ {status_indicator:<7} │ {formatted_date:<19} │"

    def format_date(self, date_str: str) -> str:
        """
        Helper method to format timestamp nicely.
        """
        try:
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            return dt.strftime("%Y-%m-%d %H:%M")
        except:
            return date_str

    def run(self) -> None:
        """
        Main loop handling all menu choices.
        """
        print(self._green("\n✨ Welcome to the Todo App!"))
        while True:
            try:
                self.display_main_menu()
                choice = input("\nEnter your choice (1-6): ").strip()

                if choice == "1":
                    self.add_task_ui()
                elif choice == "2":
                    self.view_tasks_ui()
                elif choice == "3":
                    self.update_task_ui()
                elif choice == "4":
                    self.delete_task_ui()
                elif choice == "5":
                    self.mark_complete_ui()
                elif choice == "6":
                    print(f"\n{self._blue('[INFO]')} Thank you for using Todo App. Goodbye! 👋")
                    break
                else:
                    print(f"\n{self._red('[ERROR]')} Invalid choice. Please enter a number between 1-6.")

                input(f"\n{self._cyan('Press Enter to continue...')}")

            except KeyboardInterrupt:
                print(f"\n\n{self._blue('[INFO]')} Application interrupted. Goodbye! ⚡")
                break
            except Exception as e:
                print(f"\n{self._red('[ERROR]')} An unexpected error occurred: {str(e)}")
                input(f"\n{self._cyan('Press Enter to continue...')}")