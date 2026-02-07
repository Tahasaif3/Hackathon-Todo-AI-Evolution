---
id: 0001
title: Event-Driven Todo System Specification
stage: spec
date: 2026-01-31
surface: command
model: claude-sonnet-4-5-20250929
feature: 001-event-driven-todo
branch: 001-event-driven-todo
user: default_user
command: /sp.specify
labels: [specification, event-driven, kafka, dapr, microservices, audit-trail]
links:
  spec: specs/001-event-driven-todo/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/001-event-driven-todo/spec.md
    action: created
    summary: "Complete specification for event-driven todo system with audit trail"
  - path: specs/001-event-driven-todo/checklists/requirements.md
    action: created
    summary: "Quality checklist for specification validation"
tests:
  - type: specification_quality
    status: passed
    summary: "Specification meets all quality criteria and is ready for planning"
---

## Prompt

# Phase V Specification - Event-Driven Todo System

## Overview
Keep Phase IV features (basic todo CRUD + chatbot) but add event-driven architecture using Kafka + Dapr, then deploy to production cloud.

---

## Requirements

### R1: Kafka Topics
**Priority:** MUST HAVE

#### Topic: `task-events`
**Purpose:** All task operations (create, update, delete, complete)
**Partitions:** 6
**Retention:** 7 days

**Event Schema:**
```json
{
  "event_id": "uuid-v4",
  "event_type": "created|updated|completed|deleted",
  "timestamp": "2026-01-30T10:00:00Z",
  "user_id": "string",
  "task_id": 123,
  "task_data": {
    "title": "string",
    "description": "string",
    "completed": boolean
  }
}
```

---

### R2: Microservices Architecture
**Priority:** MUST HAVE

#### Service 1: Chat API (Enhanced from Phase IV)
**Responsibilities:**
- Handle HTTP requests (task CRUD, chat)
- **NEW:** Publish events to Kafka after every operation
- Run OpenAI Agents + MCP

**Changes from Phase IV:**
- Add Dapr Pub/Sub event publishing
- Keep all existing functionality

---

#### Service 2: Audit Service (NEW)
**Responsibilities:**
- Subscribe to `task-events` topic
- Store all events in `audit_log` table
- Provide audit trail API

**Database:**
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  event_id UUID UNIQUE NOT NULL,
  event_type VARCHAR(50),
  user_id VARCHAR(255),
  task_id INTEGER,
  event_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE
);
```

**API:**
- `GET /api/{user_id}/audit` - View audit trail

---

#### Service 3: Notification Service (NEW - Optional)
**Responsibilities:**
- Subscribe to `task-events` topic
- Send email notification on task completion
- Log activity

---

### R3: Dapr Components
**Priority:** MUST HAVE

#### Pub/Sub Component (Kafka)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "kafka-broker:9092"
  - name: consumerGroup
    value: "todo-services"
```

#### State Store Component (PostgreSQL)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: db-secret
      key: connection-string
```

---

### R4: Cloud Deployment
**Priority:** MUST HAVE

#### Kubernetes Cluster
- **Provider:** DigitalOcean Kubernetes (recommended)
- **Nodes:** 3 nodes, 4GB RAM each
- **Region:** Closest to you

#### Kafka Cluster
- **Option 1:** Redpanda Cloud (free serverless tier) - Recommended
- **Option 2:** Strimzi (self-hosted on K8s)

#### Container Registry
- DigitalOcean Container Registry (DOCR)

---

### R5: CI/CD Pipeline
**Priority:** MUST HAVE

#### GitHub Actions Workflow
**Triggers:** Push to `main` branch

**Steps:**
1. Run tests
2. Build Docker images (backend, audit-service)
3. Push to DOCR
4. Deploy to DOKS via Helm
5. Wait for rollout
6. Run health checks
7. Rollback on failure

---

## Acceptance Criteria

### AC1: Event Publishing
- [ ] Create task publishes "created" event
- [ ] Update task publishes "updated" event
- [ ] Delete task publishes "deleted" event
- [ ] Complete task publishes "completed" event
- [ ] Events include: event_id, timestamp, user_id, task_id, task_data

### AC2: Audit Service
- [ ] Service deployed and running
- [ ] Subscribes to task-events topic
- [ ] Stores all events in audit_log table
- [ ] GET /api/{user_id}/audit returns events

### AC3: Dapr Integration (Local)
- [ ] Dapr installed on Minikube
- [ ] Pub/Sub component configured
- [ ] Backend publishes events via Dapr
- [ ] Audit service consumes via Dapr

### AC4: Dapr Integration (Cloud)
- [ ] Dapr installed on DOKS
- [ ] Components point to Redpanda Cloud
- [ ] All services have Dapr sidecar

### AC5: Cloud Deployment
- [ ] DOKS cluster running (3 nodes)
- [ ] Redpanda Cloud Kafka connected
- [ ] All pods healthy
- [ ] Frontend accessible via LoadBalancer
- [ ] Backend API working

### AC6: CI/CD
- [ ] GitHub Actions workflow created
- [ ] Push to main triggers deployment
- [ ] Images build and push successfully
- [ ] Helm upgrade runs
- [ ] Health checks pass
- [ ] Rollback works on failure

### AC7: End-to-End
- [ ] Create task via UI → event in Kafka → stored in audit_log
- [ ] Complete task → event published
- [ ] Zero downtime during deployment

## Response snapshot

Successfully created a comprehensive specification for the event-driven todo system. The specification includes:

- Three prioritized user stories covering core functionality (P1: Create and Track Todo Tasks with Event Auditing, P2: View Complete Audit Trail, P3: Event-Driven System Reliability)
- Comprehensive functional requirements (FR-001 through FR-010) covering event publishing, audit logging, user access control, and system reliability
- Key entities defined (Task Event, Audit Log, User, Task)
- Measurable success criteria (SC-001 through SC-007) with specific metrics for performance, availability, and user satisfaction
- Edge cases addressing potential failure scenarios and system behaviors

The specification follows the template structure and maintains focus on user value while avoiding implementation details. A quality checklist was also created to validate the specification meets all required criteria.

## Outcome

- ✅ Impact: Successfully created comprehensive specification for event-driven architecture
- 🧪 Tests: Specification quality validation passed
- 📁 Files: spec.md and requirements checklist created and validated
- 🔁 Next prompts: Ready to proceed with /sp.plan for architecture planning
- 🧠 Reflection: Specification properly balances user needs with technical requirements while maintaining focus on audit capabilities

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to architecture planning phase
