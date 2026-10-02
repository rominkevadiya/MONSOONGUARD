from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.api.dependencies import get_db
from app.database import models

router = APIRouter()

@router.get("/blocks")
def get_blocks(db: Session = Depends(get_db)):
    blocks = db.query(models.Location.block).distinct().all()
    return [{"block": b[0]} for b in blocks if b[0]]
