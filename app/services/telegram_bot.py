import os
import logging

from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters
from app.services.event_extractor import extract_event_from_text
from app.services.openrouter_client import OpenRouterError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal
from app.services.task_input_service import save_task_input

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "Hi! Send me a task and I’ll turn it into a TaskCraft event draft."
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message_text = update.message.text
    timezone = "Asia/Jerusalem"

    await update.message.reply_text("Processing task... ⏳")

    try:
        event = await extract_event_from_text(message_text, timezone)

        async with AsyncSessionLocal() as db:
            await save_task_input(
            db=db,
            source="telegram",
            original_text=message_text,
            extracted_event=event,
            telegram_chat_id=str(update.effective_chat.id),
            telegram_message_id=str(update.message.message_id),
        )
        response = f"""
✅ Event Draft Created

📌 Title: {event["title"]}
🕒 Start: {event["start_at"]}
🕔 End: {event["end_at"]}
📅 All day: {event["all_day"]}
🎯 Confidence: {event["confidence"]}

📝 Notes:
{event["notes"]}
""".strip()

        if event["missing_info"]:
            response += "\n\n❓ Missing info:\n" + "\n".join(
                f"- {item}" for item in event["missing_info"]
            )

        await update.message.reply_text(response)

    except OpenRouterError as e:
        await update.message.reply_text(f"❌ OpenRouter failed:\n{str(e)}")

    except Exception as e:
        await update.message.reply_text(f"❌ Something went wrong:\n{str(e)}")

def run_bot() -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")

    if not token:
        raise RuntimeError("Missing TELEGRAM_BOT_TOKEN in .env")

    app = ApplicationBuilder().token(token).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Starting Telegram bot with polling...")
    app.run_polling()


if __name__ == "__main__":
    run_bot()