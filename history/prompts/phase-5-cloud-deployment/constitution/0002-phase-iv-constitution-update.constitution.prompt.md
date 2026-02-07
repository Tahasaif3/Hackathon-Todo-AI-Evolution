---
id: 2
title: "Phase IV Constitution Update"
stage: constitution
date: "2025-12-31"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "governance", "phase-iv", "cloud-native", "kubernetes"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
  - ".specify/templates/plan-template.md"
tests: []
---

## Prompt

Update the project constitution with Phase IV cloud-native principles:

```
#  - Phase IV Constitution

## Architecture Principles

### 1. Cloud-Native First
- All components must be containerized
- Services must be stateless (state in external DB)
- Configuration via environment variables
- 12-factor app methodology

### 2. Security Standards
- No secrets in code or Docker images
- Use Kubernetes Secrets for sensitive data
- API keys loaded from environment
- Database credentials externally managed

### 3. Scalability Requirements
- Frontend: Minimum 2 replicas
- Backend: Minimum 2 replicas
- Horizontal scaling via Kubernetes
- Health checks on all pods

### 4. Technology Constraints
- Container Runtime: Docker
- Orchestration: Kubernetes (Minikube for local)
- Package Manager: Helm 3+
- Base Images: Python 3.13-slim, Node 20-alpine

### 5. Development Standards
- All infrastructure as code
- Helm charts for reproducible deployments
- No manual kubectl commands in production
- Version control all YAML manifests

### 6. Performance Requirements
- Frontend: < 2s page load
- Backend API: < 500ms response time
- Database queries: < 100ms
- Pod startup: < 30s

### 7. AIOps Integration
- Use Docker AI (Gordon) for container optimization
- Use kubectl-ai for Kubernetes operations
- Use kagent for cluster analysis
- Document all AI-assisted operations

## Non-Negotiables

1. **No localhost hardcoding** - Use service discovery
2. **No root users in containers** - Security best practice
3. **Health/readiness probes required** - For zero-downtime deployments
4. **Resource limits defined** - Prevent resource starvation
5. **Logs to stdout/stderr** - For Kubernetes log aggregation
## Response Summary

Updated the project constitution to version 1.2.0 with comprehensive Phase IV cloud-native and Kubernetes deployment principles. The "Cloud & Kubernetes Standards (Phase IV+)" section was significantly expanded from a brief 12-rule list into 8 detailed subsections:

1. **Cloud-Native First**: Containerization, stateless architecture, 12-factor app methodology
2. **Security Standards**: No secrets in code/images, Kubernetes Secrets, non-root containers
3. **Scalability Requirements**: Minimum 2 replicas, HPA configuration, resource limits
4. **Technology Constraints**: Docker, Kubernetes, Helm 3+, specific base images
5. **Development Standards**: IaC, Helm charts, no manual kubectl in production
6. **Performance Requirements**: Specific latency targets for frontend, API, and DB
7. **AIOps Integration**: Docker AI, kubectl-ai, kagent recommendations
8. **Non-Negotiable Deployment Rules**: Table of critical rules with YAML examples

Also updated `.specify/templates/plan-template.md` with Phase IV-specific Constitution Check gates.

## Outcome

- ✅ Impact: Constitution updated with 8 new comprehensive subsections for Phase IV cloud-native deployment
- 📁 Files: 2 files modified (.specify/memory/constitution.md, .specify/templates/plan-template.md)
- 🔁 Next prompts: Continue Phase IV infrastructure planning
- 🧠 Reflection: The expanded Phase IV section provides clear, actionable guidance for containerized deployments

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment: Create Phase IV Helm chart templates and deployment manifests
