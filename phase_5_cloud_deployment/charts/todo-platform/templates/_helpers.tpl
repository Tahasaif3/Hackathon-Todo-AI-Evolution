{{/*
Expand the name of the chart.
*/}}
{{- define "todo-platform.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "todo-platform.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "todo-platform.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "todo-platform.labels" -}}
helm.sh/chart: {{ include "todo-platform.chart" . }}
{{ include "todo-platform.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "todo-platform.selectorLabels" -}}
app.kubernetes.io/name: {{ include "todo-platform.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "todo-platform.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "todo-platform.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Backend fullname helper
*/}}
{{- define "todo-platform.backend.fullname" -}}
{{- printf "%s-backend" (include "todo-platform.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Audit service fullname helper
*/}}
{{- define "todo-platform.auditService.fullname" -}}
{{- printf "%s-audit-service" (include "todo-platform.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Notification service fullname helper
*/}}
{{- define "todo-platform.notificationService.fullname" -}}
{{- printf "%s-notification-service" (include "todo-platform.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}