from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import logging

router = APIRouter(prefix="/api/settings", tags=["settings"])
logger = logging.getLogger(__name__)

class SettingsResponse(BaseModel):
    ai_context: Optional[str] = None
    auto_sync: bool = True
    usage_analytics: bool = True


class SettingsUpdate(BaseModel):
    ai_context: Optional[str] = None
    auto_sync: Optional[bool] = None
    usage_analytics: Optional[bool] = None


@router.get("", response_model=SettingsResponse)
async def get_settings():
    logger.debug("Fetching user settings - return a stub")
    """Fetch user settings. Returns a stub for now."""
    return SettingsResponse(
        ai_context="",
        auto_sync=True,
        usage_analytics=True
    )


@router.patch("", response_model=SettingsResponse)
async def update_settings(settings: SettingsUpdate):
    """Update user settings. Does nothing for now, just returns the current stub."""
    logger.debug("Updating user settings with request %s" % str(settings))
    return SettingsResponse(
        ai_context=settings.ai_context or "",
        auto_sync=settings.auto_sync if settings.auto_sync is not None else True,
        usage_analytics=settings.usage_analytics if settings.usage_analytics is not None else True
    )
