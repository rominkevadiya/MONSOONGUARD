from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db
from app.database import models
from app.schemas.location import Location

router = APIRouter()

@router.get("/locations", response_model=List[Location])
def get_locations(db: Session = Depends(get_db)):
    return db.query(models.Location).all()

@router.get("/locations/{location_id}", response_model=Location)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location
