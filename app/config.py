import os
from typing import Optional

class Settings:
    """Application configuration"""

    # Database
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "dev")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "dev")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "myapp_dev")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # OpenRouter
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_APP_TITLE: str = os.getenv("OPENROUTER_APP_TITLE", "TaskCraft")
    OPENROUTER_APP_REFERER: str = os.getenv("OPENROUTER_APP_REFERER", "TaskCraft")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-haiku")

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"


settings = Settings()
