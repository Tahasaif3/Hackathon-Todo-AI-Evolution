---
title: "Constitution Phase III Update"
date: "2025-12-23"
stage: "constitution"
id: "20251223-constitution-phase3-update"
---

# Constitution Phase III Update

## Prompt

Update the constitution to add Phase III content with the following requirements:

Add to the constitution for Phase III:

# Todo App Constitution - Phase III Update

## AI Agent Principles
- **Natural Language First**: Users should manage todos conversationally
- **Stateless Architecture**: No in-memory state; all context persists to database
- **MCP Tool Pattern**: All task operations exposed as standardized MCP tools
- **Gemini Integration**: Use Gemini 2.0 Flash via OpenAI-compatible endpoint
- **Conversation Continuity**: Support resuming conversations across sessions

## Technical Constraints
- Backend: FastAPI with OpenAI Agents SDK
- AI Model: Gemini 2.0 Flash (via OpenAI compatibility layer)
- Frontend: OpenAI ChatKit with domain allowlist
- MCP: Official Python MCP SDK for tool definitions
- Database: Neon PostgreSQL for tasks, conversations, and messages
- Authentication: Better Auth JWT tokens

## Response

Successfully updated the constitution to include Phase III content. The changes included:

1. Added "Phase III AI Agent Principles" section with the 5 specified principles
2. Added "Phase III Technical Constraints" section with the 6 specified constraints
3. Updated the "AI Agent Standards (Phase III+)" section to incorporate the new principles
4. Enhanced the "Supported Phases (Evolution Path)" section to include the new Phase III features
5. Updated version from 1.0.0 to 1.1.0 with amendment date 2025-12-23
6. Added Sync Impact Report at the top of the file documenting the changes

The constitution now properly reflects the Phase III requirements for AI-powered features with MCP tools, Gemini integration, and conversation-based interfaces, while maintaining all existing governance principles.