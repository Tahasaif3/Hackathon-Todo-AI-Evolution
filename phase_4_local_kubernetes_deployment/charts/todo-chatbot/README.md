# Todo Chatbot - Local Kubernetes Deployment

Deploy the Todo Chatbot application to a local Kubernetes cluster using Minikube.

## Prerequisites

Ensure the following tools are installed and available on your PATH:

| Tool | Version | Installation |
|------|---------|--------------|
| Docker | 20.x+ | [docker.com](https://docs.docker.com/get-docker/) |
| Minikube | 1.x+ | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) |
| Helm | 3.x+ | [helm.sh](https://helm.sh/docs/intro/install/) |
| kubectl | 1.x+ | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |

### System Requirements

- **Memory**: Minimum 4GB RAM available for Minikube
- **CPU**: 2+ CPU cores
- **Disk**: 10GB+ free space for images and volumes

## Quick Start

### 1. Start Minikube

```bash
# Start Minikube with adequate resources
minikube start --memory=4096 --cpus=2

# Verify Minikube is running
minikube status
```

### 2. Build Container Images

```bash
# Build frontend image
docker build -t todo-chatbot-frontend:latest ./frontend

# Build backend image
docker build -t todo-chatbot-backend:latest ./backend

# Load images into Minikube
minikube image load todo-chatbot-frontend:latest
minikube image load todo-chatbot-backend:latest
```

### 3. Install Helm Chart

```bash
# Create namespace
kubectl create namespace todo-app

# Install with inline secrets (for local development)
helm install todo-chatbot ./charts/todo-chatbot \
  --namespace todo-app \
  --set secrets.databaseUrl="postgresql://user:password@host:5432/database" \
  --set secrets.openaiApiKey="sk-your-api-key"

# Or install with values file (recommended)
helm install todo-chatbot ./charts/todo-chatbot \
  --namespace todo-app \
  -f values-local.yaml
```

### 4. Access the Application

```bash
# Open frontend in browser
minikube service todo-chatbot-frontend --namespace todo-app

# Or get the URL directly
minikube service todo-chatbot-frontend --namespace todo-app --url
```

### 5. Verify Deployment

```bash
# Check pod status
kubectl get pods -n todo-app

# Check deployment status
kubectl get deployments -n todo-app

# View logs
kubectl logs -l app=todo-chatbot-frontend -n todo-app
kubectl logs -l app=todo-chatbot-backend -n todo-app

# Check backend health
kubectl exec -it deploy/todo-chatbot-backend -n todo-app -- wget -qO- http://localhost:8000/health
```

## Configuration

### Values File

Create a `values-local.yaml` file for local configuration:

```yaml
namespace: todo-app

frontend:
  replicaCount: 2
  image:
    repository: todo-chatbot-frontend
    tag: "latest"
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
  databaseUrl: "postgresql://user:password@host:5432/database"
  openaiApiKey: "sk-your-api-key"
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | From Secret |
| `OPENAI_API_KEY` | OpenAI API key for AI features | From Secret |
| `ENVIRONMENT` | Deployment environment | `development` |

## Architecture

```
                    +------------------+
                    |   Minikube       |
                    |   Cluster        |
                    +------------------+
                             |
          +------------------+------------------+
          |                  |                  |
    +-----v-----+     +------v------+    +------v------+
    |  Frontend |     |   Backend   |    |   Config    |
    |  (Next.js)|     |  (FastAPI)  |    |    Map      |
    |  :3000    |     |   :8000     |    +-------------+
    +-----+-----+     +------+------+
          |                  |
    NodePort           ClusterIP
    (30080)            (internal)
          |                  |
          +--------+---------+
                   |
            Kubernetes Service
            Discovery (DNS)
                   |
    +--------------v---------------+
    |    todo-chatbot-backend     |
    |   (Service name for calls)  |
    +-----------------------------+
```

## Management Commands

### Upgrade Deployment

```bash
# Upgrade after making changes
helm upgrade todo-chatbot ./charts/todo-chatbot \
  --namespace todo-app \
  -f values-local.yaml
```

### Rollback

```bash
# Rollback to previous version
helm rollback todo-chatbot 1 --namespace todo-app
```

### Uninstall

```bash
# Remove deployment
helm uninstall todo-chatbot --namespace todo-app

# Remove namespace (optional)
kubectl delete namespace todo-app
```

### Restart Pods

```bash
# Restart frontend pods
kubectl rollout restart deployment/todo-chatbot-frontend -n todo-app

# Restart backend pods
kubectl rollout restart deployment/todo-chatbot-backend -n todo-app

# Check rollout status
kubectl rollout status deployment/todo-chatbot-backend -n todo-app
```

## Troubleshooting

### Pods Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n todo-app

# Check pod logs
kubectl logs <pod-name> -n todo-app

# Common issues:
# - Image pull errors: Verify images are loaded in Minikube
# - CrashLoopBackOff: Check application logs for errors
# - Pending pods: Verify cluster has enough resources
```

### Container Image Issues

```bash
# Verify images are available
minikube image ls | grep todo-chatbot

# Reload images if needed
minikube image load todo-chatbot-frontend:latest
minikube image load todo-chatbot-backend:latest
```

### Database Connection Failed

```bash
# Verify secret exists
kubectl get secrets -n todo-app

# Check secret values
kubectl get secret todo-chatbot-secrets -n todo-app -o yaml

# Test database connectivity from pod
kubectl exec -it deploy/todo-chatbot-backend -n todo-app -- python -c "import os; print(os.environ.get('DATABASE_URL'))"
```

### Health Probes Failing

```bash
# Check probe configuration
kubectl describe deployment todo-chatbot-backend -n todo-app | grep -A 10 "Liveness"

# Test health endpoint manually
kubectl exec -it deploy/todo-chatbot-backend -n todo-app -- wget -qO- http://localhost:8000/health
```

### Minikube Issues

```bash
# Delete and recreate cluster
minikube delete
minikube start --memory=4096 --cpus=2

# Enable addons if needed
minikube addons enable ingress
minikube addons enable registry
```

### Resource Issues

```bash
# Check node resources
kubectl describe nodes | grep -A 5 "Allocated resources"

# View resource usage
kubectl top pods -n todo-app

# Increase Minikube resources
minikube stop
minikube start --memory=6144 --cpus=4
```

## Security Notes

- **NEVER commit secrets to version control**
- Use `values-local.yaml` with `.gitignore` for local overrides
- Rotate API keys regularly
- Containers run as non-root user (UID 1001)
- Secrets are stored as base64-encoded stringData in Kubernetes

## Cleanup

```bash
# Complete cleanup
helm uninstall todo-chatbot -n todo-app
kubectl delete namespace todo-app

# Delete Minikube cluster (optional)
minikube delete
```

## Support

For issues with:
- **Kubernetes/Minikube**: [kubernetes.io/docs](https://kubernetes.io/docs/tasks/)
- **Helm**: [helm.sh/docs](https://helm.sh/docs/)
- **Docker**: [docs.docker.com](https://docs.docker.com/)
