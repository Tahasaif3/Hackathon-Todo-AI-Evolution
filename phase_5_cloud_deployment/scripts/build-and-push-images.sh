#!/bin/bash

set -e  # Exit on any error

echo "Building and pushing Docker images for cloud deployment..."

# Check if required tools are installed
if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v doctl &> /dev/null; then
    echo "Warning: doctl is not installed. If using DigitalOcean Container Registry, please install doctl."
fi

# Configuration
REGISTRY=${DOCKER_REGISTRY:-""}  # Leave empty to use DOCR or specify Docker Hub
IMAGE_TAG=${IMAGE_TAG:-"latest"}
BUILD_PLATFORM=${BUILD_PLATFORM:-"linux/amd64"}

# If using DigitalOcean Container Registry, authenticate first
if [[ "$REGISTRY" == *"registry.digitalocean.com"* ]]; then
    echo "Authenticating with DigitalOcean Container Registry..."
    doctl registry login
fi

# Function to build and push image
build_and_push() {
    local service_name=$1
    local context_dir=$2
    local dockerfile_path=$3

    echo "Building ${service_name}..."

    if [ -n "$dockerfile_path" ]; then
        docker build --platform $BUILD_PLATFORM -t "${REGISTRY}${service_name}:${IMAGE_TAG}" -f "${dockerfile_path}" "${context_dir}"
    else
        docker build --platform $BUILD_PLATFORM -t "${REGISTRY}${service_name}:${IMAGE_TAG}" "${context_dir}"
    fi

    echo "Pushing ${service_name} to registry..."
    docker push "${REGISTRY}${service_name}:${IMAGE_TAG}"

    echo "${service_name} image built and pushed successfully!"
}

# Build and push frontend
echo "=== Building Frontend ==="
build_and_push "todo-frontend" "./frontend" ""

# Build and push backend
echo "=== Building Backend ==="
build_and_push "todo-backend" "./backend" ""

# Build and push audit service
echo "=== Building Audit Service ==="
build_and_push "audit-service" "./services/audit-service" ""

# Build and push notification service
echo "=== Building Notification Service ==="
build_and_push "notification-service" "./services/notification-service" ""

echo ""
echo "All images built and pushed successfully!"
echo ""
echo "Images pushed:"
echo "- ${REGISTRY}todo-frontend:${IMAGE_TAG}"
echo "- ${REGISTRY}todo-backend:${IMAGE_TAG}"
echo "- ${REGISTRY}audit-service:${IMAGE_TAG}"
echo "- ${REGISTRY}notification-service:${IMAGE_TAG}"
echo ""
echo "Next steps:"
echo "1. Update values-prod.yaml with the correct image repository paths"
echo "2. Deploy using Helm: helm upgrade --install todo-platform-prod ./charts/todo-platform --namespace todo-prod --create-namespace --values ./values-prod.yaml"