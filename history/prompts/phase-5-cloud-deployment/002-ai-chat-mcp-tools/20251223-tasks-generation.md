---
title: "AI Chat MCP Tools Tasks Generation"
date: "2025-12-23"
stage: "tasks"
id: "20251223-tasks-generation"
feature: "002-ai-chat-mcp-tools"
---

# AI Chat MCP Tools Tasks Generation

## Prompt

Create tasks for: # Phase III Implementation Tasks

## Backend Tasks

### T-301: Database Schema Setup
**Dependencies:** Phase II database
**Preconditions:** SQLModel models exist
**Steps:**
1. Create `Conversation` model in `src/models`
2. Create `Message` model with relationship to Conversation
3. Add migration script for new tables
4. Test migrations locally

**Artifacts:**
- `backend/models` (updated)
- `backend/migrations/003_add_conversations.sql`

**Acceptance:**
- Tables created successfully
- Foreign keys validated
- User_id isolation enforced

---

### T-302: MCP Server Implementation
**Dependencies:** T-301
**From:** `specs/architecture/phase3-architecture.md` §MCP Tools
**Steps:**
1. Create `backend/mcp_server.py`
2. Implement 5 MCP tools using Official MCP SDK
3. Each tool function must:
   - Accept user_id parameter
   - Query database with user_id filter
   - Return standardized JSON
4. Add error handling for task not found

**Artifacts:**
- `backend/mcp_server.py`
- `backend/mcp_tools/` (folder with individual tool files)

**Acceptance:**
- All 5 tools callable independently
- User isolation enforced (user A can't see user B's tasks)
- Error responses follow MCP spec

---

### T-303: Agent Configuration
**Dependencies:** T-302
**From:** `specs/architecture/phase3-architecture.md` §Agent Configuration
**Steps:**
1. Create `backend/agent_config.py`
2. Configure Gemini 2.0 Flash with AsyncOpenAI
3. Set up OpenAIChatCompletionsModel wrapper
4. Define agent instructions (from spec)
5. Register MCP tools with agent

**Artifacts:**
- `backend/agent_config.py`

**Code Reference:**
```python
# backend/agent_config.py
import os
from agents import Agent, OpenAIChatCompletionsModel, AsyncOpenAI
from dotenv import load_dotenv
from mcp_server import get_mcp_tools

load_dotenv()

external_client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=external_client
)

todo_agent = Agent(
    name="Todo Assistant",
    model=model,
    instructions="""[From spec]""",
    tools=get_mcp_tools()  # MCP tools list
)
```

**Acceptance:**
- Agent initializes without errors
- Tools registered successfully
- Test message returns response

---

### T-304: Chat Endpoint Implementation
**Dependencies:** T-303
**From:** `specs/architecture/phase3-architecture.md` §API Specification
**Steps:**
1. Create `backend/routes/chat.py`
2. Implement `POST /api/{user_id}/chat`
3. JWT authentication middleware
4. Load conversation history (last 20 messages)
5. Store user message
6. Run agent with Runner.run_sync()
7. Store assistant response
8. Return formatted response

**Artifacts:**
- `backend/routes/chat.py`

**Acceptance:**
- Authenticated requests only
- Conversation history maintained
- Tool calls logged
- Server remains stateless

---

### T-305: Conversation Management
**Dependencies:** T-301
**Steps:**
1. Create `backend/services/conversation_service.py`
2. Implement `create_conversation(user_id)` → returns conv_id
3. Implement `get_messages(conversation_id, limit=20)`
4. Implement `add_message(conversation_id, role, content)`
5. Add SQLModel queries with user_id filtering

**Artifacts:**
- `backend/services/conversation_service.py`

**Acceptance:**
- Conversations created per user
- Messages retrieved in order
- Limit enforced (last 20)

---

## Frontend Tasks

### T-306: ChatKit Integration
**Dependencies:** None (independent)
**From:** Hackathon docs §OpenAI ChatKit Setup
**Steps:**
1. Create `frontend/components/ChatInterface.tsx`
2. Install OpenAI ChatKit package
3. Configure domain allowlist on OpenAI platform
4. Set NEXT_PUBLIC_OPENAI_DOMAIN_KEY in .env
5. Implement chat UI with ChatKit components

**Artifacts:**
- `frontend/components/ChatInterface.tsx`
- `frontend/.env.local` (updated)

**Acceptance:**
- ChatKit renders without errors
- Messages sent to backend
- Responses displayed in UI

---

### T-307: Chat API Client
**Dependencies:** T-306
**Steps:**
1. Create `frontend/lib/chatApi.ts`
2. Implement `sendMessage(userId, message, conversationId?)`
3. Add JWT token to Authorization header
4. Handle response parsing
5. Add error handling

**Artifacts:**
- `frontend/lib/chatApi.ts`

**Acceptance:**
- JWT attached to requests
- Conversation ID managed
- Errors displayed to user

---

### T-308: Chat Page
**Dependencies:** T-306, T-307
**Steps:**
1. Create `frontend/app/chat/page.tsx`
2. Fetch user session (Better Auth)
3. Load or create conversation
4. Render ChatInterface component
5. Handle message submission

**Artifacts:**
- `frontend/app/chat/page.tsx`

**Acceptance:**
- Protected route (auth required)
- Conversation resumes after refresh
- Loading states shown

---

## Testing Tasks

### T-309: MCP Tools Testing
**Dependencies:** T-302
**Steps:**
1. Write unit tests for each MCP tool
2. Test user_id isolation
3. Test error cases (task not found)
4. Test database constraints

**Artifacts:**
- `backend/tests/test_mcp_tools.py`

---

### T-310: End-to-End Chat Testing
**Dependencies:** T-304, T-308
**Steps:**
1. Test: "Add buy milk"
2. Test: "Show my tasks"
3. Test: "Mark task 1 complete"
4. Test: "Delete task 2"
5. Test conversation persistence

**Artifacts:**
- `backend/tests/test_chat_flow.py`

---

## Documentation Tasks

### T-311: API Documentation
**Steps:**
1. Document chat endpoint in README
2. Add MCP tools examples
3. Update deployment instructions

**Artifacts:**
- `README.md` (updated)

---

### T-312: Demo Video
**Steps:**
1. Record 90-second demo showing:
   - Natural language task creation
   - Task listing via chat
   - Task completion
   - Conversation persistence
2. Use NotebookLM or screen recording

**Artifacts:**
- `demo.mp4` (under 90 seconds)

## Response

Successfully created the tasks.md file for the AI-Powered Chat Interface with MCP Tools feature. The tasks are organized according to the user stories from the specification:

1. **Phase 1**: Setup tasks for project initialization
2. **Phase 2**: Foundational tasks that block all user stories
3. **Phase 3**: User Story 1 (Natural Language Task Management) - P1 priority
4. **Phase 4**: User Story 2 (Conversation Context) - P2 priority
5. **Phase 5**: User Story 3 (Task Operations via Chat) - P3 priority
6. **Phase N**: Polish and cross-cutting concerns

Each task follows the required format with checkboxes, IDs, parallel markers [P], and story labels [US1], [US2], [US3] where appropriate. The tasks are organized to enable independent implementation and testing of each user story, with proper dependencies and execution order defined.