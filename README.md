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

## Testing

### Setup
Install development dependencies:
```bash
uv sync --extra dev
```

### Running Tests

Run all tests:
```bash
uv run pytest
```

Run only unit tests:
```bash
uv run pytest -m unit
```

Run only integration tests:
```bash
uv run pytest -m integration
```

Run tests with verbose output:
```bash
uv run pytest -v
```

Run tests without coverage:
```bash
uv run pytest --no-cov
```

### Test Structure

- `tests/unit/` - Fast, isolated unit tests
- `tests/integration/` - Full application flow tests
- `tests/conftest.py` - Shared fixtures and configuration

### Coverage

Tests automatically generate coverage reports. View the HTML report:
```bash
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
```

### Docker Sanity Checks

Test the full Docker stack (app + database):
```bash
./test-docker.sh
```

This script:
- Builds the Docker containers
- Starts the application and PostgreSQL
- Waits for services to be ready
- Sanity checks API endpoints with curl
- Cleans up automatically

**Note:** Requires `jq` for JSON formatting. Install with `apt install jq` (Linux) or `brew install jq` (macOS).