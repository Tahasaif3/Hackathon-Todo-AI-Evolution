---
id: 0003
title: Event-Driven Todo System Tasks
stage: tasks
date: 2026-01-31
surface: command
model: claude-sonnet-4-5-20250929
feature: 001-event-driven-todo
branch: 001-event-driven-todo
user: default_user
command: /sp.tasks
labels: [tasks, event-driven, kafka, dapr, microservices]
links:
  spec: specs/001-event-driven-todo/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/001-event-driven-todo/tasks.md
    action: created
    summary: "Task breakdown for event-driven todo system implementation"
tests:
  - type: task_format_validation
    status: passed
    summary: "All tasks follow required checklist format"
  - type: dependency_validation
    status: passed
    summary: "Task dependencies properly defined and ordered"
---

## Prompt

# Phase V Tasks - Event-Driven & Cloud

## PART A: Event-Driven Architecture (Local) - 20 hours

### T-V01: Create Audit Log Table (30min)
**Steps:**
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  event_id UUID UNIQUE NOT NULL,
  event_type VARCHAR(50),
  user_id VARCHAR(255),
  task_id INTEGER,
  event_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_timestamp (timestamp)
);
```
**Test:** Connect to Neon DB, run migration

---

### T-V02: Add Event Publishing to Backend (3h)
**Steps:**
1. Install Dapr: `pip install dapr`
2. Create `backend/events.py`:
```python
import httpx
import uuid
from datetime import datetime

async def publish_task_event(event_type: str, task):
    event = {
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "user_id": task.user_id,
        "task_id": task.id,
        "task_data": task.dict()
    }

    async with httpx.AsyncClient() as client:
        await client.post(
            "http://localhost:3500/v1.0/publish/kafka-pubsub/task-events",
            json=event
        )
```

3. Update `backend/routes/tasks.py`:
```python
from events import publish_task_event

@app.post("/api/{user_id}/tasks")
async def create_task(...):
    task = await db.create(...)
    await publish_task_event("created", task)  # ADD THIS
    return task

@app.put("/api/{user_id}/tasks/{id}")
async def update_task(...):
    task = await db.update(...)
    await publish_task_event("updated", task)  # ADD THIS
    return task

@app.delete("/api/{user_id}/tasks/{id}")
async def delete_task(...):
    task = await db.get(id)
    await db.delete(id)
    await publish_task_event("deleted", task)  # ADD THIS
    return {"deleted": True}

@app.patch("/api/{user_id}/tasks/{id}/complete")
async def complete_task(...):
    task = await db.complete(id)
    await publish_task_event("completed", task)  # ADD THIS
    return task
```

**Test:** Start backend, create task, check Dapr logs

---

### T-V03: Create Audit Service (4h)
**Steps:**
1. Create `audit-service/` directory
2. Create `audit-service/main.py` (see Plan C2)
3. Create `audit-service/Dockerfile`:
```dockerfile
FROM python:3.13-slim
WORKDIR /app
RUN pip install fastapi uvicorn httpx asyncpg
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
4. Create `audit-service/database.py` (DB connection)

**Test:** `docker build -t audit-service .`

---

### T-V04: Install Dapr on Minikube (1h)
**Steps:**
```bash
# Install Dapr CLI
curl -fsSL https://raw.githubusercontent.com/dapr/cli/master/install/install.sh | bash

# Initialize on Minikube
dapr init -k

# Verify
kubectl get pods -n dapr-system
# Should see: dapr-operator, dapr-sidecar-injector, dapr-sentry, dapr-placement
```

**Test:** All pods Running

---

### T-V05: Deploy Kafka on Minikube (2h)
**Steps:**
```bash
# Create namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Create kafka-cluster.yaml
cat <<EOF > kafka-cluster.yaml
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

# Deploy
kubectl apply -f kafka-cluster.yaml -n kafka

# Wait for ready (5-10 minutes)
kubectl wait kafka/my-cluster --for=condition=Ready --timeout=600s -n kafka
```

**Test:** `kubectl get kafka -n kafka` shows STATUS: Ready

---

### T-V06: Create Dapr Pub/Sub Component (1h)
**Steps:**
1. Create `dapr-components/pubsub-kafka.yaml`:
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: todo-app
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "my-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092"
  - name: consumerGroup
    value: "todo-services"
  - name: authRequired
    value: "false"
