FROM python:3.12-slim-trixie

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.9.22 /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml .
COPY uv.lock .

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy application
COPY ./app ./app

# Run with uvicorn
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]