# Implementation Plan: Local Kubernetes Deployment

**Branch**: `003-local-k8s-deployment` | **Date**: 2025-12-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-local-k8s-deployment/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deploy the Phase III Todo Chatbot application to a local Kubernetes cluster using Minikube. The implementation creates containerized frontend (Next.js) and backend (FastAPI) services, packaged as a Helm chart for reproducible deployments. All resources follow cloud-native best practices with proper security contexts, health probes, and resource limits.

## Technical Context

**Language/Version**: N/A (infrastructure feature - uses existing codebase)
**Primary Dependencies**: Docker, Minikube, Helm 3+, kubectl
**Storage**: Neon PostgreSQL (external, already provisioned)
**Testing**: helm lint, kubectl commands, manual browser verification
**Target Platform**: Linux/macOS/Windows with Minikube (local Kubernetes)
**Project Type**: Infrastructure deployment (Phase IV cloud-native)
**Performance Goals**: Pod startup < 30s, deployment time < 60s, rolling updates zero-downtime
**Constraints**: Local development machine requirements (4GB RAM, 2 CPU cores)
**Scale/Scope**: 2 replicas each for frontend/backend, single namespace, no HPA for local

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase IV (Cloud-Native) Specific Checks

For features targeting Phase IV or later, verify:

- [x] Containerization requirements met (Docker/OCI format)
- [x] Stateless design (external state in DB/cache)
- [x] Environment-based configuration (no hardcoded values)
- [x] SecurityContext defined (non-root, read-only filesystem)
- [x] Health probes specified (liveness, readiness, startup)
- [x] Resource limits defined (requests and limits)
- [x] Kubernetes manifests use Helm/Kustomize (no imperative YAML)
- [x] Image tagging strategy defined (no `latest` tag - use git SHA or version)

### Cross-Phase Gates (always apply)

- [x] Tech stack matches constitution requirements
- [x] Test coverage target defined (80% for Phase II+)
- [x] User isolation requirements met (Phase II+) - handled by existing Phase II auth
- [x] API-first design principles followed (Phase II+) - existing API contract maintained
- [x] AI agent integration uses MCP pattern (Phase III+) - existing MCP tools preserved

**Result**: All Constitution checks PASS - feature is compliant with Phase IV requirements.

## Project Structure

### Documentation (this feature)

```text
specs/003-local-k8s-deployment/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (not needed - feature well-defined)
├── data-model.md        # Phase 1 output (Kubernetes resources)
├── quickstart.md        # Phase 1 output (deployment guide)
├── contracts/           # Phase 1 output (Helm chart templates)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# New infrastructure files for Phase IV
charts/
└── todo-chatbot/
    ├── Chart.yaml
    ├── values.yaml
    ├── .helmignore
    └── templates/
        ├── _helpers.tpl
        ├── frontend-deployment.yaml
        ├── frontend-service.yaml
        ├── backend-deployment.yaml
        ├── backend-service.yaml
        ├── configmap.yaml
        └── secret.yaml

# Existing Phase III codebase (containerized as-is)
frontend/
├── Dockerfile           # NEW - multi-stage build
└── .dockerignore        # NEW

backend/
├── Dockerfile           # NEW - multi-stage build
└── .dockerignore        # NEW
```

**Structure Decision**: The Helm chart creates a self-contained deployment package. Frontend and backend are containerized using multi-stage builds from existing Phase III codebases. ConfigMaps and Secrets are templated for environment-specific values.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

---

## Phase 0: Research Findings

This feature is well-defined with clear requirements. No additional research needed beyond existing Kubernetes best practices.

**Key Decisions**:
- **Helm 3**: Industry standard for Kubernetes package management
- **NodePort for Frontend**: Simplest approach for Minikube local access
- **ClusterIP for Backend**: Internal communication only, follows principle of least privilege
- **Multi-stage Docker builds**: Standard practice for minimal, secure images

