# Multi-stage Dockerfile for FastAPI backend
# Stage 1: Builder - Install dependencies and prepare the application
FROM python:3.13-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install UV for fast dependency management
RUN pip install --no-cache-dir uv

# Copy pyproject.toml first for better layer caching
COPY pyproject.toml uv.lock* ./

# Create virtual environment and install dependencies
# Note: UV_SYSTEM_PYTHON=0 ensures packages are installed to venv, not system
ENV UV_SYSTEM_PYTHON=0
RUN uv venv /app/.venv && \
    . /app/.venv/bin/activate && \
    uv pip install -r pyproject.toml

# Copy the rest of the application
COPY . .

# Stage 2: Runner - Production-ready image
FROM python:3.13-slim AS runner

# Create non-root user for security
RUN groupadd --system --gid 1001 appgroup && \
    useradd --system --uid 1001 --gid appgroup --shell /bin/false --create-home appuser

# Set working directory
WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY --from=builder /app/src /app/src
COPY --from=builder /app/pyproject.toml /app/pyproject.toml

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set ownership
RUN chown -R appuser:appgroup /app

# Use non-root user
USER appuser

# Expose the application port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Start the application using explicit path to uvicorn
CMD ["/app/.venv/bin/uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
