# Helm Charts

This directory contains Helm charts for deploying the event-driven todo platform.

## Charts

### todo-platform

The main chart that deploys the entire platform including:
- Frontend application
- Backend API
- Audit service
- Notification service
- PostgreSQL database
- Kafka messaging system
- Dapr sidecars

## Values

The chart supports the following customizable values in `values.yaml`:

### Frontend Configuration
- `frontend.replicaCount`: Number of frontend replicas
- `frontend.image.repository`: Frontend image repository
- `frontend.image.tag`: Frontend image tag
- `frontend.service.type`: Service type (ClusterIP, LoadBalancer, etc.)

### Backend Configuration
- `backend.replicaCount`: Number of backend replicas
- `backend.image.repository`: Backend image repository
- `backend.image.tag`: Backend image tag
- `backend.env`: Environment variables for the backend

### Audit Service Configuration
- `auditService.replicaCount`: Number of audit service replicas
- `auditService.image.repository`: Audit service image repository
- `auditService.image.tag`: Audit service image tag
- `auditService.env`: Environment variables for the audit service

### Notification Service Configuration
- `notificationService.replicaCount`: Number of notification service replicas
- `notificationService.image.repository`: Notification service image repository
- `notificationService.image.tag`: Notification service image tag
- `notificationService.env`: Environment variables for the notification service

### PostgreSQL Configuration
- `postgresql.enabled`: Enable PostgreSQL deployment
- `postgresql.auth.postgresPassword`: PostgreSQL password
- `postgresql.auth.database`: Database name

### Kafka Configuration
- `kafka.enabled`: Enable Kafka deployment
- `kafka.replicaCount`: Number of Kafka brokers
- `kafka.zookeeper.enabled`: Enable ZooKeeper

## Installation

To install the chart:

```bash
# Add the PostgreSQL and Kafka repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install the chart
helm install todo-platform ./todo-platform -f values.yaml
```

## Upgrading

To upgrade the chart:

```bash
helm upgrade todo-platform ./todo-platform -f values.yaml
```

## Uninstalling

To uninstall the chart:

```bash
helm uninstall todo-platform
```