---
id: "0008"
title: "Fix frontend-backend connectivity"
stage: "misc"
date: "2026-01-01"
surface: "CLI"
model: "claude-sonnet-4-5-20250929"
feature: "003-local-k8s-deployment"
branch: "003-local-k8s-deployment"
user: "human"
command: "/sp.implement the application is containeried but both docker images when build frontend cannot connect to bbackend gives failed to fetch errror"
labels: ["connectivity", "CORS", "Docker", "Kubernetes"]
links:
  spec: ""
  ticket: ""
  adr: ""
  pr: ""
files:
  - "backend/src/main.py"
  - "backend/src/config.py"
tests: []
---

## Prompt

The user reported that the containerized application has frontend failing to connect to backend with "failed to fetch" errors. Both Docker images build successfully but cannot communicate.

## Response snapshot

**Problem Identified**: CORS misconfiguration in backend

The frontend is accessing the backend at `http://192.168.49.2:30147` (Minikube NodePort), but the backend's CORS configuration only allowed localhost origins.

**Root Causes**:
1. CORS `allowed_origins` in `backend/src/main.py` only included `localhost:*` URLs
2. JWT cookie settings required HTTPS (`Secure` flag, `SameSite=None`) which doesn't work with HTTP

**Fixes Applied**:

1. **Updated CORS origins in `backend/src/main.py`** to include:
   - Minikube NodePort URLs (`192.168.49.2:30080`, `192.168.49.2:30081`, `192.168.49.2:30147`, `192.168.49.2:30148`)
   - Kubernetes internal service names (`http://todo-chatbot-backend:8000`)

2. **Updated JWT cookie settings in `backend/src/config.py`**:
   - `JWT_COOKIE_SECURE: False` (for HTTP)
   - `JWT_COOKIE_SAMESITE: "lax"` (for local development)

## Outcome

- ✅ Impact: Fixed frontend-to-backend connectivity by enabling CORS for Minikube NodePort and Kubernetes service URLs
- 🧪 Tests: N/A (configuration-only fix)
- 📁 Files: Modified 2 files (backend/src/main.py, backend/src/config.py)
- 🔁 Next prompts: Rebuild Docker images and redeploy to Minikube
- 🧠 Reflection: CORS issues are common when moving from localhost to containerized/K8s environments. Always include all potential origins including service discovery URLs.

## Evaluation notes (flywheel)

- Failure modes observed: Browser blocking cross-origin requests due to missing CORS headers
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify frontend can reach backend at internal K8s service name `http://todo-chatbot-backend:8000`
