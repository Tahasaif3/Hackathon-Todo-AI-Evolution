#!/bin/bash

set -e  # Exit on any error

echo "Setting up local Kafka cluster using Strimzi on Minikube..."

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "Error: minikube is not installed. Please install minikube first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Start minikube cluster
echo "Starting minikube cluster..."
minikube start --driver=docker

# Enable the ingress addon
minikube addons enable ingress

# Wait for cluster to be ready
kubectl wait --for=condition=ready nodes --all --timeout=300s

# Install Strimzi Kafka operator
echo "Installing Strimzi Kafka operator..."
kubectl create namespace kafka
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Wait for the operator to be ready
echo "Waiting for Strimzi operator to be ready..."
kubectl wait --for=condition=ready pod -l name=strimzi-cluster-operator -n kafka --timeout=300s

# Create Kafka cluster
echo "Creating Kafka cluster..."
cat << EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: my-cluster
  namespace: kafka
spec:
  kafka:
    version: 3.7.0
    replicas: 1
    listeners:
      - name: plain
        port: 9092
        type: internal
        tls: false
      - name: tls
        port: 9093
        type: internal
        tls: true
    config:
      offsets.topic.replication.factor: 1
      transaction.state.log.replication.factor: 1
      transaction.state.log.min.isr: 1
      default.replication.factor: 1
      min.insync.replicas: 1
      inter.broker.protocol.version: "3.7"
    storage:
      type: jbod
      volumes:
      - id: 0
        type: persistent-claim
        size: 10Gi
        deleteClaim: false
  zookeeper:
    replicas: 1
    storage:
      type: persistent-claim
      size: 5Gi
      deleteClaim: false
  entityOperator:
    topicOperator: {}
    userOperator: {}
EOF

# Wait for Kafka cluster to be ready
echo "Waiting for Kafka cluster to be ready..."
kubectl wait kafka/my-cluster -n kafka --for=condition=Ready --timeout=600s

# Create a Kafka topic for our events
echo "Creating task-events topic..."
cat << EOF | kubectl apply -f -
apiVersion: kafka.strimzi.io/v1beta2
kind: KafkaTopic
metadata:
  name: task-events
  namespace: kafka
  labels:
    strimzi.io/cluster: my-cluster
spec:
  partitions: 1
  replicas: 1
  config:
    retention.ms: 7200000
    segment.bytes: 1073741824
EOF

# Port forward Kafka to localhost for local development
echo "Setting up port forwarding for Kafka..."
kubectl port-forward -n kafka svc/my-cluster-kafka-external-bootstrap 9092:9092 &
PORT_FORWARD_PID=$!

echo "Kafka cluster is ready!"
echo "Topic 'task-events' created."
echo "Port forwarding started (PID: $PORT_FORWARD_PID)"

# Create a service to expose Kafka internally in the cluster
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: kafka-service
  namespace: kafka
spec:
  type: ExternalName
  externalName: my-cluster-kafka-bootstrap.kafka.svc.cluster.local
  ports:
  - port: 9092
    targetPort: 9092
    protocol: TCP
    name: plaintext
EOF

echo "Local Kafka setup complete!"
echo "Kafka is available at: my-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092"
echo "From within the cluster, use: kafka.kafka.svc.cluster.local:9092"