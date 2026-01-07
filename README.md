# TaskCraft

## Development Flow

#### Starting Directly
```
uv run uvicorn app.main:app --reload
```

#### Frontend Development
Serve the frontend with SPA routing support:
```
npx serve -p 8080 -s frontend
```
The `-s` flag enables single-page app mode, allowing client-side routing to work correctly.

#### Using Docker Compose

To start all services:
```
docker compose -f docker-compose.dev.yml up
```

- Code changes auto-reload via `--reload` flag
- Frontend: just edit files, refresh browser

#### Database migrations
```
docker compose -f docker-compose.dev.yml exec app uv run alembic revision --autogenerate -m "description"
docker compose -f docker-compose.dev.yml exec app uv run alembic upgrade head
```

#### Access database directly
docker compose -f docker-compose.dev.yml exec db psql -U dev -d myapp_dev

#### Tear down
docker compose -f docker-compose.dev.yml down