from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db
from app.database import models
from app.schemas.rainfall import RainfallRecord

router = APIRouter()

@router.get("/rainfall/{location_id}", response_model=List[RainfallRecord])
def get_rainfall(location_id: int, db: Session = Depends(get_db)):
    records = db.query(models.RainfallRecord).filter(models.RainfallRecord.location_id == location_id).all()
    # For demo mode fallback if no data
    if not records:
        return []
    return records
