from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import os
from datetime import datetime
from sqlmodel import SQLModel, Field, select
from sqlmodel.ext.asyncio.session import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import async_sessionmaker
import json
from dapr.ext.fastapi import DaprApp
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import the AuditLog model
from models import AuditLog, AuditLogCreate, engine

app = FastAPI(title="Audit Service")

# Initialize Dapr extension
dapr_app = DaprApp(app)

# Global session maker
sessionmaker = None

class TaskEventData(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskEvent(BaseModel):
    event_id: str
    event_type: str  # created, updated, completed, deleted
    timestamp: str
    user_id: str
    task_id: int
    task_data: TaskEventData

class HealthResponse(BaseModel):
    status: str
    timestamp: str

from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import async_sessionmaker

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    global sessionmaker

    # Startup: Create tables and sessionmaker
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    sessionmaker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    logger.info("Audit service started and database initialized")

    yield  # This is where the application runs

    # Shutdown: Cleanup if needed
    logger.info("Audit service shutting down")

app.router.lifespan_context = lifespan

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", timestamp=datetime.utcnow().isoformat())

@app.get("/dapr/subscribe")
def subscribe():
    """Dapr subscription configuration"""
    return [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "task-events",
            "route": "/task-events"
        }
    ]

from dead_letter_queue import DeadLetterQueue

@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
async def handle_task_events(event_data: Dict[str, Any]):
    """Handle incoming task events from Kafka via Dapr"""
    try:
        logger.info(f"Received event: {event_data}")

        # Create TaskEvent object from the received data
        task_event = TaskEvent(**event_data)

        # Create audit log entry
        audit_log = AuditLog(
            event_id=task_event.event_id,
            event_type=task_event.event_type,
            user_id=task_event.user_id,
            task_id=task_event.task_id,
            event_data=task_event.task_data.dict(),
            timestamp=datetime.fromisoformat(task_event.timestamp.replace('Z', '+00:00'))
        )

        # Save to database
        async with sessionmaker() as session:
            # Check for duplicate event_id to ensure idempotency
            existing_log = await session.exec(
                select(AuditLog).where(AuditLog.event_id == audit_log.event_id)
            )
            existing = existing_log.first()

            if existing:
                logger.info(f"Duplicate event detected with ID: {audit_log.event_id}. Skipping.")
                return {"status": "duplicate", "message": "Event already processed"}

            session.add(audit_log)
            await session.commit()
            logger.info(f"Successfully saved audit log for event: {task_event.event_id}")

        return {"status": "success", "message": "Event processed successfully"}

    except Exception as e:
        logger.error(f"Error processing event: {str(e)}")

        # Store the failed event in the dead letter queue
        try:
            async with sessionmaker() as session:
                dlq_entry = DeadLetterQueue(
                    event_id=event_data.get('event_id', ''),
                    event_type=event_data.get('event_type', ''),
                    user_id=event_data.get('user_id', ''),
                    task_id=event_data.get('task_id', 0),
                    event_data=event_data.get('task_data', {}),
                    error_message=str(e),
                    retry_count=0
                )

                session.add(dlq_entry)
                await session.commit()
                logger.info(f"Stored failed event in dead letter queue: {event_data.get('event_id')}")
        except Exception as dlq_error:
            logger.error(f"Failed to store event in dead letter queue: {dlq_error}")

        # Return success to acknowledge the message and avoid retries by Dapr
        # In a production system, you might want to handle this differently
        return {"status": "failed", "message": f"Event processing failed: {str(e)}"}

@app.get("/api/{user_id}/audit")
async def get_audit_trail(user_id: str, event_type: Optional[str] = None, limit: int = 50, offset: int = 0):
    """Get audit trail for a specific user"""
    try:
        async with sessionmaker() as session:
            query = select(AuditLog).where(AuditLog.user_id == user_id)

            if event_type:
                query = query.where(AuditLog.event_type == event_type)

            # Order by timestamp descending (newest first)
            query = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit)

            result = await session.exec(query)
            audit_logs = result.all()

            return {
                "events": [
                    {
                        "id": log.id,
                        "event_id": log.event_id,
                        "event_type": log.event_type,
                        "user_id": log.user_id,
                        "task_id": log.task_id,
                        "event_data": log.event_data,
                        "timestamp": log.timestamp.isoformat()
                    }
                    for log in audit_logs
                ]
            }
    except Exception as e:
        logger.error(f"Error retrieving audit trail: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving audit trail: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)