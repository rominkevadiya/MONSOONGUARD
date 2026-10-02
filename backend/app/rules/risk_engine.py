from app.core.config import settings

def calculate_onset_probability(location_id: int) -> float:
    # Deterministic mock based on location for demo
    if location_id % 3 == 0:
        return 0.95 # Heavy rain or strong onset
    elif location_id % 2 == 0:
        return 0.82 # Uncertain or false onset
    return 0.40 # Low chance

def calculate_persistence_probability(location_id: int, onset_prob: float) -> float:
    if onset_prob > 0.9:
        return 0.90 # Strong persistence
    if location_id % 2 == 0:
        return 0.35 # False onset scenario
    return 0.61 # Uncertain scenario

def calculate_7_day_dry_spell_probability(location_id: int) -> float:
    if location_id % 2 == 0:
        return 0.78 # High dry spell risk
    if location_id % 3 == 0:
        return 0.05
    return 0.28

def calculate_14_day_dry_spell_probability(location_id: int) -> float:
    if location_id % 2 == 0:
        return 0.65
    if location_id % 3 == 0:
        return 0.10
    return 0.21

def calculate_heavy_rain_probability(location_id: int) -> float:
    if location_id % 3 == 0:
        return 0.85
    if location_id % 2 == 0:
        return 0.05
    return 0.18

def detect_false_onset(onset_prob: float, persistence_prob: float, dry_spell_prob: float) -> dict:
    if onset_prob > 0.7 and (persistence_prob < settings.THRESHOLD_FALSE_ONSET_PERSISTENCE or dry_spell_prob > settings.THRESHOLD_FALSE_ONSET_DRY_BREAK):
        return {
            "detected": True,
            "reason": f"Initial rainfall signal is strong but persistence probability is low ({int(persistence_prob*100)}%) and 7-day dry break risk is high ({int(dry_spell_prob*100)}%).",
            "confidence": "Medium"
        }
    return {
        "detected": False,
        "reason": None,
        "confidence": "High"
    }

def calculate_sowing_risk(persistence_prob: float, dry_spell_prob: float, heavy_rain_prob: float, crop: str = "Cotton") -> str:
    # Basic deterministic crop logic
    crop_sensitivity = 0.0
    if crop.lower() in ["groundnut", "soybean"]:
        crop_sensitivity = 0.1 # More sensitive to dry spells
        
    adj_persistence = persistence_prob - crop_sensitivity
    
    if adj_persistence < settings.THRESHOLD_HIGH_SOWING_PERSISTENCE or dry_spell_prob > 0.5 or heavy_rain_prob > settings.THRESHOLD_HIGH_HEAVY_RAIN:
        return "HIGH"
    elif adj_persistence < settings.THRESHOLD_MED_SOWING_PERSISTENCE or heavy_rain_prob > settings.THRESHOLD_MED_HEAVY_RAIN:
        return "MEDIUM"
    return "LOW"

def calculate_confidence(risk: str) -> str:
    if risk == "HIGH":
        return "High"
    return "Medium"

def calculate_potential_sowing_window(risk: str) -> str | None:
    if risk == "HIGH":
        return None
    return "18 June - 23 June" # Mock window for MVP
