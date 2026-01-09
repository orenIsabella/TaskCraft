import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
def test_app_startup_and_health(client: TestClient):
    """Test that the application starts and health check works"""
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.integration
def test_cors_headers(client: TestClient):
    """Verify CORS middleware is configured correctly"""
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        }
    )

    assert "access-control-allow-origin" in response.headers


@pytest.mark.integration
def test_multiple_endpoint_calls(client: TestClient):
    """Test making multiple API calls in sequence"""
    health_response = client.get("/api/health")
    items_response = client.get("/api/items")

    assert health_response.status_code == 200
    assert items_response.status_code == 200

    assert health_response.json()["status"] == "ok"
    assert "items" in items_response.json()


@pytest.mark.integration
def test_invalid_endpoint_returns_404(client: TestClient):
    """Verify non-existent endpoints return 404"""
    response = client.get("/api/nonexistent")

    assert response.status_code == 404
