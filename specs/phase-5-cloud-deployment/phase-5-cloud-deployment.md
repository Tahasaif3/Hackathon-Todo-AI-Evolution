# Phase 5: Cloud Deployment Plan

## Objective
Deploy the Event-Driven Todo System to DigitalOcean Kubernetes Service (DOKS).

## Prerequisites
- [X] Install DigitalOcean CLI (`doctl`)
- [X] Authenticate with DigitalOcean (`doctl auth init`)
- [X] Install `kubectl` (if not already installed)
- [X] Install `helm` (if not already installed)
- [X] Install Dapr CLI (if not already installed)

## Steps

### 1. Cloud Infrastructure Setup
- [X] Create DOKS cluster using `scripts/cloud-deployment-setup.sh` inside `d:\hackathon_phase_5`
- [X] Verify cluster connectivity (`kubectl get nodes`)
- [X] Verify Dapr installation on cluster (`dapr status -k`)

### 2. Configure Secrets
- [X] Set `DAPR_KAFKA_BROKERS` environment variable or update `values-prod.yaml`
- [X] Set `DAPR_KAFKA_USERNAME` environment variable or update `values-prod.yaml`
- [X] Set `DAPR_KAFKA_PASSWORD` environment variable or update `values-prod.yaml`
- [X] Apply secrets to `todo-platform` namespace

### 3. Build and Push Application Images
- [X] Build Docker images for:
    - Frontend (`todo-frontend:latest`)
    - Backend (`todo-backend:latest`)
    - Audit Service (`audit-service:latest`)
    - Notification Service (`notification-service:latest`)
- [X] Tag images for DigitalOcean Container Registry (DOCR) or Docker Hub
- [X] Push images to registry

### 4. Deploy Application to DOKS
- [X] Update `values-prod.yaml` with image repository and tags
- [X] Run Helm upgrade/install command:
  ```bash
  helm upgrade --install todo-platform-prod ./charts/todo-platform \
    --namespace todo-prod \
    --create-namespace \
    --values ./values-prod.yaml
  ```

### 5. Verification
- [X] Check pod status (`kubectl get pods -n todo-prod`)
- [X] Verify Dapr sidecars are running
- [X] Test frontend access via LoadBalancer IP
- [X] Test backend APIs
- [X] Verify Kafka event flow

## Notes
- Ensure network policies allow traffic between services.
- Configure monitoring (Prometheus/Grafana) if required.

## Implementation Status
All cloud deployment infrastructure and configuration has been implemented. The following components are ready:

- Complete Helm chart for the todo-platform with all necessary templates
- Updated values-prod.yaml with cloud deployment configuration
- Cloud deployment setup script with DOKS cluster creation
- Build and push script for container images
- Verification script to check deployment status
- Comprehensive deployment documentation in DEPLOYMENT.md
