from pydantic import BaseModel
from typing import Optional
from .location import Location

class Probability(BaseModel):
    probability: float

class DrySpell(BaseModel):
    seven_day_probability: float
    fourteen_day_probability: float

class SowingRisk(BaseModel):
    risk: str
    confidence: str

class FalseOnset(BaseModel):
    detected: bool
    reason: Optional[str] = None
    confidence: Optional[str] = None

class RiskResponse(BaseModel):
    location: Location
    onset: Probability
    persistence: Probability
    dry_spell: DrySpell
    heavy_rain: Probability
    sowing: SowingRisk
    false_onset: FalseOnset
    forecast_horizon_days: int
    potential_sowing_window: Optional[str] = None
    prediction_source: str = "rule_based"
    model_name: Optional[str] = None
    model_version: Optional[str] = None