```

2. Apply:
```bash
kubectl apply -f dapr-components/pubsub-kafka.yaml
```

**Test:** `dapr components -k -n todo-app` shows kafka-pubsub

---

### T-V07: Update Helm Chart (3h)
**Steps:**
1. Add Dapr annotations to `backend-deployment.yaml`:
```yaml
template:
  metadata:
    annotations:
      dapr.io/enabled: "true"
      dapr.io/app-id: "backend"
      dapr.io/app-port: "8000"
```

2. Create `templates/audit-deployment.yaml` (see Plan C5)

3. Create `templates/audit-service.yaml`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-audit
spec:
  type: ClusterIP
  ports:
  - port: 8000
    targetPort: 8000
  selector:
    app: audit
```

4. Update `values.yaml` (add audit section)

**Test:** `helm lint charts/todo-chatbot`

---

### T-V08: Deploy to Minikube (2h)
**Steps:**
```bash
# Build images in Minikube context
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend
docker build -t audit-service:latest ./audit-service

# Install/upgrade
helm upgrade --install todo-chatbot ./charts/todo-chatbot -n todo-app --create-namespace

# Watch pods
kubectl get pods -n todo-app --watch
```

**Test:** All pods Running with 2/2 containers (app + dapr sidecar)

---

### T-V09: End-to-End Test (1h)
**Steps:**
1. Access frontend: `minikube service todo-chatbot-frontend -n todo-app`
2. Create a task via UI
3. Check event published:
```bash
kubectl logs -n todo-app deployment/todo-chatbot-backend -c daprd | grep "Published"
```
4. Check audit service received:
```bash
kubectl logs -n todo-app deployment/todo-chatbot-audit -c audit
```
5. Query audit API:
```bash
kubectl port-forward -n todo-app service/todo-chatbot-audit 8001:8000
curl http://localhost:8001/api/testuser/audit
```

**Success:** See your task creation event in audit log

---

## PART B: Cloud Deployment - 16 hours

### T-V10: Create DigitalOcean Account & Cluster (1h)
**Steps:**
1. Sign up at digitalocean.com (use $200 credit)
2. Create Kubernetes cluster:
   - Name: `todo-production`
   - Region: Closest to you
   - Node pool: 3 nodes, 4GB RAM (Basic)
3. Download kubeconfig:
```bash
doctl kubernetes cluster kubeconfig save todo-production
kubectl get nodes
```

**Test:** 3 nodes Ready

---

### T-V11: Setup Redpanda Cloud (1h)
**Steps:**
1. Sign up at redpanda.com/cloud
2. Create serverless cluster (free tier)
3. Create topic: `task-events`
   - Partitions: 6
   - Retention: 7 days
4. Create user and copy credentials:
   - Bootstrap server URL
   - Username
   - Password

**Test:** Use rpk CLI to test connection

---

### T-V12: Install Dapr on DOKS (1h)
**Steps:**
```bash
# Add Helm repo
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update

# Install Dapr
helm install dapr dapr/dapr \
  --namespace dapr-system \
  --create-namespace \
  --wait

# Verify
kubectl get pods -n dapr-system
```

**Test:** All dapr-* pods Running

---

### T-V13: Create Cloud Dapr Components (2h)
**Steps:**
1. Create Kubernetes secret for Kafka password:
```bash
kubectl create secret generic kafka-secret \
  --from-literal=password='your-redpanda-password' \
  -n todo-app
```

2. Create `dapr-components-cloud/pubsub-kafka.yaml`:
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: todo-app
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "your-redpanda-url:9092"
  - name: authType
    value: "password"
  - name: saslUsername
    value: "your-username"
  - name: saslPassword
    secretKeyRef:
      name: kafka-secret
      key: password
  - name: consumerGroup
    value: "todo-services-cloud"
```

3. Apply:
```bash
kubectl apply -f dapr-components-cloud/
```

**Test:** `dapr components -k -n todo-app`

---

### T-V14: Setup Container Registry (1h)
**Steps:**
```bash
# Create registry via UI or CLI
doctl registry create todo-registry

# Login
doctl registry login

# Get registry name
doctl registry get
# Copy: registry.digitalocean.com/todo-registry
```

**Test:** `docker login registry.digitalocean.com/todo-registry`

---

### T-V15: Manual Cloud Deploy (First Time) (3h)
**Steps:**
1. Build and push images:
```bash
export REGISTRY=registry.digitalocean.com/todo-registry

docker build -t $REGISTRY/frontend:v1 ./frontend
docker build -t $REGISTRY/backend:v1 ./backend
docker build -t $REGISTRY/audit-service:v1 ./audit-service

