import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
def client(mocker):
    """Test client for making requests to the FastAPI app with mocked database"""
    # Mock the database session to avoid real connections during unit tests
    mock_session = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar.return_value = 1
    mock_session.execute = AsyncMock(return_value=mock_result)

    mock_session_context = MagicMock()
    mock_session_context.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session_context.__aexit__ = AsyncMock(return_value=None)

    # Patch AsyncSessionLocal to return our mock
    mocker.patch('app.database.AsyncSessionLocal', return_value=mock_session_context)

    from app.main import app
    return TestClient(app)
