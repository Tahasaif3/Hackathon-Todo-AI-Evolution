---
id: 1
title: "Local K8s Deployment Spec"
stage: spec
date: "2025-12-31"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "003-local-k8s-deployment"
branch: "003-local-k8s-deployment"
user: "user"
command: "/sp.specify"
labels: ["spec", "phase-iv", "kubernetes", "minikube", "helm"]
links:
  spec: "specs/003-local-k8s-deployment/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/003-local-k8s-deployment/spec.md"
  - "specs/003-local-k8s-deployment/checklists/requirements.md"
tests: []
---

## Prompt

Create feature specification for Phase IV local Kubernetes deployment:

```
# Phase IV: Local Kubernetes Deployment Specification

## Overview
Deploy the existing Todo Chatbot (Phase III) on a local Kubernetes cluster using Minikube, with containerized services and Helm charts for infrastructure management.

## User Journeys

### Journey 1: Developer Local Deployment
**As a developer**, I want to deploy the entire Todo Chatbot stack locally so that I can test Kubernetes configurations before cloud deployment.

**Steps:**
1. Start Minikube cluster
2. Install Helm chart
3. Access frontend via NodePort
4. Verify backend API connectivity
5. Confirm database connections work

**Success Criteria:**
- Single `helm install` command deploys everything
- Frontend accessible via browser
- Backend API returns 200 on health check
- Database migrations run automatically

---

## Requirements

### R1: Container Images
**Priority:** MUST HAVE

#### R1.1: Frontend Container
- Base image: `node:20-alpine`
- Multi-stage build (builder + production)
- Exposed port: 3000
- Environment variables: `NEXT_PUBLIC_API_URL`
- Health endpoint: GET `/`

#### R1.2: Backend Container
- Base image: `python:3.13-slim`
- Install dependencies via UV
- Exposed port: 8000
- Environment variables: `DATABASE_URL`, `OPENAI_API_KEY`
- Health endpoint: GET `/health`

#### R1.3: Image Optimization
- Use Docker layer caching
- Minimize image size (< 500MB frontend, < 300MB backend)
- Use .dockerignore to exclude unnecessary files
- Non-root user for security

---

### R2: Kubernetes Resources
**Priority:** MUST HAVE

#### R2.1: Deployments
- Frontend: 2 replicas, rolling update strategy
- Backend: 2 replicas, rolling update strategy
- Health checks: liveness + readiness probes
- Resource limits defined

#### R2.2: Services
- Frontend: NodePort (expose to host)
- Backend: ClusterIP (internal only)

#### R2.3: ConfigMaps
- Frontend: API endpoint configuration
- Backend: Non-sensitive configuration

#### R2.4: Secrets
- OpenAI API key
- Database credentials (if needed)

---

### R3: Helm Chart Structure
**Priority:** MUST HAVE

charts/todo-chatbot/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration
├── templates/
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
└── .helmignore

#### R3.1: Parameterization
- Image tags configurable
- Replica counts configurable
- Resource limits configurable
- Environment variables templated

---

### R4: Database Integration
**Priority:** MUST HAVE

- Use existing Neon PostgreSQL (external)
- Connection string via Kubernetes Secret
- Test connectivity on pod startup
- Connection pooling configured

---

### R5: Deployment Automation
**Priority:** MUST HAVE

- Single command deployment: `helm install todo-chatbot ./charts/todo-chatbot`
- Automatic secret creation from environment variables
- Port forwarding for local access
- Cleanup script: `helm uninstall todo-chatbot`

---

### R6: Monitoring & Debugging
**Priority:** SHOULD HAVE

- Pod logs accessible via kubectl
- Health check endpoints on all services
- Resource usage tracking
- Debugging guide in documentation

---

## Acceptance Criteria

### AC1: Containerization
- [ ] Frontend Dockerfile builds successfully
- [ ] Backend Dockerfile builds successfully
- [ ] Images run locally via `docker run`
- [ ] Images follow security best practices (non-root user)
- [ ] .dockerignore excludes dev files

### AC2: Helm Chart
- [ ] `helm lint` passes with no errors
- [ ] `helm template` generates valid YAML
- [ ] Chart installs with default values
- [ ] Chart upgrades without downtime
- [ ] `helm test` passes (if test included)

### AC3: Minikube Deployment
- [ ] All pods reach `Running` state within 60s
- [ ] Frontend accessible via `minikube service todo-chatbot-frontend`
- [ ] Backend health endpoint returns 200
- [ ] Database queries succeed from backend pod
- [ ] Logs show no errors

### AC4: Service Communication
- [ ] Frontend can call backend API
- [ ] Backend can connect to Neon database
- [ ] MCP server accessible from backend
- [ ] Cross-pod communication works

### AC5: Resource Management
- [ ] Resource limits prevent OOM kills
- [ ] CPU limits prevent throttling
- [ ] Readiness probes prevent traffic to unhealthy pods
- [ ] Liveness probes restart failed containers

### AC6: Documentation
- [ ] README has complete setup instructions
- [ ] Troubleshooting guide covers common issues
- [ ] Architecture diagram included
- [ ] Demo video (< 90 seconds) uploaded

---

## Domain Rules

### DR1: Service Discovery
- Frontend must use Kubernetes service name (not IP) to reach backend
- Format: `http://todo-chatbot-backend:8000`

### DR2: Environment Separation
- Use namespaces: `todo-app` for application
- Secrets must not be committed to Git
- Use .env.example template for local setup

### DR3: Resource Limits
- Frontend: 256Mi-512Mi memory, 100m-500m CPU
- Backend: 512Mi-1Gi memory, 250m-1000m CPU

### DR4: Security
- Run containers as non-root user
- Use read-only root filesystem where possible
- Secrets stored in Kubernetes Secrets
- No hardcoded credentials

---

## Out of Scope (Phase V)
- Cloud deployment (DigitalOcean/GKE/AKS)
- Kafka/Dapr integration
- CI/CD pipelines
- Production monitoring/logging
- Ingress controllers
- TLS/SSL certificates
- kubectl-ai / Gordon (Docker AI)
```
```

## Response Summary

Created comprehensive feature specification for local Kubernetes deployment (Phase IV). The specification includes:

1. **6 User Stories** (P1-P3 priority):
   - Developer Local Deployment (P1): Core deployment workflow
   - Container Image Creation (P1): Docker build requirements
   - Helm Chart Management (P1): Chart structure and operations
   - Service Communication (P2): Cross-service connectivity
   - Resource Management (P2): Limits and health probes
   - Documentation and Troubleshooting (P3): User guidance

2. **21 Functional Requirements** covering:
   - Containerization (FR-001 to FR-005)
   - Kubernetes Resources (FR-006 to FR-021)
   - Helm chart requirements
   - Security and resource constraints

3. **10 Success Criteria** with measurable outcomes (time-based, size-based, and quality-based)

4. **Quality Checklist** created validating:
   - 14/15 items pass, 1 partial
   - No clarification markers needed
   - Ready for planning phase

## Outcome

- ✅ Impact: Complete spec for Phase IV local Kubernetes deployment with Minikube
- 📁 Files: 2 files created (spec.md, checklists/requirements.md)
- 🔁 Next prompts: /sp.plan to create architecture plan
- 🧠 Reflection: Feature description was comprehensive; no clarifications needed

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A - quality checklist used
- Prompt variant (if applicable): N/A
- Next experiment: Add automated helm chart testing templates
