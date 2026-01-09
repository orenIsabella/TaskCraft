# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskCraft is a Python FastAPI backend with a vanilla JavaScript frontend. Uses uv for package management and Docker Compose for development.

## Development Commands

### Running Locally
```bash
uv run uvicorn app.main:app --reload
```

### Docker Development
```bash
# Start all services (app + PostgreSQL)
docker compose -f docker-compose.dev.yml up

# Stop services
docker compose -f docker-compose.dev.yml down
```

### Database
```bash
# Create migration
docker compose -f docker-compose.dev.yml exec app uv run alembic revision --autogenerate -m "description"

# Apply migrations
docker compose -f docker-compose.dev.yml exec app uv run alembic upgrade head

# Direct database access
docker compose -f docker-compose.dev.yml exec db psql -U dev -d myapp_dev
```

### Deployment
```bash
./deploy.sh  # Pulls latest, rebuilds containers, runs migrations
```

## Architecture

- **Backend**: FastAPI app in `app/` with entry point at `app/main.py`
- **Frontend**: Static HTML/JS in `frontend/`, served by Nginx in production
- **Database**: PostgreSQL 18, migrations via Alembic
- **Nginx**: Reverse proxy config in `config/nginx.conf` - routes `/api` to backend, serves static files from `frontend/`

## Tech Stack

- Python 3.10+ with FastAPI
- uv for dependency management
- PostgreSQL 18
- Docker/Docker Compose
- Nginx for production serving