docker push $REGISTRY/frontend:v1
docker push $REGISTRY/backend:v1
docker push $REGISTRY/audit-service:v1
```

2. Create `values-cloud.yaml`:
```yaml
frontend:
  image:
    repository: registry.digitalocean.com/todo-registry/frontend
    tag: v1

backend:
  image:
    repository: registry.digitalocean.com/todo-registry/backend
    tag: v1

audit:
  image:
    repository: registry.digitalocean.com/todo-registry/audit-service
    tag: v1

secrets:
  databaseUrl: "your-neon-url"
  openaiApiKey: "your-openai-3. Deploy:
```bash
helm upgrade --install todo-chatbot ./charts/todo-chatbot \
  -f values-cloud.yaml \
  -n todo-app \
  --create-namespace \
  --wait
```

**Test:** `kubectl get pods -n todo-app` - all Running

---

### T-V16: Create LoadBalancer for Frontend (1h)
**Steps:**
1. Update `templates/frontend-service.yaml`:
```yaml
spec:
  type: LoadBalancer  # Change from NodePort
```

2. Upgrade:
```bash
helm upgrade todo-chatbot ./charts/todo-chatbot -f values-cloud.yaml -n todo-app
```

3. Get external IP:
```bash
kubectl get service todo-chatbot-frontend -n todo-app
# Wait for EXTERNAL-IP (takes 2-3 minutes)
```

**Test:** Open external IP in browser → app loads

---

### T-V17: Setup GitHub Actions (4h)
**Steps:**
1. Create `.github/workflows/deploy-cloud.yml` (see Plan C6)

2. Add GitHub Secrets (Settings → Secrets → Actions):
   - `DIGITALOCEAN_ACCESS_TOKEN` (from DigitalOcean API)
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `KAFKA_PASSWORD`

3. Update workflow to use secrets

4. Commit and push:
```bash
git add .github/workflows/deploy-cloud.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

**Test:** Check Actions tab → workflow runs → deployment succeeds

---

### T-V18: Test CI/CD (1h)
**Steps:**
1. Make small change (e.g., update README)
2. Push to main
3. Watch GitHub Actions
4. Verify new version deployed:
```bash
kubectl get pods -n todo-app
# Check image tags match new SHA
```

**Test:** Zero downtime, health checks pass

---

### T-V19: End-to-End Cloud Test (1h)
**Steps:**
1. Open production URL
2. Sign in
3. Create task
4. Complete task
5. Check audit log:
```bash
kubectl port-forward -n todo-app service/todo-chatbot-audit 8001:8000
curl http://localhost:8001/api/your-user-id/audit
```

**Success:** See events in cloud audit log

---

## Timeline

- **Part A** (Event-Driven Local): 4-5 days
- **Part B** (Cloud + CI/CD): 3-4 days
- **Total**: 7-9 days (full-time) or 2-3 weeks (part-time)

---

## Quick Commands Reference

### Local Development
```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Deploy
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend
docker build -t audit-service:latest ./audit-service
helm upgrade --install todo-chatbot ./charts/todo-chatbot -n todo-app

# Test
minikube service todo-chatbot-frontend -n todo-app
kubectl logs -n todo-app deployment/todo-chatbot-audit -c audit
```

### Cloud Deployment
```bash
# One-time setup
doctl kubernetes cluster kubeconfig save todo-production
helm install dapr dapr/dapr --namespace dapr-system --create-namespace

# Deploy manually
docker build -t registry.digitalocean.com/todo-registry/backend:v1 ./backend
docker push registry.digitalocean.com/todo-registry/backend:v1
helm upgrade --install todo-chatbot ./charts/todo-chatbot -f values-cloud.yaml -n todo-app

# Via CI/CD
git push origin main  # Triggers automatic deployment
```

## Response snapshot

Successfully created a comprehensive task breakdown for the event-driven todo system implementation. The tasks.md file contains:

- 74 individual tasks organized into 7 phases
- Clear user story mapping with P1, P2, P3 priorities
- Proper checklist format with task IDs and story labels
- Dependency tracking between phases
- Parallel execution opportunities identified
- Implementation strategy with MVP scope defined

The tasks are organized by user story to enable independent implementation and testing, following the requirements from the feature specification and implementation plan.

## Outcome

- ✅ Impact: Created complete task breakdown for event-driven architecture implementation
- 🧪 Tests: Task format and dependency validation passed
- 📁 Files: tasks.md created with proper structure and organization
- 🔁 Next prompts: Ready to proceed with implementation using /sp.implement
- 🧠 Reflection: Tasks properly organized by user stories with clear dependencies

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation with Phase 1 tasks
