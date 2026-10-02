from pydantic import BaseModel

class Advisory(BaseModel):
    crop: str
    stage: str
    location_id: int
    risk_level: str
    before_sowing: list[str]
    after_initial_rain: list[str]
    during_crop_growth: list[str]
