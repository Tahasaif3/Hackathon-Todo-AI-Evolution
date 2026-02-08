---

description: "Task list template for feature implementation"
---

# Tasks: Local Kubernetes Deployment

**Input**: Design documents from `/specs/003-local-k8s-deployment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Helm chart**: `charts/todo-chatbot/`
- **Frontend**: `frontend/`
- **Backend**: `backend/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Helm chart directory structure at charts/todo-chatbot/
- [X] T002 [P] Create charts/todo-chatbot/Chart.yaml with metadata
- [X] T003 [P] Create charts/todo-chatbot/.helmignore
- [X] T004 [P] Create charts/todo-chatbot/values.yaml with default configuration
- [X] T005 [P] Create charts/todo-chatbot/templates/_helpers.tpl

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create frontend/.dockerignore with build context exclusions
- [X] T007 Create backend/.dockerignore with build context exclusions
- [X] T008 Create frontend/Dockerfile with multi-stage build (node:20-alpine)
- [X] T009 Create backend/Dockerfile with multi-stage build (python:3.13-slim with UV)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Local Deployment (Priority: P1) 🎯 MVP

**Goal**: Enable single-command deployment via Helm that makes all services accessible

**Independent Test**: Run `helm install todo-chatbot ./charts/todo-chatbot` and verify all pods reach Running state within 60 seconds, frontend accessible via `minikube service`

### Helm Chart Templates for Deployment

- [X] T010 [P] [US1] Create charts/todo-chatbot/templates/frontend-deployment.yaml
- [X] T011 [P] [US1] Create charts/todo-chatbot/templates/frontend-service.yaml (NodePort)
- [X] T012 [P] [US1] Create charts/todo-chatbot/templates/backend-deployment.yaml
- [X] T013 [P] [US1] Create charts/todo-chatbot/templates/backend-service.yaml (ClusterIP)
- [X] T014 [P] [US1] Create charts/todo-chatbot/templates/configmap.yaml
- [X] T015 [P] [US1] Create charts/todo-chatbot/templates/secret.yaml

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Container Image Creation (Priority: P1)

**Goal**: Build container images that meet security and size requirements

**Independent Test**: Run `docker build` for both services and verify images under size limits (frontend < 500MB, backend < 300MB) and run as non-root

### Image Verification Tasks

- [X] T016 [P] [US2] Build frontend image and verify size < 500MB
- [X] T017 [P] [US2] Build backend image and verify size < 300MB
- [X] T018 [US2] Verify containers run as non-root user
- [X] T019 [US2] Test multi-stage build produces minimal final image

**Checkpoint**: User Story 2 complete - verified container images meet requirements

---

## Phase 5: User Story 3 - Helm Chart Management (Priority: P1)

**Goal**: Helm chart passes lint, generates valid YAML, supports install/upgrade/uninstall

**Independent Test**: Run `helm lint`, `helm template`, and `helm install/upgrade/uninstall` commands

### Chart Validation Tasks

- [X] T020 [P] [US3] Run `helm lint ./charts/todo-chatbot` and fix any errors
- [X] T021 [P] [US3] Run `helm template ./charts/todo-chatbot` and validate YAML output
- [X] T022 [US3] Test `helm install` creates all resources
- [X] T023 [US3] Test `helm upgrade` performs rolling update without downtime
- [X] T024 [US3] Test `helm uninstall` cleanly removes all resources

**Checkpoint**: User Story 3 complete - Helm chart is production-ready

---

## Phase 6: User Story 4 - Service Communication (Priority: P2)

**Goal**: Frontend can call backend API, backend can connect to database

**Independent Test**: Verify API calls succeed between services using Kubernetes service discovery

### Service Communication Tasks

- [X] T025 [P] [US4] Verify frontend NEXT_PUBLIC_API_URL uses service name
- [X] T026 [P] [US4] Verify backend DATABASE_URL from Secret
- [X] T027 [US4] Test frontend-to-backend communication via service discovery
- [X] T028 [US4] Test backend-to-database connectivity via Secret

**Checkpoint**: User Story 4 complete - all service communication verified

---

## Phase 7: User Story 5 - Resource Management (Priority: P2)

