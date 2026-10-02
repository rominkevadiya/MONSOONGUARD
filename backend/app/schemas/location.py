from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    state: str
    district: str
    block: str
    village: str
    latitude: float
    longitude: float

class Location(LocationBase):
    id: int

    class Config:
        from_attributes = True
