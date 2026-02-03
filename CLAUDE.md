# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskCraft is a Python FastAPI backend with a SolidJS + TypeScript frontend. Uses uv for Python package management and npm for frontend. Docker Compose for development.

## Development Commands

### Running Locally

Backend:
```bash
uv run uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

### Docker Development

**Important**: Set environment variables via `.env.dev` file (gitignored). Copy from `.env.example` and fill in your values.

```bash
# Start all services (app + PostgreSQL)
docker compose -f docker-compose.dev.yml --env-file .env.dev up

# Stop services
docker compose -f docker-compose.dev.yml --env-file .env.dev down
```

### Database
```bash
# Create migration
docker compose -f docker-compose.dev.yml --env-file .env.dev exec app uv run alembic revision --autogenerate -m "description"

# Apply migrations
docker compose -f docker-compose.dev.yml --env-file .env.dev exec app uv run alembic upgrade head

# Direct database access (use credentials from your .env.dev)
docker compose -f docker-compose.dev.yml --env-file .env.dev exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

## Architecture

- **Backend**: FastAPI app in `app/` with entry point at `app/main.py`
- **Frontend**: SolidJS + TypeScript app in `frontend/src/`, built with Vite
- **Database**: PostgreSQL 18, migrations via Alembic
- **Nginx**: Reverse proxy config in `config/nginx.conf` - routes `/api` to backend, serves static files from `frontend/`

## Tech Stack

- Python 3.10+ with FastAPI
- uv for Python dependency management
- SolidJS with Solid Router for frontend
- TypeScript for type safety
- Vite for frontend build tool
- PostgreSQL 18
- Docker/Docker Compose
- Nginx for production serving
