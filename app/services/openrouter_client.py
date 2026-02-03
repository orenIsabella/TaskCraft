import os
import httpx

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class OpenRouterError(RuntimeError):
    pass

async def openrouter_chat_completion(payload: dict) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise OpenRouterError("Missing OPENROUTER_API_KEY")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # Optional app identification headers (recommended by OpenRouter)
    app_title = os.getenv("OPENROUTER_APP_TITLE")
    app_referer = os.getenv("OPENROUTER_APP_REFERER")
    if app_title:
        headers["X-Title"] = app_title
    if app_referer:
        headers["HTTP-Referer"] = app_referer

    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(OPENROUTER_URL, headers=headers, json=payload)
        if r.status_code >= 400:
            raise OpenRouterError(f"OpenRouter error {r.status_code}: {r.text}")
        return r.json()
