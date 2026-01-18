import os
from datetime import datetime, timezone
from typing import Any, Dict

from app.services.openrouter_client import openrouter_chat_completion, OpenRouterError

EVENT_JSON_SCHEMA: Dict[str, Any] = {
    "name": "task_event",
    "strict": True,
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "title": {"type": "string", "minLength": 1},
            "start_at": {"type": ["string", "null"], "description": "ISO 8601 with timezone"},
            "end_at": {"type": ["string", "null"], "description": "ISO 8601 with timezone"},
            "all_day": {"type": "boolean"},
            "notes": {"type": "string"},
            "missing_info": {
                "type": "array",
                "items": {"type": "string"},
            },
            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        },
        "required": ["title", "start_at", "end_at", "all_day", "notes", "missing_info", "confidence"],
    },
}

def _iso_now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()

async def extract_event_from_text(text: str, user_timezone: str) -> dict:
    model = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet")  # placeholder

    system = (
        "You convert a user's task text into a calendar event object.\n"
        "Return ONLY the JSON that matches the provided schema.\n"
        "If the text is missing date/time, put start_at/end_at as null and list required fields in missing_info.\n"
        "Assume the user's timezone when interpreting relative times.\n"
    )

    user = (
        f"User timezone: {user_timezone}\n"
        f"Current time (UTC): {_iso_now_utc()}\n"
        f"Task text: {text}\n"
    )

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        # Structured outputs: json_schema with strict mode
        "response_format": {
            "type": "json_schema",
            "json_schema": EVENT_JSON_SCHEMA,
        },
    }

    data = await openrouter_chat_completion(payload)

    # OpenRouter returns OpenAI-style payload; content is usually string JSON
    try:
        content = data["choices"][0]["message"]["content"]
    except Exception as e:
        raise OpenRouterError(f"Unexpected OpenRouter response shape: {e}; data={data}")

    # If structured outputs works, content should already be JSON (string). Parse it:
    import json
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise OpenRouterError(f"Model did not return valid JSON: {e}. Raw content: {content}")
