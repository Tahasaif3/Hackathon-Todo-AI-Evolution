# API Contracts: Event-Driven Todo System

## Backend Service API (Enhanced)

### Task Operations (with Event Publishing)

#### POST /api/{user_id}/tasks
**Description**: Create a new task and publish creation event
**Authentication**: JWT required
**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "completed": false
}
```
**Response**:
```json
{
  "id": 123,
  "title": "string",
  "description": "string",
  "completed": false,
  "user_id": "string",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T10:00:00Z"
}
```
**Event Published**: "created" event to task-events topic

#### GET /api/{user_id}/tasks
**Description**: Get all tasks for a user
**Authentication**: JWT required
**Response**:
```json
{
  "tasks": [
    {
      "id": 123,
      "title": "string",
      "description": "string",
      "completed": false,
      "user_id": "string",
      "created_at": "2026-01-31T10:00:00Z",
      "updated_at": "2026-01-31T10:00:00Z"
    }
  ]
}
```

#### PUT /api/{user_id}/tasks/{task_id}
**Description**: Update a task and publish update event
**Authentication**: JWT required
**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "completed": true
}
```
**Response**:
```json
{
  "id": 123,
  "title": "string",
  "description": "string",
  "completed": true,
  "user_id": "string",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T10:00:00Z"
}
```
**Event Published**: "updated" event to task-events topic

#### DELETE /api/{user_id}/tasks/{task_id}
**Description**: Delete a task and publish deletion event
**Authentication**: JWT required
**Response**: 204 No Content
**Event Published**: "deleted" event to task-events topic

#### PATCH /api/{user_id}/tasks/{task_id}/complete
**Description**: Mark task as complete and publish completion event
**Authentication**: JWT required
**Response**:
```json
{
  "id": 123,
  "title": "string",
  "description": "string",
  "completed": true,
  "user_id": "string",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T10:00:00Z"
}
```
**Event Published**: "completed" event to task-events topic

## Audit Service API

### GET /api/{user_id}/audit
**Description**: Get audit trail for a user
**Authentication**: JWT required
**Response**:
```json
{
  "events": [
    {
      "id": 1,
      "event_id": "uuid-string",
      "event_type": "created|updated|completed|deleted",
      "user_id": "string",
      "task_id": 123,
      "event_data": {
        "title": "string",
        "description": "string",
        "completed": false
      },
      "timestamp": "2026-01-31T10:00:00Z"
    }
  ]
}
```

### POST /task-events (Dapr Subscription Endpoint)
**Description**: Internal endpoint called by Dapr when events arrive from Kafka
**Authentication**: Dapr sidecar (internal)
**Request Body**:
```json
{
  "event_id": "uuid-string",
  "event_type": "created|updated|completed|deleted",
  "timestamp": "2026-01-31T10:00:00Z",
  "user_id": "string",
  "task_id": 123,
  "task_data": {
    "title": "string",
    "description": "string",
    "completed": false
  }
}
```
**Response**: 200 OK

### GET /dapr/subscribe
**Description**: Dapr subscription configuration endpoint
**Authentication**: Dapr sidecar (internal)
**Response**:
```json
[
  {
    "pubsubname": "kafka-pubsub",
    "topic": "task-events",
    "route": "/task-events"
  }
]
```

### GET /health
**Description**: Health check endpoint
**Authentication**: None required
**Response**: 200 OK with status

## Notification Service API

### POST /notification-events (Dapr Subscription Endpoint)
**Description**: Internal endpoint called by Dapr when events arrive from Kafka
**Authentication**: Dapr sidecar (internal)
**Request Body**:
```json
{
  "event_id": "uuid-string",
  "event_type": "created|updated|completed|deleted",
  "timestamp": "2026-01-31T10:00:00Z",
  "user_id": "string",
  "task_id": 123,
  "task_data": {
    "title": "string",
    "description": "string",
    "completed": false
  }
}
```
**Response**: 200 OK

### GET /health
**Description**: Health check endpoint
**Authentication**: None required
**Response**: 200 OK with status