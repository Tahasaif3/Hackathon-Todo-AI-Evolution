---
title: "AI Chat MCP Tools Specification"
date: "2025-12-23"
stage: "spec"
id: "20251223-ai-chat-mcp-tools-spec"
feature: "002-ai-chat-mcp-tools"
---

# AI Chat MCP Tools Specification

## Prompt

Create a specification for:

# Phase III Architecture

## Component Diagram
```
┌─────────────────┐     ┌──────────────────────────────────────┐     ┌─────────────────┐
│                 │     │        FastAPI Backend                │     │                 │
│  ChatKit UI     │────▶│  ┌────────────────────────────────┐  │     │    Neon DB      │
│  (Frontend)     │     │  │   POST /api/{user_id}/chat     │  │     │                 │
│                 │     │  └───────────┬────────────────────┘  │     │  - tasks        │
│                 │     │              │                        │     │  - conversations│
│                 │     │              ▼                        │     │  - messages     │
│                 │     │  ┌────────────────────────────────┐  │     │                 │
│                 │◀────│  │  OpenAI Agents SDK             │  │     │                 │
│                 │     │  │  (Agent + Runner + Model)      │  │────▶│                 │
│                 │     │  └───────────┬────────────────────┘  │     │                 │
│                 │     │              │                        │     │                 │
│                 │     │              ▼                        │     │                 │
│                 │     │  ┌────────────────────────────────┐  │     │                 │
│                 │     │  │      MCP Server                │  │◀────│                 │
│                 │     │  │  (5 Tools for Task Ops)        │  │     │                 │
│                 │     │  └────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────┘     └─────────────────┘
```

## API Specification

### Chat Endpoint

**POST** `/api/{user_id}/chat`

**Headers:**
```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

**Request:**
```json
{
  "conversation_id": 123,  // Optional, creates new if omitted
  "message": "Add buy milk to my list"
}
```

**Response:**
```json
{
  "conversation_id": 123,
  "response": "Added 'Buy milk' to your list.",
  "tool_calls": [
    {
      "tool": "add_task",
      "result": {"task_id": 45, "title": "Buy milk"}
    }
  ]
}
```

## Database Schema Updates

### New Table: conversations
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### New Table: messages
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  user_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## MCP Tools Specification

### Tool 1: add_task
```python
{
  "name": "add_task",
  "description": "Create a new task for the user",
  "parameters": {
    "user_id": "string (required)",
    "title": "string (required, 1-200 chars)",
    "description": "string (optional, max 1000 chars)"
  },
  "returns": {
    "task_id": "integer",
    "status": "created",
    "title": "string"
  }
}
```

### Tool 2: list_tasks
```python
{
  "name": "list_tasks",
  "description": "Retrieve user's tasks",
  "parameters": {
    "user_id": "string (required)",
    "status": "string (optional: 'all', 'pending', 'completed')"
  },
  "returns": [
    {
      "id": "integer",
      "title": "string",
      "completed": "boolean",
      "created_at": "timestamp"
    }
  ]
}
```

### Tool 3: complete_task
```python
{
  "name": "complete_task",
  "description": "Mark a task as complete",
  "parameters": {
    "user_id": "string (required)",
    "task_id": "integer (required)"
  },
  "returns": {
    "task_id": "integer",
    "status": "completed",
    "title": "string"
  }
}
```

### Tool 4: delete_task
```python
{
  "name": "delete_task",
  "description": "Remove a task",
  "parameters": {
    "user_id": "string (required)",
    "task_id": "integer (required)"
  },
  "returns": {
    "task_id": "integer",
    "status": "deleted",
    "title": "string"
  }
}
```

### Tool 5: update_task
```python
{
  "name": "update_task",
  "description": "Modify task details",
  "parameters": {
    "user_id": "string (required)",
    "task_id": "integer (required)",
    "title": "string (optional)",
    "description": "string (optional)"
  },
  "returns": {
    "task_id": "integer",
    "status": "updated",
    "title": "string"
  }
}
```

## Agent Configuration

### Agent Instructions
```python
instructions = """
You are a helpful todo list assistant. You help users manage their tasks through natural conversation.

When users mention adding/creating tasks, use add_task.
When users ask to see/list tasks, use list_tasks.
When users say done/complete, use complete_task.
When users want to delete/remove tasks, use delete_task.
When users want to change/update tasks, use update_task.

Always confirm actions with friendly responses.
If a task ID is ambiguous, ask for clarification.
Handle errors gracefully and explain what went wrong.
"""
```

## Integration Flow

### Request Lifecycle:
1. **Receive**: ChatKit sends message to `/api/{user_id}/chat`
2. **Authenticate**: Verify JWT token, extract user_id
3. **Load Context**: Fetch last 20 messages from conversation
4. **Build Messages**: Format for Agents SDK
5. **Store User Message**: Save to database immediately
6. **Run Agent**: Execute with MCP tools
7. **Store Assistant Response**: Save to database
8. **Return**: Send response to ChatKit
9. **Cleanup**: Server holds NO state

## Response

Successfully created the feature specification for AI-Powered Chat Interface with MCP Tools. The specification includes:

1. Three prioritized user stories:
   - Natural Language Task Management (P1)
   - Conversation Context (P2)
   - Task Operations via Chat (P3)

2. Ten functional requirements covering:
   - Natural language input processing
   - Intent interpretation
   - Conversation context maintenance
   - Task operations (add, list, complete, delete, update)
   - Authentication and data isolation
   - Response generation

3. Three key entities:
   - Conversation
   - Message
   - Task

4. Five measurable success criteria:
   - 90% accuracy for task operations
   - 80% of interactions successful without clarification
   - Conversation context across 20+ messages
   - Response time under 3 seconds for 95% of requests
   - Improved intuitiveness over traditional UI

The specification was validated against quality criteria and is ready for the planning phase.