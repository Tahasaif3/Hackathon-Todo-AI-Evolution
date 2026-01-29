from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session
from typing import Optional
from uuid import UUID
from pydantic import BaseModel
import json
import logging

from ..models.user import User
from ..models.conversation import Conversation
from ..models.message import Message
from ..database import get_session_dep
from ..utils.deps import get_current_user
from ..services.conversation_service import ConversationService
from ..agent_config import todo_agent_config
from ..mcp_server import get_mcp_tools_for_gemin_api
from ..mcp_tools.task_tools import (
    execute_add_task,
    execute_list_tasks,
    execute_complete_task,
    execute_delete_task,
    execute_update_task,
    execute_create_project,
    execute_list_projects,
    execute_get_calendar,
    AddTaskParams,
    ListTasksParams,
    CompleteTaskParams,
    DeleteTaskParams,
    UpdateTaskParams,
    CreateProjectParams,
    ListProjectsParams,
    GetCalendarParams
)

router = APIRouter(prefix="/api/{user_id}/chat", tags=["chat"])

logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list = []

@router.post("/", response_model=ChatResponse)
def chat(
    user_id: UUID,
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session_dep)
):
    """
    Handle chat requests from users using AI assistant with tool calling.
    """
    logger.info(f"Chat endpoint called with user_id: {user_id}, current_user.id: {current_user.id}")

    # Verify that the user_id in the URL matches the authenticated user
    if current_user.id != user_id:
        logger.warning(f"User ID mismatch: path user_id={user_id}, auth user_id={current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Access denied"
        )

    # Get or create conversation
    conversation_id = chat_request.conversation_id
    if conversation_id is None:
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        conversation_id = conversation.id
    else:
        conversation = session.get(Conversation, conversation_id)
        if not conversation or conversation.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

    # Store user message
    user_message = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role="user",
        content=chat_request.message
    )
    session.add(user_message)
    session.commit()

    # Get conversation history (last 10 messages for context)
    conversation_history = ConversationService.get_messages(
        conversation_id=conversation_id,
        user_id=user_id,
        db_session=session,
        limit=10
    )

    history_for_agent = []
    for msg in conversation_history:
        history_for_agent.append({
            "role": msg.role,
            "content": msg.content
        })

    agent_config = todo_agent_config
    tools = get_mcp_tools_for_gemin_api()

    messages = [
        {"role": "system", "content": agent_config["instructions"]},
        *history_for_agent,
        {"role": "user", "content": chat_request.message}
    ]

    try:
        # Call the AI agent with tools
        response = agent_config["client"].chat.completions.create(
            model=agent_config["model"],
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # If there are tool calls, execute them
        if tool_calls:
            # Add assistant's tool call message to history
            messages.append(response_message)

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)

                # Force the user_id to be the current user's ID for security
                function_args["user_id"] = str(user_id)

                logger.info(f"Executing tool: {function_name} with args: {function_args}")

                result = None
                try:
                    if function_name == "add_task":
                        result = execute_add_task(AddTaskParams(**function_args))
                    elif function_name == "list_tasks":
                        result = execute_list_tasks(ListTasksParams(**function_args))
                    elif function_name == "complete_task":
                        result = execute_complete_task(CompleteTaskParams(**function_args))
                    elif function_name == "delete_task":
                        result = execute_delete_task(DeleteTaskParams(**function_args))
                    elif function_name == "update_task":
                        result = execute_update_task(UpdateTaskParams(**function_args))
                    elif function_name == "create_project":
                        result = execute_create_project(CreateProjectParams(**function_args))
                    elif function_name == "list_projects":
                        result = execute_list_projects(ListProjectsParams(**function_args))
                    elif function_name == "get_calendar":
                        result = execute_get_calendar(GetCalendarParams(**function_args))

                    tool_result_content = json.dumps(result.dict() if result else {"error": "Unknown tool"})
                except Exception as e:
                    logger.error(f"Error executing tool {function_name}: {str(e)}")
                    tool_result_content = json.dumps({"error": str(e)})

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": tool_result_content,
                })

            # Get final response from AI after tool results
            second_response = agent_config["client"].chat.completions.create(
                model=agent_config["model"],
                messages=messages,
            )
            ai_response = second_response.choices[0].message.content
        else:
            ai_response = response_message.content

    except Exception as e:
        logger.error(f"Error in AI processing: {str(e)}")
        ai_response = f"I encountered an error processing your request. Please try again later. (Error: {str(e)})"

    # Store assistant response
    assistant_message = Message(
        conversation_id=conversation_id,
        user_id=user_id,
        role="assistant",
        content=ai_response
    )
    session.add(assistant_message)
    session.commit()

    return ChatResponse(
        conversation_id=conversation_id,
        response=ai_response,
        tool_calls=[] # We already handled them
    )