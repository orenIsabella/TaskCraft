from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine

logger = logging.getLogger(__name__)

# Configure logging level from environment variable
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(module)s:%(funcName)s:%(lineno)d - %(message)s"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    logger.info("Starting up application...")
    logger.info(f"Database URL: {settings.DATABASE_URL.split('@')[1]}")  # Log DB host (not credentials)
    yield
    logger.info("Shutting down application...")
    await engine.dispose()


app = FastAPI(lifespan=lifespan)


# CORS if needed during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    """Health check endpoint with database connectivity test"""
    from sqlalchemy import text
    from app.database import AsyncSessionLocal

    db_status = "unknown"
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            result.scalar()
            db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "disconnected"

    return {
        "status": "ok",
        "database": db_status
    }

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.services.event_extractor import extract_event_from_text
from fastapi import HTTPException
from app.services.openrouter_client import OpenRouterError

class TaskCreateRequest(BaseModel):
    text: str = Field(..., min_length=1)
    email: Optional[str] = None
    timezone: str = "Asia/Jerusalem"

class EventDraft(BaseModel):
    title: str
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    notes: str = ""
    missing_info: List[str] = []

class TaskCreateResponse(BaseModel):
    raw_text: str
    event: EventDraft

@app.post("/api/tasks", response_model=TaskCreateResponse)
async def create_task(payload: TaskCreateRequest):
    logger.info("Creating task from text: %s" % payload.text)
    try:
        event_dict = await extract_event_from_text(payload.text, payload.timezone)
    except OpenRouterError as e:
        logger.error('Failed to send OpenRouter request: %s' % str(e))
        raise HTTPException(status_code=503, detail=str(e))

    logger.info("Response: %s" % str(event_dict))
    return TaskCreateResponse(
        raw_text=payload.text,
        event=EventDraft(**event_dict),
    )

