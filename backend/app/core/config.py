import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MonsoonGuard API"
    VERSION: str = "1.0.0"
    
    PREDICTION_MODE: str = os.getenv("PREDICTION_MODE", "demo") # "demo", "rule_based", "ml"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://monsoonguard:monsoonguard@localhost:5432/monsoonguard"
    )

    # Risk Engine Thresholds (Configurable)
    THRESHOLD_FALSE_ONSET_PERSISTENCE: float = 0.50
    THRESHOLD_FALSE_ONSET_DRY_BREAK: float = 0.60
    
    THRESHOLD_HIGH_SOWING_PERSISTENCE: float = 0.45
    THRESHOLD_MED_SOWING_PERSISTENCE: float = 0.65
    
    THRESHOLD_HIGH_HEAVY_RAIN: float = 0.30
    THRESHOLD_MED_HEAVY_RAIN: float = 0.15

settings = Settings()
