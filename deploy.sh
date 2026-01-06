#!/bin/bash
set -e

echo "=== Deploying ==="

git pull

echo "Building containers..."
docker compose build

echo "Restarting services..."
docker compose down
docker compose up -d

echo "Waiting for database..."
sleep 5

echo "Running migrations..."
docker compose exec -T app uv run alembic upgrade head

echo "=== Deployment complete ==="
docker compose ps