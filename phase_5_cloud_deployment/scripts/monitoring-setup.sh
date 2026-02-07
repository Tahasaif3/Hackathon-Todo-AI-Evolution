#!/bin/bash

set -e  # Exit on any error

echo "Setting up monitoring and logging for the event-driven todo system..."

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Create namespace for monitoring
kubectl create namespace monitoring || true

# Install Prometheus and Grafana using kube-prometheus-stack
echo "Installing Prometheus and Grafana..."

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: HelmRepository
metadata:
  name: prometheus-community
  namespace: monitoring
spec:
  interval: 30m
  url: https://prometheus-community.github.io/helm-charts
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: kube-prometheus-stack
  namespace: monitoring
spec:
  interval: 5m
  chart:
    spec:
      chart: kube-prometheus-stack
      version: 54.x.x
      sourceRef:
        kind: HelmRepository
        name: prometheus-community
        namespace: monitoring
  values:
    grafana:
      enabled: true
      adminPassword: prom-operator
      service:
        type: LoadBalancer
      dashboardProviders:
        dashboardproviders.yaml:
          apiVersion: 1
          providers:
          - name: 'default'
            orgId: 1
            folder: ''
            type: file
            disableDeletion: false
            editable: true
            options:
              path: /var/lib/grafana/dashboards/default
      dashboards:
        default:
          dapr-dashboard:
            gnetId: 14689
            revision: 1
            datasource: Prometheus
    prometheus:
      enabled: true
      prometheusSpec:
        serviceMonitorSelectorNilUsesHelmValues: false
        podMonitorSelectorNilUsesHelmValues: false
        retention: 10d
        storageSpec:
          volumeClaimTemplate:
            spec:
              storageClassName: standard
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
    alertmanager:
      enabled: true
      alertmanagerSpec:
        storage:
          volumeClaimTemplate:
            spec:
              storageClassName: standard
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 10Gi
EOF

# Install Loki for centralized logging
echo "Installing Loki for centralized logging..."

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: loki
---
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: HelmRepository
metadata:
  name: grafana
  namespace: loki
spec:
  interval: 30m
  url: https://grafana.github.io/helm-charts
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: loki
  namespace: loki
spec:
  interval: 5m
  chart:
    spec:
      chart: loki-stack
      version: 2.x.x
      sourceRef:
        kind: HelmRepository
        name: grafana
        namespace: loki
  values:
    loki:
      enabled: true
      isDefault: true
    promtail:
      enabled: true
      config:
        clients:
          - url: http://loki.loki.svc.cluster.local:3100/loki/api/v1/push
    grafana:
      enabled: false
EOF

# Create a Dapr observability component
echo "Creating Dapr observability configuration..."

cat << EOF | kubectl apply -f -
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: tracing
  namespace: default
spec:
  type: exporters.jaeger
  version: v1
  metadata:
  - name: enabled
    value: "true"
  - name: exporterType
    value: "jaeger"
  - name: agentEndpoint
    value: "jaeger.default.svc.cluster.local:6831"
EOF

# Install Jaeger for distributed tracing
echo "Installing Jaeger for distributed tracing..."

cat << EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: jaeger
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: jaeger
  labels:
    app: jaeger
spec:
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.46
        env:
        - name: COLLECTOR_OTLP_ENABLED
          value: "true"
        ports:
        - containerPort: 16686
          name: ui
        - containerPort: 4317
          name: grpc
        - containerPort: 4318
          name: http
---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: jaeger
spec:
  selector:
    app: jaeger
  ports:
  - port: 16686
    targetPort: 16686
    name: ui
  - port: 4317
    targetPort: 4317
    name: grpc
  - port: 4318
    targetPort: 4318
    name: http
  type: LoadBalancer
EOF

echo "Monitoring and logging setup complete!"
echo ""
echo "Components installed:"
echo "- Prometheus and Grafana in 'monitoring' namespace"
echo "- Loki for centralized logging in 'loki' namespace"
echo "- Jaeger for distributed tracing in 'jaeger' namespace"
echo ""
echo "Access URLs (after LoadBalancer IPs are assigned):"
echo "- Grafana: http://<GRAFANA-LB-IP>:80 (admin/prom-operator)"
echo "- Jaeger UI: http://<JAEGER-LB-IP>:16686"
echo ""
echo "To check the status of the monitoring stack:"
echo "kubectl get pods -n monitoring"
echo "kubectl get pods -n loki"
echo "kubectl get pods -n jaeger"