---
id: 0002
title: Event-Driven Todo System Planning
stage: plan
date: 2026-01-31
surface: command
model: claude-sonnet-4-5-20250929
feature: 001-event-driven-todo
branch: 001-event-driven-todo
user: default_user
command: /sp.plan
labels: [planning, architecture, event-driven, kafka, dapr, microservices]
links:
  spec: specs/001-event-driven-todo/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/001-event-driven-todo/plan.md
    action: created
    summary: "Implementation plan for event-driven todo system"
  - path: specs/001-event-driven-todo/research.md
    action: created
    summary: "Research findings and technology decisions"
  - path: specs/001-event-driven-todo/data-model.md
    action: created
    summary: "Data model for event-driven architecture"
  - path: specs/001-event-driven-todo/contracts/api-contracts.md
    action: created
    summary: "API contracts for all services"
  - path: specs/001-event-driven-todo/quickstart.md
    action: created
    summary: "Quickstart guide for development and deployment"
tests:
  - type: constitution_check
    status: passed
    summary: "All constitution requirements satisfied"
  - type: architecture_validation
    status: passed
    summary: "Architecture follows microservices and event-driven patterns"
---

## Prompt

# Phase V Technical Plan

## Architecture Overview
```
┌──────────────────────────────────────────────────────────┐
│              KUBERNETES CLUSTER (DOKS)                    │
│                                                           │
│  ┌─────────────┐      ┌──────────────┐                  │
│  │  Frontend   │      │  Backend     │                  │
│  │  (Phase IV) │─────▶│  (Enhanced)  │                  │
│  └─────────────┘      │  + Dapr      │                  │
│                       └──────┬───────┘                  │
│                              │ Publish Events            │
│                              ▼                            │
│                    ┌──────────────────┐                  │
│                    │  Kafka (Dapr)    │                  │
│                    │  Topic:          │                  │
│                    │  task-events     │                  │
│                    └────────┬─────────┘                  │
│                             │ Subscribe                  │
│                             ▼                            │
│                    ┌──────────────────┐                  │
│                    │  Audit Service   │                  │
│                    │  + Dapr          │                  │
│                    └──────────────────┘                  │
│                             │                            │
│                             ▼                            │
│                    ┌──────────────────┐                  │
│                    │  Neon PostgreSQL │                  │
│                    │  (audit_log)     │                  │
│                    └──────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### C1: Backend Enhancement (From Phase IV)
**Changes:**
- Add Dapr SDK: `pip install dapr`
- Add event publishing function
- Call after every CRUD operation

**Event Publishing Code:**
```python
import httpx
import uuid
from datetime import datetime

async def publish_task_event(event_type: str, task: Task):
    event = {
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "user_id": task.user_id,
        "task_id": task.id,
        "task_data": {
            "title": task.title,
            "description": task.description,
            "completed": task.completed
        }
    }

    # Publish via Dapr Pub/Sub
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://localhost:3500/v1.0/publish/kafka-pubsub/task-events",
            json=event
        )

# Use in routes
@app.post("/api/{user_id}/tasks")
async def create_task(user_id: str, task: TaskCreate):
    new_task = await db.create(task)
    await publish_task_event("created", new_task)  # NEW
    return new_task
```

---

### C2: Audit Service (NEW)
**Technology:** Python FastAPI + Dapr

**Structure:**
```
audit-service/
├── main.py
├── models.py
├── database.py
├── Dockerfile
└── requirements.txt
```

**Main Implementation:**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TaskEvent(BaseModel):
    event_id: str
    event_type: str
    user_id: str
    task_id: int
    task_data: dict
    timestamp: str

@app.post("/task-events")
async def handle_task_event(event: TaskEvent):
    """Dapr calls this when event published to task-events"""
    # Store in audit_log table
    await db.execute("""
        INSERT INTO audit_log (event_id, event_type, user_id, task_id, event_data, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6)
    """, event.event_id, event.event_type, event.user_id, event.task_id,
        event.task_data, event.timestamp)

    return {"status": "success"}

@app.get("/dapr/subscribe")
async def subscribe():
    """Dapr subscription configuration"""
    return [{
        "pubsubname": "kafka-pubsub",
        "topic": "task-events",
        "route": "/task-events"
    }]

@app.get("/api/{user_id}/audit")
async def get_audit_trail(user_id: str):
    """API to view audit trail"""
    events = await db.fetch_all(
        "SELECT * FROM audit_log WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 100",
        user_id
    )
    return {"events": events}

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

---

### C3: Dapr Setup

#### Local (Minikube)
```bash
# Install Dapr
dapr init -k

# Verify
kubectl get pods -n dapr-system
```

#### Cloud (DOKS)
```bash
# Add Helm repo
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update

# Install Dapr
helm install dapr dapr/dapr --namespace dapr-system --create-namespace

# Verify
kubectl get pods -n dapr-system
```

---

### C4: Kafka Setup

#### Option 1: Redpanda Cloud (Recommended)
1. Sign up at redpanda.com/cloud
2. Create serverless cluster (free tier)
3. Create topic: `task-events` (6 partitions)
4. Copy connection details (broker URL, username, password)

#### Option 2: Strimzi (Self-Hosted)
```bash
# Create namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Create Kafka cluster
cat <<EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-cluster
  namespace: kafka
