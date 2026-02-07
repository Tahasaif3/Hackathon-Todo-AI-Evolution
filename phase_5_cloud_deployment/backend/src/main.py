from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings

from .routers import auth, tasks, projects, chat

app = FastAPI(
    title="Task API",
    description="Task management API with authentication",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(projects.router)
app.include_router(chat.router)

# Prepare allowed origins from settings.FRONTEND_URL (comma separated)
_frontend_origins = [o.strip() for o in settings.FRONTEND_URL.split(",")] if settings.FRONTEND_URL else []

# CORS configuration (development and production)
# Include common development URLs and Minikube/K8s service URLs
allowed_origins = _frontend_origins + [
    # Local development (all common ports)
    "http://localhost:3000", "http://localhost:3001", "http://localhost:8000",
    "http://localhost:38905", "http://localhost:40529",  # User's dynamic ports
    "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:8000",
    "http://127.0.0.1:38905", "http://127.0.0.1:40529",  # User's dynamic ports
    # Minikube NodePort (replace with your Minikube IP in production)
    "http://192.168.49.2:30080", "http://192.168.49.2:30081",
    "http://192.168.49.2:30147", "http://192.168.49.2:30148",
    # Kubernetes internal service names (for cluster-internal communication)
    "http://todo-chatbot-backend:8000",
    "http://todo-chatbot-frontend:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose origin header for debugging if needed
    expose_headers=["Access-Control-Allow-Origin"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)