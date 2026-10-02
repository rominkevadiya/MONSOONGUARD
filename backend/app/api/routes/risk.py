from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.database import models
from app.schemas.risk import RiskResponse
from app.rules import risk_engine

router = APIRouter()

@router.get("/risk/{location_id}", response_model=RiskResponse)
def get_risk(location_id: int, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    return _generate_risk_response(location, "Cotton")

@router.get("/risk/{location_id}/crop/{crop}", response_model=RiskResponse)
def get_risk_by_crop(location_id: int, crop: str, db: Session = Depends(get_db)):
    location = db.query(models.Location).filter(models.Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
        
    # Verify crop exists
    crop_record = db.query(models.Crop).filter(models.Crop.name.ilike(crop)).first()
    if not crop_record:
        raise HTTPException(status_code=400, detail="Invalid crop specified")
        
    return _generate_risk_response(location, crop_record.name)

from app.services.ml_prediction_service import ml_service
from app.core.config import settings

def _generate_risk_response(location: models.Location, crop: str):
    if settings.PREDICTION_MODE == "ml":
        ml_data = ml_service.predict(location.id)
        if ml_data["ml_available"]:
            probs = ml_data["predictions"]
            onset = probs["onset_probability"]
            persistence = probs["persistence_probability"]
            dry_spell_7 = probs["dry_spell_7_probability"]
            dry_spell_14 = probs["dry_spell_14_probability"]
            heavy_rain = probs["heavy_rain_probability"]
            
            prediction_source = ml_data["prediction_source"]
            model_name = ml_data["model_name"]
            model_version = ml_data["model_version"]
        else:
            # Fallback to rule based
            onset = risk_engine.calculate_onset_probability(location.id)
            persistence = risk_engine.calculate_persistence_probability(location.id, onset)
            dry_spell_7 = risk_engine.calculate_7_day_dry_spell_probability(location.id)
            dry_spell_14 = risk_engine.calculate_14_day_dry_spell_probability(location.id)
            heavy_rain = risk_engine.calculate_heavy_rain_probability(location.id)
            prediction_source = "rule_based_fallback"
            model_name = None
            model_version = None
    else:
        onset = risk_engine.calculate_onset_probability(location.id)
        persistence = risk_engine.calculate_persistence_probability(location.id, onset)
        dry_spell_7 = risk_engine.calculate_7_day_dry_spell_probability(location.id)
        dry_spell_14 = risk_engine.calculate_14_day_dry_spell_probability(location.id)
        heavy_rain = risk_engine.calculate_heavy_rain_probability(location.id)
        prediction_source = "demo" if settings.PREDICTION_MODE == "demo" else "rule_based"
        model_name = None
        model_version = None

    false_onset = risk_engine.detect_false_onset(onset, persistence, dry_spell_7)
    sowing_risk = risk_engine.calculate_sowing_risk(persistence, dry_spell_7, heavy_rain, crop)
    confidence = risk_engine.calculate_confidence(sowing_risk)
    sowing_window = risk_engine.calculate_potential_sowing_window(sowing_risk)
    
    return {
        "location": location,
        "onset": {"probability": onset},
        "persistence": {"probability": persistence},
        "dry_spell": {
            "seven_day_probability": dry_spell_7,
            "fourteen_day_probability": dry_spell_14
        },
        "heavy_rain": {"probability": heavy_rain},
        "sowing": {
            "risk": sowing_risk,
            "confidence": confidence
        },
        "false_onset": false_onset,
        "forecast_horizon_days": 7,
        "potential_sowing_window": sowing_window,
        "prediction_source": prediction_source,
        "model_name": model_name,
        "model_version": model_version
    }
