#!/bin/bash
# Script to set up local Kubernetes cluster for Todo AI application

echo "Setting up local Kubernetes cluster for Todo AI..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if minikube is installed
if command -v minikube &> /dev/null; then
    echo "Starting Minikube cluster..."
    minikube start
    minikube addons enable ingress
elif command -v kind &> /dev/null; then
    echo "Creating Kind cluster..."
    kind create cluster
    # Install ingress controller for Kind
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
else
    echo "Neither Minikube nor Kind is installed. Please install either one first."
    exit 1
fi

echo "Kubernetes cluster is ready!"