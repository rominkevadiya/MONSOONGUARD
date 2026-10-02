from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.database import models
from app.rules import risk_engine
from typing import List
from pydantic import BaseModel

router = APIRouter()

class MapRiskResponse(BaseModel):
    location_id: int
    district: str
    block: str
    village: str
    latitude: float
    longitude: float
    sowing_risk: str
    onset_probability: float
    persistence_probability: float
    dry_break_probability: float
    heavy_rain_probability: float
    false_onset_detected: bool

@router.get("/risk", response_model=List[MapRiskResponse])
def get_map_risk(db: Session = Depends(get_db)):
    locations = db.query(models.Location).all()
    response = []
    
    for loc in locations:
        onset = risk_engine.calculate_onset_probability(loc.id)
        persistence = risk_engine.calculate_persistence_probability(loc.id, onset)
        dry_spell_7 = risk_engine.calculate_7_day_dry_spell_probability(loc.id)
        heavy_rain = risk_engine.calculate_heavy_rain_probability(loc.id)
        
        # Default to Cotton for general map risk overview if not specified
        sowing_risk = risk_engine.calculate_sowing_risk(persistence, dry_spell_7, heavy_rain, "Cotton")
        
        false_onset = risk_engine.detect_false_onset(onset, persistence, dry_spell_7)
        
        response.append(MapRiskResponse(
            location_id=loc.id,
            district=loc.district,
            block=loc.block,
            village=loc.village,
            latitude=loc.latitude,
            longitude=loc.longitude,
            sowing_risk=sowing_risk,
            onset_probability=onset,
            persistence_probability=persistence,
            dry_break_probability=dry_spell_7,
            heavy_rain_probability=heavy_rain,
            false_onset_detected=false_onset["detected"]
        ))
        
    return response
