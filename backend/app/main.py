from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.database.database import engine, Base, SessionLocal
from app.database.seed import seed_database
import logging

app = FastAPI(
    title="MonsoonGuard API",
    description="Hyperlocal Monsoon Onset & Break Prediction System",
    version="1.0.0",
)

@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        
        # Seed the database if it's empty
        db = SessionLocal()
        seed_database(db)
        db.close()
    except Exception as e:
        logging.warning(f"Could not initialize database: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
