#!/bin/bash
set -e

# Ensure we're in the repo directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Deploying ==="

git pull

echo "Building containers..."
docker compose build

echo "Restarting services..."
docker compose down
docker compose up -d

echo "Waiting for database to be ready..."
until docker compose exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; do
    echo "  Database not ready, waiting..."
    sleep 2
done
echo "Database is ready"

echo "Running migrations..."
if ! docker compose exec -T app uv run alembic upgrade head; then
    echo "ERROR: Migration failed!"
    echo "The new containers are running but may have incompatible schema."
    echo "Consider rolling back with: git checkout HEAD~1 && ./deploy.sh"
    exit 1
fi

echo "=== Deployment complete ==="
docker compose ps
