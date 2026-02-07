# Deployment Guide for Event-Driven Todo System

This guide covers the deployment of the event-driven todo system to both local (Minikube) and cloud (DOKS) environments.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Local Deployment](#local-deployment)
- [Cloud Deployment](#cloud-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

The event-driven todo system consists of:

- **Frontend**: Next.js application
- **Backend**: FastAPI application with event publishing capabilities
- **Audit Service**: FastAPI service that consumes task events and stores audit logs
- **Notification Service**: FastAPI service for handling notifications
- **Kafka**: Event streaming platform
- **PostgreSQL**: Primary database for application data and audit logs
- **Dapr**: Distributed application runtime for service communication

## Local Deployment

### Prerequisites

- Docker
- Minikube
- kubectl
- Helm
- Dapr CLI

### Steps

1. **Start Minikube:**
   ```bash
   minikube start --driver=docker
   ```

2. **Install Kafka using Strimzi:**
   ```bash
   ./scripts/local-kafka-setup.sh
   ```

3. **Install Dapr:**
   ```bash
   ./scripts/install-dapr-minikube.sh
   ```

4. **Deploy the application:**
   ```bash
   # Build container images
   docker build -t todo-frontend ./frontend
   docker build -t todo-backend ./backend
   docker build -t audit-service ./services/audit-service
   docker build -t notification-service ./services/notification-service

   # Deploy with Helm
   helm upgrade --install todo-platform ./charts/todo-platform \
     --set frontend.image.repository=todo-frontend \
     --set frontend.image.tag=latest \
     --set backend.image.repository=todo-backend \
     --set backend.image.tag=latest \
     --set auditService.image.repository=audit-service \
     --set auditService.image.tag=latest \
     --set notificationService.image.repository=notification-service \
     --set notificationService.image.tag=latest
   ```

5. **Access the application:**
   ```bash
   minikube service todo-platform-frontend --url
   ```

## Cloud Deployment (DOKS)

### Prerequisites

- DigitalOcean account
- doctl CLI
- kubectl
- Helm
- Dapr CLI

### Steps

1. **Set up the cloud infrastructure:**
   ```bash
   ./scripts/cloud-deployment-setup.sh
   ```

2. **Build and push container images:**
   ```bash
   # Build and push to container registry
   # Images are automatically built and pushed by the CI/CD pipeline
   ```

3. **Deploy to DOKS:**
   ```bash
   # Deployment is handled by the CI/CD pipeline
   # Or manually with:
   helm upgrade --install todo-platform-prod ./charts/todo-platform \
     --namespace todo-prod \
     --create-namespace \
     --values ./values-prod.yaml
   ```

## CI/CD Pipeline

The CI/CD pipeline is configured in `.github/workflows/deploy.yml` and includes:

- Automated testing on pull requests
- Building and pushing container images to GHCR
- Deploying to development environment on `develop` branch
- Deploying to production on `main` branch
- Slack notifications for deployment status

### Pipeline Triggers

- Push to `main` or `develop` branches
- Pull requests to `main`

### Secrets Required

- `KUBE_CONFIG_DATA`: Base64 encoded kubeconfig for dev cluster
- `PROD_KUBE_CONFIG_DATA`: Base64 encoded kubeconfig for prod cluster
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

## Monitoring and Logging

### Setup

Run the monitoring setup script to install observability tools:

```bash
./scripts/monitoring-setup.sh
```

### Components

- **Prometheus + Grafana**: Metrics collection and visualization
- **Loki**: Centralized logging
- **Jaeger**: Distributed tracing
- **Dapr Observability**: Built-in Dapr metrics and tracing

### Access

- **Grafana**: `http://<GRAFANA-LB-IP>:80` (admin/prom-operator)
- **Jaeger UI**: `http://<JAEGER-LB-IP>:16686`
- **Prometheus**: `http://<PROMETHEUS-LB-IP>:9090`

## Troubleshooting

### Common Issues

1. **Dapr Sidecar Not Injected**
   - Check if Dapr is installed: `dapr status -k`
   - Verify annotations in deployment files

2. **Kafka Connection Issues**
   - Check Kafka cluster status: `kubectl get kafka -n kafka`
   - Verify service endpoints: `kubectl get endpoints -n kafka`

3. **Event Processing Failures**
   - Check audit service logs: `kubectl logs -l app=audit-service`
   - Verify Dapr pubsub component configuration

4. **Database Connection Issues**
   - Check PostgreSQL status: `kubectl get pods -l app=postgresql`
   - Verify connection strings in deployment values

### Useful Commands

```bash
# Check all pods
kubectl get pods --all-namespaces

# Check Dapr status
dapr status -k

# Check Kafka status
kubectl get kafka -n kafka

# View logs for a specific service
kubectl logs -l app=backend -n todo-platform

# Check Dapr sidecar injection
kubectl get pods -o yaml | grep dapr.io/enabled
```

## Security Considerations

- All services communicate through Dapr sidecars
- JWT authentication for all API endpoints
- Proper RBAC configurations for Kubernetes
- Secrets management using Kubernetes secrets
- Network policies to restrict traffic between services

## Scaling Recommendations

- Use Horizontal Pod Autoscaler (HPA) based on CPU/memory metrics
- Scale Kafka brokers based on event throughput
- Monitor database connection pools
- Implement circuit breakers for external service calls