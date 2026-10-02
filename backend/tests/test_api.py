from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.api.dependencies import get_db
from app.database.database import Base
from app.database import models

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        # Seed basic demo data required for tests
        if not db.query(models.Location).first():
            db.add(models.Location(state="Gujarat", district="Ahmedabad", block="Daskroi", village="Jetalpur", latitude=0, longitude=0))
            db.add(models.Crop(name="Cotton"))
            db.commit()
            crop = db.query(models.Crop).first()
            db.add(models.CropStage(crop_id=crop.id, name="Germination"))
            db.commit()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert "database" in response.json()

def test_get_locations():
    response = client.get("/api/locations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    assert response.json()[0]["village"] == "Jetalpur"

def test_get_risk():
    response = client.get("/api/risk/1/crop/Cotton")
    assert response.status_code == 200
    data = response.json()
    assert "sowing" in data
    assert "false_onset" in data
    assert "onset" in data
    assert data["location"]["village"] == "Jetalpur"

