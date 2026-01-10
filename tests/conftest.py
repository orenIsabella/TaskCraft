import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Test client for making requests to the FastAPI app"""
    return TestClient(app)


@pytest.fixture
def sample_items():
    """Sample data for testing"""
    return ["apple", "banana", "orange"]
