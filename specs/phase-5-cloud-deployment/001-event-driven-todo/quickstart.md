# Quickstart Guide: Event-Driven Todo System

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (Minikube for local, DOKS for cloud)
- Dapr CLI and runtime
- Python 3.13+
- Node.js 18+ (for frontend)

## Local Development Setup

### 1. Install Dapr Locally
```bash
dapr init -k
```

### 2. Set Up Kafka (using Strimzi)
```bash
# Create namespace
kubectl create namespace kafka

# Install Strimzi operator
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Create Kafka cluster
cat <<EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-cluster
  namespace: kafka
spec:
  kafka:
    replicas: 1
    listeners:
      - name: plain
        port: 9092
        type: internal
    storage:
      type: ephemeral
  zookeeper:
    replicas: 1
    storage:
      type: ephemeral
EOF
```

### 3. Create Dapr Components
```bash
# Create dapr-components directory
mkdir -p dapr-components

# Create Kafka pubsub component
cat <<EOF > dapr-components/kafka-pubsub.yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "my-cluster-kafka-bootstrap:9092"
  - name: consumerGroup
    value: "todo-services"
EOF

# Apply the component
kubectl apply -f dapr-components/kafka-pubsub.yaml
```

### 4. Build and Deploy Services

```bash
# Build the enhanced backend service
cd backend
docker build -t todo-backend .

# Build the audit service
cd ../services/audit-service
docker build -t audit-service .

# Build the notification service
cd ../notification-service
docker build -t notification-service .

# Deploy using Helm
cd ../../charts/todo-platform
helm install todo-platform . --set frontend.image.tag=latest --set backend.image.tag=latest --set audit.image.tag=latest
```

### 5. Configure Environment Variables

Create a values.yaml file for your deployment:
```yaml
frontend:
  image:
    repository: todo-frontend
    tag: latest
  replicas: 2

backend:
  image:
    repository: todo-backend
    tag: latest
  replicas: 2
  dapr:
    enabled: true
    appId: "backend"
    appPort: 8000

audit:
  image:
    repository: audit-service
    tag: latest
  replicas: 2
  dapr:
    enabled: true
    appId: "audit-service"
    appPort: 8000

notification:
  image:
    repository: notification-service
    tag: latest
  replicas: 1
  dapr:
    enabled: true
    appId: "notification-service"
    appPort: 8000

secrets:
  databaseUrl: "postgresql://user:password@postgres:5432/todo_db"
  openaiApiKey: "your-openai-key"
```

## Testing the Event Flow

### 1. Verify Dapr Installation
```bash
kubectl get pods -n dapr-system
```

### 2. Test Event Publishing
```bash
# Create a task via the API
curl -X POST http://localhost:3000/api/user123/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Test Task", "description": "Test Description", "completed": false}'
```

### 3. Monitor Event Flow
```bash
# Check audit logs
kubectl logs -l app=audit

# Check Kafka topics
kubectl -n kafka run kafka-consumer -ti --image=strimzi/kafka:latest-kafka-3.6.0 --rm=true --restart=Never -- bin/kafka-console-consumer.sh --bootstrap-server my-cluster-kafka-bootstrap:9092 --topic task-events --from-beginning
```

## Cloud Deployment (DigitalOcean)

### 1. Set Up Redpanda Cloud
1. Sign up at redpanda.com/cloud
2. Create serverless cluster
3. Note connection details (brokers, SASL settings)

### 2. Update Dapr Component for Cloud
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "YOUR_REDPANDA_BROKER.redpanda.cloud:9092"
  - name: consumerGroup
    value: "todo-services"
  - name: saslUsername
    secretKeyRef:
      name: redpanda-secret
      key: username
  - name: saslPassword
    secretKeyRef:
      name: redpanda-secret
      key: password
  - name: saslMechanism
    value: "SCRAM-SHA-256"
  - name: version
    value: "3.6.0"
```

### 3. Deploy to DOKS
```bash
# Authenticate to DigitalOcean
doctl kubernetes cluster kubeconfig save your-cluster-name

# Deploy with Helm
helm upgrade --install todo-platform . -f values-production.yaml
```

## CI/CD Pipeline

The GitHub Actions workflow will automatically:
1. Build Docker images on push to main
2. Push to DigitalOcean Container Registry
3. Deploy to DOKS using Helm
4. Run health checks
5. Rollback on failure

Monitor deployments with:
```bash
kubectl get pods
kubectl get events
helm list
```