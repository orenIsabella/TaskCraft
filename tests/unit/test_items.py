import pytest
from fastapi.testclient import TestClient


@pytest.mark.unit
def test_get_items_endpoint(client: TestClient):
    """Test the items endpoint returns 200 OK"""
    response = client.get("/api/items")

    assert response.status_code == 200
    assert "items" in response.json()


@pytest.mark.unit
def test_get_items_returns_list(client: TestClient):
    """Verify items endpoint returns a list"""
    response = client.get("/api/items")
    data = response.json()

    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0


@pytest.mark.unit
def test_get_items_contains_apple(client: TestClient):
    """Verify items list contains expected item"""
    response = client.get("/api/items")
    data = response.json()

    assert "apple" in data["items"]
