from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.database import models
from app.schemas.predict import PredictRequest
from app.api.routes.risk import _generate_risk_response

router = APIRouter()

@router.post("/predict")
def predict(request: PredictRequest, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == request.location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    crop_record = db.query(models.Crop).filter(models.Crop.name.ilike(request.crop)).first()
    if not crop_record:
        raise HTTPException(status_code=400, detail="Invalid crop")
        
    stage_record = db.query(models.CropStage).filter(
        models.CropStage.crop_id == crop_record.id,
        models.CropStage.name.ilike(request.growth_stage)
    ).first()
    if not stage_record:
        raise HTTPException(status_code=400, detail="Invalid growth stage")
        
    return _generate_risk_response(location, crop_record.name)
