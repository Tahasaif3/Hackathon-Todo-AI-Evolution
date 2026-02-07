#!/bin/bash

set -e  # Exit on any error

echo "Setting up cloud deployment for DOKS (DigitalOcean Kubernetes)..."

# Check if required tools are installed
if ! command -v doctl &> /dev/null; then
    echo "Error: doctl is not installed. Please install DigitalOcean CLI first."
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl first."
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed. Please install Helm first."
    exit 1
fi

if ! command -v dapr &> /dev/null; then
    echo "Error: dapr is not installed. Please install Dapr CLI first."
    exit 1
fi

# Check if user is authenticated with DigitalOcean
echo "Checking DigitalOcean authentication..."
doctl auth list

echo "Creating DigitalOcean Kubernetes cluster..."

# Create the DOKS cluster
doctl kubernetes cluster create todo-platform-cluster \
  --region sfo3 \
  --node-pool "name=todo-workers;size=s-2vcpu-4gb;count=3" \
  --maintenance-window "monday=02:00" \
  --wait

echo "Getting cluster credentials..."
doctl kubernetes cluster kubeconfig save todo-platform-cluster

# Verify cluster connectivity
echo "Verifying cluster connectivity..."
kubectl get nodes

echo "Installing Dapr on DOKS..."

# Install Dapr on the cluster
dapr init --kubernetes

# Wait for Dapr to be ready
kubectl wait --for=condition=ready pods -l app.kubernetes.io/name=dapr --all-namespaces --timeout=300s

echo "Dapr installed successfully on DOKS!"
dapr status -k

# Create namespace for the application
kubectl create namespace todo-prod || true

# Check if Kafka secrets are set as environment variables
if [ -z "$DAPR_KAFKA_BROKERS" ] || [ -z "$DAPR_KAFKA_USERNAME" ] || [ -z "$DAPR_KAFKA_PASSWORD" ]; then
    echo "Warning: Kafka environment variables not set."
    echo "Please set DAPR_KAFKA_BROKERS, DAPR_KAFKA_USERNAME, and DAPR_KAFKA_PASSWORD before continuing."
    echo "Example:"
    echo "export DAPR_KAFKA_BROKERS='your-kafka-brokers'"
    echo "export DAPR_KAFKA_USERNAME='your-username'"
    echo "export DAPR_KAFKA_PASSWORD='your-password'"
    exit 1
else
    echo "Kafka secrets detected in environment variables."

    # Create secrets for cloud credentials
    echo "Creating Kafka secrets in the cluster..."
    kubectl create secret generic kafka-secrets \
        --from-literal=kafka-brokers="$DAPR_KAFKA_BROKERS" \
        --from-literal=kafka-username="$DAPR_KAFKA_USERNAME" \
        --from-literal=kafka-password="$DAPR_KAFKA_PASSWORD" \
        --namespace todo-prod || true

    # Set up Kafka Dapr component with reference to secrets
    cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kafka-pubsub
  namespace: todo-prod
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    valueFrom:
      secretKeyRef:
        name: kafka-secrets
        key: kafka-brokers
  - name: consumerGroup
    value: "dapr-consumer-group"
  - name: clientID
    value: "dapr"
  - name: authType
    value: "password"
  - name: username
    valueFrom:
      secretKeyRef:
        name: kafka-secrets
        key: kafka-username
  - name: password
    valueFrom:
      secretKeyRef:
        name: kafka-secrets
        key: kafka-password
  - name: authScheme
    value: "PLAIN"
EOF
fi

echo "Cloud infrastructure setup complete!"
echo "Kubernetes cluster: todo-platform-cluster"
echo "Dapr runtime installed and configured"
echo "Kafka components and secrets created"
echo ""
echo "Next steps:"
echo "1. Build and push container images: ./scripts/build-and-push-images.sh"
echo "2. Deploy the application using Helm:"
echo "   helm upgrade --install todo-platform-prod ./charts/todo-platform --namespace todo-prod --create-namespace --values ./values-prod.yaml"
echo "3. Verify deployment: ./scripts/cloud-deployment-verify.sh"