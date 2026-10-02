import datetime
from sqlalchemy.orm import Session
from app.database import models
from app.database.database import SessionLocal, engine

LOCATIONS = [
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Daskroi", "village": "Jetalpur", "latitude": 22.8833, "longitude": 72.5833},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Sanand", "village": "Sanand", "latitude": 22.9833, "longitude": 72.3833},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Bavla", "village": "Bavla", "latitude": 22.8333, "longitude": 72.3667},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Detroj", "village": "Detroj", "latitude": 23.3333, "longitude": 72.1667},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Viramgam", "village": "Viramgam", "latitude": 23.1167, "longitude": 72.0333},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Mandal", "village": "Mandal", "latitude": 23.2833, "longitude": 71.9167},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Dholka", "village": "Dholka", "latitude": 22.7167, "longitude": 72.4667},
    {"state": "Gujarat", "district": "Ahmedabad", "block": "Ahmedabad City", "village": "Ahmedabad City", "latitude": 23.0225, "longitude": 72.5714},
    {"state": "Gujarat", "district": "Kheda", "block": "Kheda", "village": "Kheda", "latitude": 22.7500, "longitude": 72.6833},
    {"state": "Gujarat", "district": "Kheda", "block": "Nadiad", "village": "Nadiad", "latitude": 22.7000, "longitude": 72.8667},
]

CROPS = ["Cotton", "Groundnut", "Maize", "Millet", "Soybean"]
STAGES = ["Pre-sowing", "Germination", "Early growth", "Vegetative", "Flowering"]

def seed_database(db: Session = None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True
        
    try:
        # Check if already seeded
        if db.query(models.Location).first() is not None:
            print("Database already seeded. Skipping.")
            return

        print("Seeding locations...")
        db_locations = []
        for loc in LOCATIONS:
            db_loc = models.Location(**loc)
            db.add(db_loc)
            db_locations.append(db_loc)
        
        db.commit()
        
        print("Seeding crops and stages...")
        for crop_name in CROPS:
            db_crop = models.Crop(name=crop_name)
            db.add(db_crop)
            db.commit() # Commit to get ID
            
            for stage_name in STAGES:
                db_stage = models.CropStage(crop_id=db_crop.id, name=stage_name)
                db.add(db_stage)
        
        db.commit()
        
        print("Seeding demo rainfall records...")
        today = datetime.date.today()
        for loc in db_locations:
            # Create some deterministic fake records for the past 5 days
            for i in range(5):
                db.add(models.RainfallRecord(
                    location_id=loc.id,
                    date=today - datetime.timedelta(days=i),
                    rainfall_mm=(loc.id * 10.0 + i) % 50, # Deterministic pattern
                    temperature=30.0 + (i % 5),
                    humidity=60.0 + (loc.id % 20)
                ))
        db.commit()

        print("Seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    seed_database()
