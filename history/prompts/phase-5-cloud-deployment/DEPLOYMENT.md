# Cloud Deployment: DigitalOcean Kubernetes Service (DOKS)

This document describes the process for deploying the Event-Driven Todo System to DigitalOcean Kubernetes Service (DOKS).

## Prerequisites

- DigitalOcean account with billing enabled
- DigitalOcean CLI (`doctl`) installed and authenticated
- `kubectl` installed
- `helm` 3+ installed
- `dapr` CLI installed
- Docker installed for building images

## Setup Process

### 1. Install Required Tools

```bash
# Install doctl (DigitalOcean CLI)
# Follow instructions at: https://docs.digitalocean.com/reference/doctl/how-to/install/

# Install kubectl
# Follow instructions at: https://kubernetes.io/docs/tasks/tools/

# Install Helm
# Follow instructions at: https://helm.sh/docs/intro/install/

# Install Dapr CLI
# Follow instructions at: https://docs.dapr.io/getting-started/install-dapr-cli/
```

### 2. Authenticate with DigitalOcean

```bash
doctl auth init
# Follow prompts to authenticate
```

### 3. Set Up Kafka Secrets

Before running the deployment script, you need to set up your Kafka credentials as environment variables:

```bash
# If using Redpanda Cloud, Confluent Cloud, or similar managed Kafka service
export DAPR_KAFKA_BROKERS="your-kafka-brokers.example.com:9092"
export DAPR_KAFKA_USERNAME="your-kafka-username"
export DAPR_KAFKA_PASSWORD="your-kafka-password"
```

### 4. Run Cloud Infrastructure Setup

```bash
# Run the cloud deployment setup script
./scripts/cloud-deployment-setup.sh
```

This will:
- Create a DOKS cluster named `todo-platform-cluster`
- Configure kubectl to use the new cluster
- Install Dapr runtime on the cluster
- Set up Kafka Dapr component with secrets
- Create the `todo-prod` namespace

### 5. Build and Push Container Images

```bash
# Set your container registry (optional, leave empty for Docker Hub or DOCR)
export DOCKER_REGISTRY="registry.digitalocean.com/your-registry/" # or your registry URL
export IMAGE_TAG="v1.0.0" # or your preferred tag

# Build and push images
./scripts/build-and-push-images.sh
```

### 6. Update Values for Production

Update `values-prod.yaml` with your actual image repository paths:

```yaml
# In values-prod.yaml
global:
  imageRegistry: "registry.digitalocean.com/your-registry/" # Your registry URL

frontend:
  image:
    repository: "todo-frontend"  # Updated to match your registry
    tag: "v1.0.0"  # Your image tag

backend:
  image:
    repository: "todo-backend"  # Updated to match your registry
    tag: "v1.0.0"  # Your image tag

# Similar updates for auditService and notificationService
```

### 7. Deploy Application to DOKS

```bash
# Deploy using Helm
helm upgrade --install todo-platform-prod ./charts/todo-platform \
  --namespace todo-prod \
  --create-namespace \
  --values ./values-prod.yaml
```

### 8. Verify Deployment

```bash
# Run verification script
./scripts/cloud-deployment-verify.sh
```

Or manually verify:

```bash
# Check pod status
kubectl get pods -n todo-prod

# Check services
kubectl get svc -n todo-prod

# Check ingress
kubectl get ingress -n todo-prod

# Check Dapr status
dapr status -k --namespace todo-prod
```

## Monitoring and Maintenance

### Scaling Applications

```bash
# Scale frontend
kubectl scale deployment todo-platform-prod-frontend --replicas=5 -n todo-prod

# Scale backend
kubectl scale deployment todo-platform-prod-backend --replicas=3 -n todo-prod
```

### Updating Applications

```bash
# Update with new image tag
helm upgrade --install todo-platform-prod ./charts/todo-platform \
  --namespace todo-prod \
  --set frontend.image.tag="new-version" \
  --set backend.image.tag="new-version" \
  --values ./values-prod.yaml
```

### Accessing Logs

```bash
# View frontend logs
kubectl logs -l app=frontend -n todo-prod

# View backend logs
kubectl logs -l app=backend -n todo-prod

# View audit service logs
kubectl logs -l app=audit-service -n todo-prod
```

## Troubleshooting

### Common Issues

1. **Image Pull Errors**: Verify that your image repository and tags are correct in values-prod.yaml and that the imagePullSecrets are properly configured if using a private registry.

2. **Kafka Connection Issues**: Ensure that your Kafka credentials are correctly set as secrets and that the Kafka brokers are accessible from the cluster.

3. **Dapr Sidecar Issues**: Check that Dapr is properly installed and that the Dapr components are correctly configured.

4. **LoadBalancer Not Provisioning**: In some regions, LoadBalancer provisioning may take time. Check the status with `kubectl get svc`.

### Useful Commands

```bash
# Check cluster status
kubectl cluster-info

# Check resource usage
kubectl top nodes
kubectl top pods -n todo-prod

# Port forward for debugging
kubectl port-forward -n todo-prod svc/todo-platform-prod-frontend 3000:3000
kubectl port-forward -n todo-prod svc/todo-platform-prod-backend 8000:8000
```

## Clean Up

To remove the deployment:

```bash
# Uninstall Helm release
helm uninstall todo-platform-prod -n todo-prod

# Delete namespace
kubectl delete namespace todo-prod

# Optionally delete the DOKS cluster
doctl kubernetes cluster delete todo-platform-cluster
```

## Security Considerations

- All services run with non-root user privileges
- Resource limits are enforced to prevent resource exhaustion
- Dapr provides secure service-to-service communication
- Secrets are stored encrypted at rest in etcd
- Network policies (not included in this setup) should be implemented for production use