---

## Phase 1: Design Artifacts

### Kubernetes Resources (data-model.md)

The following Kubernetes resources will be created:

#### Frontend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-chatbot-frontend
  namespace: todo-app
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: todo-chatbot-frontend
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
      containers:
        - name: frontend
          image: todo-chatbot-frontend:{VERSION}
          ports:
            - containerPort: 3000
          env:
            - name: NEXT_PUBLIC_API_URL
              value: http://todo-chatbot-backend:8000
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

#### Backend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-chatbot-backend
  namespace: todo-app
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: todo-chatbot-backend
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
      containers:
        - name: backend
          image: todo-chatbot-backend:{VERSION}
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: todo-chatbot-secrets
                  key: database-url
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: todo-chatbot-secrets
                  key: openai-api-key
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
```

#### Services
- **Frontend Service**: NodePort (ports 30000-32767 range)
- **Backend Service**: ClusterIP (internal only)

#### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: todo-chatbot-config
  namespace: todo-app
data:
  NEXT_PUBLIC_API_URL: "http://todo-chatbot-backend:8000"
  ENVIRONMENT: "development"
```

#### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: todo-chatbot-secrets
  namespace: todo-app
type: Opaque
stringData:
  database-url: "postgresql://user:pass@host:5432/db"
  openai-api-key: "sk-..."
```

### Helm Chart Structure (contracts/)

```
charts/todo-chatbot/
├── Chart.yaml
├── values.yaml
├── .helmignore
└── templates/
    ├── _helpers.tpl
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── configmap.yaml
    └── secret.yaml
```

#### Chart.yaml
```yaml
apiVersion: v2
name: todo-chatbot
description: Helm chart for Todo Chatbot application deployment
version: 0.1.0
appVersion: "1.0.0"
```

#### values.yaml
```yaml
# Default values for todo-chatbot chart.

global:
  imageRegistry: ""
  imagePullSecrets: []

frontend:
  replicaCount: 2
  image:
    repository: todo-chatbot-frontend
    tag: "latest"
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 3000
    nodePort: 30080
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "500m"

backend:
  replicaCount: 2
  image:
    repository: todo-chatbot-backend
    tag: "latest"
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 8000
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "1000m"

config:
  nextPublicApiUrl: "http://todo-chatbot-backend:8000"
  environment: "development"

secrets:
  databaseUrl: ""
  openaiApiKey: ""
```

### Quickstart Guide

**Prerequisites**:
- Docker installed and running
- Minikube installed
- Helm 3+ installed
- kubectl installed

**Setup Steps**:

1. Start Minikube:
   ```bash
   minikube start --memory=4096 --cpus=2
   ```

2. Build container images:
   ```bash
   # Build frontend
   docker build -t todo-chatbot-frontend:latest ./frontend

   # Build backend
   docker build -t todo-chatbot-backend:latest ./backend

   # Load images into Minikube
   minikube image load todo-chatbot-frontend:latest
   minikube image load todo-chatbot-backend:latest
   ```

3. Create namespace:
   ```bash
   kubectl create namespace todo-app
   ```

4. Install Helm chart:
   ```bash
   # With inline secrets (for local development only)
   helm install todo-chatbot ./charts/todo-chatbot \
     --set secrets.databaseUrl="postgresql://..." \
     --set secrets.openaiApiKey="sk-..." \
     --namespace todo-app

   # Or use values file
   helm install todo-chatbot ./charts/todo-chatbot \
     -f values-local.yaml \
     --namespace todo-app
   ```

5. Access frontend:
   ```bash
   minikube service todo-chatbot-frontend -n todo-app
   ```

6. Verify deployment:
   ```bash
   kubectl get pods -n todo-app
   kubectl logs -l app=todo-chatbot-frontend -n todo-app
   ```

**Cleanup**:
```bash
helm uninstall todo-chatbot -n todo-app
kubectl delete namespace todo-app
```
