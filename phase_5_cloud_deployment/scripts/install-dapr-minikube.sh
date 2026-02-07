#!/bin/bash

set -e  # Exit on any error

echo "Installing Dapr on Minikube with full capabilities..."

# Check if minikube is running
if ! minikube status &> /dev/null; then
    echo "Error: minikube is not running. Please start minikube first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if dapr CLI is installed
if ! command -v dapr &> /dev/null; then
    echo "Installing Dapr CLI..."
    wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
fi

# Initialize Dapr on the Kubernetes cluster
echo "Initializing Dapr on Minikube..."
dapr init --kubernetes

# Wait for Dapr to be ready
echo "Waiting for Dapr to be ready..."
kubectl wait --for=condition=ready pods -l app.kubernetes.io/name=dapr --all-namespaces --timeout=300s

# Verify Dapr installation
echo "Verifying Dapr installation..."
dapr status -k

# Create Dapr components for full capabilities:

# 1. Kafka Pub/Sub component
echo "Creating Kafka Pub/Sub component..."
cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: default
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "my-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092"
  - name: consumerGroup
    value: "dapr-consumer-group"
  - name: clientID
    value: "dapr"
  - name: authType
    value: "none"
EOF

# 2. State store component (Redis)
echo "Creating Redis state store component..."
cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
  namespace: default
spec:
  type: state.redis
  version: v1
  metadata:
  - name: redisHost
    value: "redis-master.redis.svc.cluster.local:6379"
  - name: redisPassword
    value: ""
  - name: actorStateStore
    value: "true"
EOF

# 3. Secret store component
echo "Creating Kubernetes secret store component..."
cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secret-store
  namespace: default
spec:
  type: secretstores.kubernetes
  version: v1
  metadata: []
EOF

# 4. Cron binding component (for scheduled tasks)
echo "Creating cron binding component..."
cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: cron-binding
  namespace: default
spec:
  type: bindings.cron
  version: v1
  metadata:
  - name: schedule
    value: "@every 30s"
EOF

# 5. HTTP binding component (for external service invocation)
echo "Creating HTTP binding component..."
cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: http-output
  namespace: default
spec:
  type: bindings.http
  version: v1
  metadata:
  - name: url
    value: "http://example.com"
  - name: method
    value: "POST"
EOF

# Verify that Dapr is running correctly
echo "Checking Dapr control plane status..."
kubectl get pods -n dapr-system

echo "Dapr installation complete with full capabilities:"
echo "- Pub/Sub (Kafka)"
echo "- State Store (Redis)"
echo "- Secret Store (Kubernetes)"
echo "- Bindings (Cron and HTTP)"
echo "- Service Invocation"
echo ""
echo "Dapr is ready to use in your Minikube cluster!"