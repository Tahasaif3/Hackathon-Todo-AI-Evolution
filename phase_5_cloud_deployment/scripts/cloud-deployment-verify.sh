#!/bin/bash

set -e  # Exit on any error

echo "Verifying cloud deployment..."

# Check if required tools are installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl first."
    exit 1
fi

if ! command -v dapr &> /dev/null; then
    echo "Error: dapr is not installed. Please install Dapr CLI first."
    exit 1
fi

NAMESPACE=${DEPLOYMENT_NAMESPACE:-"todo-prod"}

echo "Checking pod status in namespace: $NAMESPACE"
kubectl get pods -n $NAMESPACE

echo ""
echo "Verifying Dapr sidecars are running..."
dapr status -k --namespace $NAMESPACE

echo ""
echo "Checking service status..."
kubectl get svc -n $NAMESPACE

echo ""
echo "Checking ingress status..."
kubectl get ingress -n $NAMESPACE || echo "No ingress resources found"

echo ""
echo "Checking application logs for any errors..."
for deployment in $(kubectl get deployments -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
    echo "Checking logs for deployment: $deployment"
    kubectl logs -l app=$deployment -n $NAMESPACE --tail=10 || echo "No logs found for $deployment or error retrieving logs"
    echo "---"
done

echo ""
echo "Testing backend API connectivity..."
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app=backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null || echo "")
if [ -n "$BACKEND_POD" ]; then
    echo "Backend pod found: $BACKEND_POD"
    kubectl exec -it $BACKEND_POD -n $NAMESPACE -- curl -s localhost:8000/health || echo "Health check failed or curl not available in pod"
else
    echo "No backend pod found, skipping health check"
fi

echo ""
echo "Checking Kafka Dapr component status..."
kubectl get components.dapr.io -n $NAMESPACE

echo ""
echo "Deployment verification complete!"
echo ""
echo "To test frontend access via LoadBalancer IP:"
echo "kubectl get svc -n $NAMESPACE | grep LoadBalancer"
echo ""
echo "To check all resources:"
echo "kubectl get all -n $NAMESPACE"