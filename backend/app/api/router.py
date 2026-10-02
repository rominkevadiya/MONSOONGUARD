from fastapi import APIRouter
from app.api.routes import health, locations, risk, advisory, rainfall, blocks, predict, map

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(locations.router, tags=["locations"])
api_router.include_router(risk.router, tags=["risk"])
api_router.include_router(advisory.router, tags=["advisory"])
api_router.include_router(rainfall.router, tags=["rainfall"])
api_router.include_router(blocks.router, tags=["blocks"])
api_router.include_router(predict.router, tags=["predict"])
api_router.include_router(map.router, prefix="/map", tags=["map"])
