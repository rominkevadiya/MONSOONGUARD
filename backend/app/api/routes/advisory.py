from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.database import models
from app.schemas.advisory import Advisory
from app.schemas.predict import AdvisoryRequest
from app.rules import risk_engine

router = APIRouter()

def _generate_advisory(location: models.Location, crop_record: models.Crop, stage_record: models.CropStage):
    onset = risk_engine.calculate_onset_probability(location.id)
    persistence = risk_engine.calculate_persistence_probability(location.id, onset)
    dry_spell_7 = risk_engine.calculate_7_day_dry_spell_probability(location.id)
    heavy_rain = risk_engine.calculate_heavy_rain_probability(location.id)
    
    sowing_risk = risk_engine.calculate_sowing_risk(persistence, dry_spell_7, heavy_rain, crop_record.name)
    
    return {
        "crop": crop_record.name,
        "stage": stage_record.name,
        "location_id": location.id,
        "risk_level": sowing_risk,
        "before_sowing": [
            "Monitor persistence confirmation over the next 48 hours.",
            "Avoid immediate sowing if rainfall breaks or shows signs of weakening.",
            f"Check official local agricultural advisory for {location.district} district."
        ],
        "after_initial_rain": [
            f"Monitor rainfall continuity to ensure soil moisture reaches required depth for {crop_record.name}.",
            "Monitor dry-break probability carefully if sowing has already occurred."
        ],
        "during_crop_growth": [
            "Track localized rainfall risk via the dashboard on a weekly basis.",
            "Re-evaluate risk after significant weather events or prolonged dry spells."
        ]
    }

@router.get("/advisory/{location_id}/{crop}/{stage}", response_model=Advisory)
def get_advisory(location_id: int, crop: str, stage: str, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    crop_record = db.query(models.Crop).filter(models.Crop.name.ilike(crop)).first()
    if not crop_record:
        raise HTTPException(status_code=400, detail="Invalid crop")
        
    stage_record = db.query(models.CropStage).filter(
        models.CropStage.crop_id == crop_record.id,
        models.CropStage.name.ilike(stage)
    ).first()
    
    if not stage_record:
        raise HTTPException(status_code=400, detail="Invalid growth stage for crop")
        
    return _generate_advisory(location, crop_record, stage_record)

@router.post("/advisory", response_model=Advisory)
def post_advisory(request: AdvisoryRequest, db: Session = Depends(get_db)):
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
        raise HTTPException(status_code=400, detail="Invalid growth stage for crop")
        
    return _generate_advisory(location, crop_record, stage_record)
