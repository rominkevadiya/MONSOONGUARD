from pydantic import BaseModel
from datetime import date
from typing import Optional

class RainfallRecordBase(BaseModel):
    date: date
    rainfall_mm: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None

class RainfallRecord(RainfallRecordBase):
    id: int
    location_id: int

    class Config:
        from_attributes = True
