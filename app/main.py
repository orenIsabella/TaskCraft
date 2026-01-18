from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# CORS if needed during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok"}

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
    logger.info("Creating task from text: %s", payload.text)
    try:
        event_dict = await extract_event_from_text(payload.text, payload.timezone)
    except OpenRouterError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return TaskCreateResponse(
        raw_text=payload.text,
        event=EventDraft(**event_dict),
    )

