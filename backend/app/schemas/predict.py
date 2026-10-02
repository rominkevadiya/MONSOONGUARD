from pydantic import BaseModel

class PredictRequest(BaseModel):
    location_id: int
    crop: str
    growth_stage: str

class AdvisoryRequest(BaseModel):
    location_id: int
    crop: str
    growth_stage: str
