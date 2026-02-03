import pytest
from fastapi.testclient import TestClient


@pytest.mark.unit
def test_health_endpoint(client: TestClient):
    """Test the health check endpoint returns 200 OK"""
    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"  # Mock returns successful connection


@pytest.mark.unit
def test_health_endpoint_response_structure(client: TestClient):
    """Verify health endpoint returns expected JSON structure"""
    response = client.get("/api/health")
    data = response.json()

    assert "status" in data
    assert isinstance(data["status"], str)
