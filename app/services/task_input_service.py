from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task_input import TaskInput


async def save_task_input(
        db: AsyncSession,
        source: str,
        original_text: str,
        extracted_event: dict,
        telegram_chat_id: str | None = None,
        telegram_message_id: str | None = None,
) -> TaskInput:

    task_input = TaskInput(
        source=source,
        original_text=original_text,
        extracted_event=extracted_event,
        telegram_chat_id=telegram_chat_id,
        telegram_message_id=telegram_message_id,
    )

    db.add(task_input)

    await db.commit()
    await db.refresh(task_input)

    return task_input