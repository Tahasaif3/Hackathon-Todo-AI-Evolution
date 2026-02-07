from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
import logging
from dapr.ext.fastapi import DaprApp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Notification Service")

# Initialize Dapr extension
dapr_app = DaprApp(app)

class TaskEventData(BaseModel):
    title: str
    description: str = None
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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/dapr/subscribe")
def subscribe():
    """Dapr subscription configuration"""
    return [
        {
            "pubsubname": "kafka-pubsub",
            "topic": "task-events",
            "route": "/notification-events"
        }
    ]

@dapr_app.subscribe(pubsub='kafka-pubsub', topic='task-events')
async def handle_notification_events(event_data: Dict[str, Any]):
    """Handle incoming task events from Kafka via Dapr for notifications"""
    try:
        logger.info(f"Received notification event: {event_data}")

        # Process the event data to generate notifications
        task_event = TaskEvent(**event_data)

        # Generate notification based on event type
        notification_message = generate_notification_message(task_event)

        # In a real implementation, you would send the notification via email,
        # push notification, or other channels
        logger.info(f"Generated notification for user {task_event.user_id}: {notification_message}")

        # For now, just log the notification
        # In a real system, you'd send emails, push notifications, etc.

        return {"status": "success", "message": "Notification processed successfully"}

    except Exception as e:
        logger.error(f"Error processing notification event: {str(e)}")
        return {"status": "error", "message": f"Error processing notification: {str(e)}"}

def generate_notification_message(task_event: TaskEvent) -> str:
    """Generate appropriate notification message based on event type"""
    if task_event.event_type == "created":
        return f"A new task '{task_event.task_data.title}' has been created."
    elif task_event.event_type == "updated":
        return f"Task '{task_event.task_data.title}' has been updated."
    elif task_event.event_type == "completed":
        return f"Task '{task_event.task_data.title}' has been completed!"
    elif task_event.event_type == "deleted":
        return f"Task '{task_event.task_data.title}' has been deleted."
    else:
        return f"Task '{task_event.task_data.title}' has been {task_event.event_type}."

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)