spec:
  kafka:
    replicas: 1
    listeners:
      - name: plain
        port: 9092
        type: internal
    storage:
      type: ephemeral
  zookeeper:
    replicas: 1
    storage:
      type: ephemeral
EOF
```

---

### C5: Helm Chart Updates

**Add to `values.yaml`:**
```yaml
audit:
  image:
    repository: audit-service
    tag: latest
  replicas: 2
  resources:
    requests:
      cpu: 100m
      memory: 256Mi
    limits:
      cpu: 250m
      memory: 512Mi

dapr:
  enabled: true
  appId: backend  # For backend deployment
```

**Create `templates/audit-deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-audit
  annotations:
    dapr.io/enabled: "true"
    dapr.io/app-id: "audit-service"
    dapr.io/app-port: "8000"
spec:
  replicas: {{ .Values.audit.replicas }}
  selector:
    matchLabels:
      app: audit
  template:
    metadata:
      labels:
        app: audit
      annotations:
        dapr.io/enabled: "true"
        dapr.io/app-id: "audit-service"
        dapr.io/app-port: "8000"
    spec:
      containers:
      - name: audit
        image: "{{ .Values.audit.image.repository }}:{{ .Values.audit.image.tag }}"
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: {{ .Release.Name }}-secret
              key: database-url
        resources:
          {{- toYaml .Values.audit.resources | nindent 10 }}
```

**Update `backend-deployment.yaml`:**
Add Dapr annotations:
```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "backend"
  dapr.io/app-port: "8000"
```

---

### C6: CI/CD Pipeline

**Create `.github/workflows/deploy-cloud.yml`:**
```yaml
name: Deploy to Cloud

on:
  push:
    branches: [main]

env:
  REGISTRY: registry.digitalocean.com/your-registry
  SHA: ${{ github.sha }}

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Install doctl
      uses: digitalocean/action-doctl@v2
      with:
        token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

    - name: Log in to DOCR
      run: doctl registry login

    - name: Build images
      run: |
        docker build -t $REGISTRY/frontend:$SHA ./frontend
        docker build -t $REGISTRY/backend:$SHA ./backend
        docker build -t $REGISTRY/audit-service:$SHA ./audit-service

    - name: Push images
      run: |
        docker push $REGISTRY/frontend:$SHA
        docker push $REGISTRY/backend:$SHA
        docker push $REGISTRY/audit-service:$SHA

    - name: Save kubeconfig
      run: doctl kubernetes cluster kubeconfig save your-cluster-name

    - name: Deploy with Helm
      run: |
        helm upgrade --install todo-chatbot ./charts/todo-chatbot \
          --set frontend.image.tag=$SHA \
          --set backend.image.tag=$SHA \
          --set audit.image.tag=$SHA \
          --set secrets.databaseUrl=${{ secrets.DATABASE_URL }} \
          --set secrets.openaiApiKey=${{ secrets.OPENAI_API_KEY }} \
          --wait --timeout=5m

    - name: Verify deployment
      run: |
        kubectl rollout status deployment/todo-chatbot-backend -n todo-app
        kubectl rollout status deployment/todo-chatbot-audit -n todo-app
```

---

## Implementation Sequence

### Phase A: Local Minikube (Event-Driven)
1. Enhance backend with event publishing
2. Create audit service
3. Install Dapr on Minikube
4. Deploy Kafka (Strimzi)
5. Create Dapr components
6. Deploy via Helm
7. Test: Create task → verify event in Kafka → verify in audit_log

### Phase B: Cloud Deployment
1. Create DOKS cluster
2. Setup Redpanda Cloud
3. Install Dapr on DOKS
4. Create cloud Dapr components
5. Setup DOCR
6. Manual deploy first time
7. Test end-to-end

### Phase C: CI/CD
1. Create GitHub Actions workflow
2. Add secrets to GitHub
3. Push to main → trigger deployment
4. Verify automated deployment

## Response snapshot

Successfully created a comprehensive implementation plan for the event-driven todo system. The plan includes:

- Filled technical context with required technologies (Python 3.13+, FastAPI, Dapr, Kafka, PostgreSQL)
- Completed constitution check verifying all requirements are met
- Defined project structure with clear service organization
- Created research.md with technology decisions and rationale
- Created data-model.md with entity definitions and validation rules
- Created API contracts for all services
- Created quickstart guide for development and deployment
- Updated agent context with new technology stack

All artifacts meet the requirements specified in the constitution and feature specification, with proper attention to event-driven architecture, microservices patterns, and cloud-native deployment.

## Outcome

- ✅ Impact: Successfully created complete architecture plan for event-driven system
- 🧪 Tests: Constitution check and architecture validation passed
- 📁 Files: plan.md, research.md, data-model.md, contracts, quickstart.md created
- 🔁 Next prompts: Ready to proceed with /sp.tasks for implementation breakdown
- 🧠 Reflection: Plan properly addresses all requirements while following constitutional principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task breakdown phase
