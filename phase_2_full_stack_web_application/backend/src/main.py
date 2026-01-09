from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings

from .routers import auth, tasks, projects

app = FastAPI(
    title="Task API",
    description="Task management API with authentication",
    version="1.0.0"
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(projects.router)

# Prepare allowed origins from settings.FRONTEND_URL (comma separated)
_frontend_origins = [o.strip() for o in settings.FRONTEND_URL.split(",")] if settings.FRONTEND_URL else []

# CORS configuration (development and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_frontend_origins or ["http://localhost:3000"],
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