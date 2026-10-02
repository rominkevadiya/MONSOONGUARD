from pydantic import BaseModel
from typing import List

class CropStage(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class Crop(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True