**Goal**: Health probes work, resource limits prevent exhaustion, zero-downtime updates

**Independent Test**: Verify liveness/restart behavior and resource limits are respected

### Resource Management Tasks

- [X] T029 [P] [US5] Verify frontend liveness/readiness probes configured
- [X] T030 [P] [US5] Verify backend liveness/readiness probes configured
- [X] T031 [P] [US5] Verify frontend resource limits (256-512Mi memory, 100-500m CPU)
- [X] T032 [P] [US5] Verify backend resource limits (512Mi-1Gi memory, 250-1000m CPU)
- [X] T033 [US5] Test liveness probe triggers container restart
- [X] T034 [US5] Test readiness probe prevents traffic to unhealthy pod

**Checkpoint**: User Story 5 complete - resource management verified

---

## Phase 8: User Story 6 - Documentation and Troubleshooting (Priority: P3)

**Goal**: Complete README with setup, usage, and troubleshooting guides

**Independent Test**: Developer can deploy following README without additional research

### Documentation Tasks

- [X] T035 [P] [US6] Create README.md with prerequisites and setup steps
- [X] T036 [P] [US6] Create deployment commands section in README
- [X] T037 [P] [US6] Create troubleshooting section with common issues
- [X] T038 [US6] Create architecture diagram (Mermaid or ASCII)
- [X] T039 [US6] Document cleanup and teardown procedures

**Checkpoint**: User Story 6 complete - documentation is comprehensive

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T040 [P] Verify all containers use SecurityContext (non-root, read-only)
- [X] T041 [P] Verify rolling update strategy (maxSurge=1, maxUnavailable=0)
- [X] T042 [P] Verify namespace configuration (todo-app)
- [X] T043 Create values-local.yaml.example for local development
- [X] T044 [P] Add comments to Helm templates for clarity
- [ ] T045 Run final end-to-end deployment test
- [X] T046 Update CLAUDE.md with new infrastructure files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent from US1
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Independent from US1, US2
- **User Story 4 (P2)**: Can start after Foundational - Benefits from US1 complete
- **User Story 5 (P2)**: Can start after Foundational - Benefits from US1 complete
- **User Story 6 (P3)**: Can start after Foundational - Benefits from all other stories

### Within Each User Story

- Story complete before moving to next priority
- Parallel tasks marked [P] can run together

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All templates within US1 marked [P] can run in parallel
- Documentation tasks within US6 marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all US1 Helm template tasks together:
Task: "Create frontend-deployment.yaml"
Task: "Create frontend-service.yaml"
Task: "Create backend-deployment.yaml"
Task: "Create backend-service.yaml"
Task: "Create configmap.yaml"
Task: "Create secret.yaml"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Helm chart with all templates)
4. **STOP and VALIDATE**: Test User Story 1 independently - deploy to Minikube
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Verify container images
4. Add User Story 3 → Test independently → Verify Helm operations
5. Add User Story 4 → Test independently → Verify service communication
6. Add User Story 5 → Test independently → Verify resource management
7. Add User Story 6 → Test independently → Complete documentation
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Helm templates)
   - Developer B: User Story 2 (Dockerfile verification)
   - Developer C: User Story 3 (Helm validation)
3. Stories complete and integrate independently

---

## Task Summary

| Phase | Description | Tasks |
|-------|-------------|-------|
| Phase 1 | Setup (shared infrastructure) | 5 tasks |
| Phase 2 | Foundational (blocking prerequisites) | 4 tasks |
| Phase 3 | User Story 1 - Developer Local Deployment | 6 tasks |
| Phase 4 | User Story 2 - Container Image Creation | 4 tasks |
| Phase 5 | User Story 3 - Helm Chart Management | 5 tasks |
| Phase 6 | User Story 4 - Service Communication | 4 tasks |
| Phase 7 | User Story 5 - Resource Management | 6 tasks |
| Phase 8 | User Story 6 - Documentation | 5 tasks |
| Phase 9 | Polish & Cross-Cutting | 7 tasks |

**Total Tasks**: 46

**MVP Scope (User Story 1)**: Tasks T001-T015 (15 tasks)

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
