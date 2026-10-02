"""
ML Prediction Service for MonsoonGuard.

Loads the saved joblib models and provides a standardized prediction response.
Falls back to deterministic rule-based logic if ML models are unavailable.
"""
import os
import json
import pandas as pd
import datetime
import sys
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.predict import XGBoostModel
from ml.calibrate import CalibratedModel
import joblib

# Go up from backend/app/services to project root, then ml/models
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
MODELS_DIR = os.path.join(PROJECT_ROOT, "ml", "models")

class MLPredictionService:
    def __init__(self):
        self.models = {}
        self.metadata = {}
        self.ml_available = False
        self._load_models()

    def _load_models(self):
        try:
            metadata_path = os.path.join(MODELS_DIR, "model_metadata.json")
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                    
                events = ["onset_event", "persistence_event", "dry_spell_7", "dry_spell_14", "heavy_rain"]
                
                for event in events:
                    model_path = os.path.join(MODELS_DIR, f"{event}_xgboost.joblib")
                    if os.path.exists(model_path):
                        self.models[event] = joblib.load(model_path)
                    else:
                        print(f"Warning: Model for {event} not found at {model_path}")
                        
                if len(self.models) == len(events):
                    self.ml_available = True
                    print("ML models loaded successfully.")
            else:
                print(f"Metadata not found at {metadata_path}. ML fallback required.")
        except Exception as e:
            print(f"Error loading ML models: {e}")
            self.ml_available = False

    def _build_mock_features(self, location_id: int):
        # In a real system, this would query recent database records to construct
        # the exact features needed (e.g. past 30 days of rainfall, current MJO phase).
        # For the prototype interface, we pass dummy features matching the trained signature.
        features = self.metadata.get("features", [])
        
        # Create a single row dataframe with zeros or safe defaults
        row = {f: 0 for f in features}
        
        # Add some variation based on location_id just to show different predictions
        if 'day_of_year' in row: row['day_of_year'] = 160
        if 'nino34' in row: row['nino34'] = 0.5 if location_id % 2 == 0 else -0.5
        
        df = pd.DataFrame([row])
        return df

    def predict(self, location_id: int):
        """
        Returns predictions and metadata. 
        Does NOT calculate final sowing risk (that stays in risk engine).
        """
        if not self.ml_available:
            return {
                "prediction_source": "rule_based",
                "ml_available": False,
                "model_name": None,
                "model_version": None,
                "dataset_type": None,
                "predictions": None
            }
            
        try:
            X = self._build_mock_features(location_id)
            
            # Predict probabilities
            onset_prob = self.models["onset_event"].predict_proba(X)[0][1]
            persistence_prob = self.models["persistence_event"].predict_proba(X)[0][1]
            dry_spell_7_prob = self.models["dry_spell_7"].predict_proba(X)[0][1]
            dry_spell_14_prob = self.models["dry_spell_14"].predict_proba(X)[0][1]
            heavy_rain_prob = self.models["heavy_rain"].predict_proba(X)[0][1]
            
            return {
                "prediction_source": "xgboost",
                "ml_available": True,
                "model_name": self.metadata.get("model", "XGBoost"),
                "model_version": self.metadata.get("version", "unknown"),
                "dataset_type": self.metadata.get("dataset_type", "unknown"),
                "predictions": {
                    "onset_probability": float(onset_prob),
                    "persistence_probability": float(persistence_prob),
                    "dry_spell_7_probability": float(dry_spell_7_prob),
                    "dry_spell_14_probability": float(dry_spell_14_prob),
                    "heavy_rain_probability": float(heavy_rain_prob)
                }
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return {
                "prediction_source": "rule_based",
                "ml_available": False,
                "model_name": None,
                "model_version": None,
                "dataset_type": None,
                "predictions": None
            }

ml_service = MLPredictionService()
