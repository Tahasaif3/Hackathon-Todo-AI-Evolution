# Data Model: AI-Powered Chat Interface

**Feature**: 002-ai-chat-mcp-tools
**Created**: 2025-12-23
**Input**: Feature specification and architecture requirements

## Entity Definitions

### Conversation
Represents a continuous interaction session between user and AI assistant

**Attributes:**
- `id`: SERIAL PRIMARY KEY (auto-generated)
- `user_id`: TEXT NOT NULL (foreign key to users table)
- `created_at`: TIMESTAMP DEFAULT NOW()
- `updated_at`: TIMESTAMP DEFAULT NOW()

**Relationships:**
- One-to-Many with Message (one conversation has many messages)

### Message
Individual communication in a conversation, either from user or assistant

**Attributes:**
- `id`: SERIAL PRIMARY KEY (auto-generated)
- `conversation_id`: INTEGER REFERENCES conversations(id)
- `user_id`: TEXT NOT NULL (user identifier)
- `role`: TEXT CHECK (role IN ('user', 'assistant'))
- `content`: TEXT NOT NULL
- `created_at`: TIMESTAMP DEFAULT NOW()

**Relationships:**
- Many-to-One with Conversation (many messages belong to one conversation)

### Task (Existing)
User's todo item that can be managed through the AI assistant interface (extends existing model)

**Attributes:**
- `id`: INTEGER PRIMARY KEY (auto-generated)
- `user_id`: TEXT NOT NULL (foreign key to users table)
- `title`: TEXT NOT NULL
- `description`: TEXT (optional)
- `completed`: BOOLEAN DEFAULT FALSE
- `created_at`: TIMESTAMP DEFAULT NOW()
- `updated_at`: TIMESTAMP DEFAULT NOW()

**Relationships:**
- Many-to-One with User (many tasks belong to one user)

## Database Schema

```sql
-- New Table: conversations
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- New Table: messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  user_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Entity Relationships

```
User (1) ←→ (Many) Task
User (1) ←→ (Many) Conversation
Conversation (1) ←→ (Many) Message
```

## Constraints and Validation

- All user data access must be filtered by `user_id` to maintain data isolation
- Messages must have a valid conversation_id that exists in conversations table
- Role field in messages restricted to 'user' or 'assistant' values
- Conversation timestamps automatically managed by database