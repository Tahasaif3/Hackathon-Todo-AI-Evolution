import asyncio
from fastmcp import FastMCP
from .mcp_tools.task_tools import get_task_tools, execute_add_task, execute_list_tasks, execute_complete_task, execute_delete_task, execute_update_task
from pydantic import BaseModel


def create_mcp_server():
    """Create and configure the MCP server with task tools"""
    # Create the FastMCP server instance
    mcp_server = FastMCP("task-mcp-server")

    # Add each tool to the server with its handler
    @mcp_server.tool(
        name="add_task",
        description="Create a new task for the user",
        input_schema={
            "type": "object",
            "properties": {
                "user_id": {"type": "string", "description": "User ID to create task for"},
                "title": {"type": "string", "description": "Task title, 1-200 characters"},
                "description": {"type": "string", "description": "Task description, optional, max 1000 chars"}
            },
            "required": ["user_id", "title"]
        }
    )
    async def handle_add_task(user_id: str, title: str, description: str = None):
        from .mcp_tools.task_tools import AddTaskParams
        params = AddTaskParams(user_id=user_id, title=title, description=description)
        result = execute_add_task(params)
        return result.dict()

    @mcp_server.tool(
        name="list_tasks",
        description="Retrieve user's tasks",
        input_schema={
            "type": "object",
            "properties": {
                "user_id": {"type": "string", "description": "User ID to list tasks for"},
                "status": {"type": "string", "enum": ["all", "pending", "completed"], "default": "all"}
            },
            "required": ["user_id"]
        }
    )
    async def handle_list_tasks(user_id: str, status: str = "all"):
        from .mcp_tools.task_tools import ListTasksParams
        params = ListTasksParams(user_id=user_id, status=status)
        result = execute_list_tasks(params)
        return result.dict()

    @mcp_server.tool(
        name="complete_task",
        description="Mark a task as complete",
        input_schema={
            "type": "object",
            "properties": {
                "user_id": {"type": "string", "description": "User ID of the task owner"},
                "task_id": {"type": "integer", "description": "ID of the task to update"}
            },
            "required": ["user_id", "task_id"]
        }
    )
    async def handle_complete_task(user_id: str, task_id: int):
        from .mcp_tools.task_tools import CompleteTaskParams
        params = CompleteTaskParams(user_id=user_id, task_id=task_id)
        result = execute_complete_task(params)
        return result.dict()

    @mcp_server.tool(
        name="delete_task",
        description="Remove a task",
        input_schema={
            "type": "object",
            "properties": {
                "user_id": {"type": "string", "description": "User ID of the task owner"},
                "task_id": {"type": "integer", "description": "ID of the task to delete"}
            },
            "required": ["user_id", "task_id"]
        }
    )
    async def handle_delete_task(user_id: str, task_id: int):
        from .mcp_tools.task_tools import DeleteTaskParams
        params = DeleteTaskParams(user_id=user_id, task_id=task_id)
        result = execute_delete_task(params)
        return result.dict()

    @mcp_server.tool(
        name="update_task",
        description="Modify task details",
        input_schema={
            "type": "object",
            "properties": {
                "user_id": {"type": "string", "description": "User ID of the task owner"},
                "task_id": {"type": "integer", "description": "ID of the task to update"},
                "title": {"type": "string", "description": "New task title"},
                "description": {"type": "string", "description": "New task description"}
            },
            "required": ["user_id", "task_id"]
        }
    )
    async def handle_update_task(user_id: str, task_id: int, title: str = None, description: str = None):
        from .mcp_tools.task_tools import UpdateTaskParams
        params = UpdateTaskParams(user_id=user_id, task_id=task_id, title=title, description=description)
        result = execute_update_task(params)
        return result.dict()

    return mcp_server


# Global MCP server instance - create only when needed
_mcp_server_instance = None

def get_mcp_server_instance():
    global _mcp_server_instance
    if _mcp_server_instance is None:
        _mcp_server_instance = create_mcp_server()
    return _mcp_server_instance


def get_mcp_tools():
    """Get the list of MCP tools for registration with the agent"""
    # Return the tool definitions directly rather than accessing server instance
    from .mcp_tools.task_tools import get_task_tools
    return get_task_tools()

def get_mcp_tools_for_gemin_api():
    """Get the list of tools for Gemini API"""
    # Return the tool definitions in Gemini API format
    from .mcp_tools.task_tools import get_task_tools_for_gemin_api
    return get_task_tools_for_gemin_api()


# Run the server if this file is executed directly
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--stdio":
        # Run the server using stdio transport
        from fastmcp.stdio import run_stdio_server
        run_stdio_server(get_mcp_server_instance())
    else:
        print("Usage: python mcp_server.py --stdio")