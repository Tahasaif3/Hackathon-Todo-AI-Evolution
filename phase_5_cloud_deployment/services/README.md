# Microservices Architecture

This directory contains the microservices that complement the main backend application in an event-driven architecture.

## Services

### Audit Service
- **Purpose**: Stores and manages audit logs for all task operations
- **Technology**: FastAPI, SQLModel, PostgreSQL
- **Responsibility**:
  - Subscribes to task events from Kafka
  - Stores event data in PostgreSQL audit_log table
  - Provides audit trail API for frontend
  - Implements idempotency with event deduplication
  - Handles dead letter queue for failed events

### Notification Service
- **Purpose**: Handles notifications for task events
- **Technology**: FastAPI, Dapr
- **Responsibility**:
  - Subscribes to task events from Kafka
  - Generates appropriate notifications based on event type
  - Future: Send email/Push notifications

## Event Flow

```
Frontend → Backend → Kafka (via Dapr) → Audit Service & Notification Service
```

1. User performs task operation in frontend
2. Backend validates and processes the request
3. Backend publishes event to Kafka via Dapr
4. Audit Service consumes event and stores in database
5. Notification Service consumes event and sends notifications
6. Frontend can query audit trail from Audit Service

## Dapr Configuration

Dapr components are configured in the `dapr-components/` directory:
- `kafka-pubsub.yaml`: Kafka pub/sub configuration

## Running Locally

To run the services locally with Dapr:

```bash
# Start Dapr with the audit service
dapr run --app-id audit-service --app-port 8001 --dapr-http-port 3501 --resources-path ../dapr-components/ uvicorn src.main:app --port 8001

# Start Dapr with the notification service
dapr run --app-id notification-service --app-port 8002 --dapr-http-port 3502 --resources-path ../dapr-components/ uvicorn src.main:app --port 8002
```

## Deployment

Services are deployed as part of the Helm chart in the `charts/todo-platform/` directory.