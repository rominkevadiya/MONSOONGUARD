import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.config import settings
from app.api.dependencies import get_db
from sqlalchemy.exc import OperationalError

# Try connecting to PostgreSQL
try:
    engine = create_engine(settings.DATABASE_URL)
    engine.connect()
    POSTGRES_AVAILABLE = True
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except OperationalError:
    POSTGRES_AVAILABLE = False

@pytest.mark.skipif(not POSTGRES_AVAILABLE, reason="PostgreSQL is not available for integration testing.")
def test_postgres_integration_health():
    client = TestClient(app)
    
    # We remove the get_db override if one exists from other tests
    if get_db in app.dependency_overrides:
        del app.dependency_overrides[get_db]
        
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["database"] == "connected"

@pytest.mark.skipif(not POSTGRES_AVAILABLE, reason="PostgreSQL is not available for integration testing.")
def test_postgres_integration_locations():
    client = TestClient(app)
    
    if get_db in app.dependency_overrides:
        del app.dependency_overrides[get_db]
        
    response = client.get("/api/locations")
    assert response.status_code == 200
    # If seeded, it should have 10 locations
    assert isinstance(response.json(), list)
