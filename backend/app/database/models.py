from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime, func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    block = Column(String(100), nullable=False)
    village = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

class RainfallRecord(Base):
    __tablename__ = "rainfall_records"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    date = Column(Date, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    temperature = Column(Float)
    humidity = Column(Float)
    
class ClimateIndex(Base):
    __tablename__ = "climate_indices"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    nino34 = Column(Float)
    dmi = Column(Float)
    mjo_phase = Column(Integer)
    mjo_amplitude = Column(Float)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    timestamp = Column(DateTime, default=func.now())
    onset_probability = Column(Float)
    persistence_probability = Column(Float)
    dry_spell_7_probability = Column(Float)
    dry_spell_14_probability = Column(Float)
    heavy_rain_probability = Column(Float)
    sowing_risk = Column(String(50))
    confidence = Column(String(50))
    forecast_horizon = Column(Integer)

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

class CropStage(Base):
    __tablename__ = "crop_stages"
    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    name = Column(String(100), nullable=False)

class Advisory(Base):
    __tablename__ = "advisories"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    stage_id = Column(Integer, ForeignKey("crop_stages.id"))
    risk_level = Column(String(50))
    message = Column(String)
