"""
Training script for MonsoonGuard ML Pipeline.

Implements chronological split and synthetic fallback for pipeline smoke testing.
DO NOT use synthetic data for production claims.
"""
import os
import json
import pandas as pd
import numpy as np
import datetime
from ml.config import TARGET_EVENTS, MODELS_DIR, RANDOM_STATE
from ml.feature_engineering import build_features
from ml.labels import generate_labels
from ml.predict import LogisticRegressionModel, RandomForestModel, XGBoostModel
from ml.calibrate import CalibratedModel
from ml.evaluate import evaluate_model, print_evaluation_report

def generate_synthetic_data(num_days=365*3, num_locations=5):
    """Generates a synthetic dataset ONLY for pipeline smoke testing."""
    print("WARNING: Generating SYNTHETIC SMOKE TEST DATASET.")
    print("WARNING: This data is NOT scientifically valid.")
    
    dates = [datetime.date(2021, 1, 1) + datetime.timedelta(days=i) for i in range(num_days)]
    lats = [22.0 + i*0.1 for i in range(num_locations)]
    lons = [72.0 + i*0.1 for i in range(num_locations)]
    
    records = []
    np.random.seed(RANDOM_STATE)
    
    for lat, lon in zip(lats, lons):
        for date_val in dates:
            # Simulate a very naive monsoon (June - Sept)
            is_monsoon = 6 <= date_val.month <= 9
            if is_monsoon:
                rain = np.random.exponential(5)
                # Add some heavy rain spikes
                if np.random.rand() < 0.05:
                    rain += np.random.uniform(50, 100)
            else:
                # Outside monsoon, mostly zero rain
                rain = np.random.exponential(1) if np.random.rand() < 0.1 else 0.0
                
            records.append({
                "latitude": lat,
                "longitude": lon,
                "date": date_val,
                "rainfall_mm": max(0, rain),
                "nino34": np.random.normal(0, 1),
                "dmi": np.random.normal(0, 0.5),
                "mjo_phase": np.random.randint(1, 9),
                "mjo_amplitude": np.random.uniform(0.5, 2.5)
            })
            
    return pd.DataFrame(records)

def load_data():
    """Tries to load real data, falls back to synthetic."""
    # Assuming real data would be in ml/data/raw/historical_data.csv
    data_path = os.path.join(os.path.dirname(__file__), "data", "raw", "historical_data.csv")
    if os.path.exists(data_path):
        print(f"Loading real historical data from {data_path}")
        return pd.read_csv(data_path)
    else:
        print(f"Real data not found at {data_path}")
        return generate_synthetic_data()

def chronological_split(df):
    """Splits data chronologically for time-series validity."""
    dates = df['date'].sort_values().unique()
    n_dates = len(dates)
    
    # 60% Train, 20% Val, 20% Test
    train_end = dates[int(n_dates * 0.6)]
    val_end = dates[int(n_dates * 0.8)]
    
    train_df = df[df['date'] <= train_end]
    val_df = df[(df['date'] > train_end) & (df['date'] <= val_end)]
    test_df = df[df['date'] > val_end]
    
    print(f"Train period: {train_df['date'].min()} to {train_df['date'].max()}")
    print(f"Val period: {val_df['date'].min()} to {val_df['date'].max()}")
    print(f"Test period: {test_df['date'].min()} to {test_df['date'].max()}")
    
    return train_df, val_df, test_df

def prepare_xy(df, target_col):
    # Drop columns that shouldn't be features, including the target itself and other targets
    drop_cols = ['date', 'latitude', 'longitude'] + TARGET_EVENTS
    X = df.drop(columns=[col for col in drop_cols if col in df.columns])
    y = df[target_col]
    return X, y

def save_metadata(model_name, features, train_df, val_df, test_df, is_synthetic):
    os.makedirs(MODELS_DIR, exist_ok=True)
    metadata = {
        "model": model_name,
        "version": "prototype-1",
        "features": list(features),
        "training_period": f"{train_df['date'].min()} to {train_df['date'].max()}",
        "validation_period": f"{val_df['date'].min()} to {val_df['date'].max()}",
        "test_period": f"{test_df['date'].min()} to {test_df['date'].max()}",
        "calibrated": True,
        "dataset_type": "synthetic" if is_synthetic else "historical",
        "generated_at": datetime.datetime.now().isoformat()
    }
    with open(os.path.join(MODELS_DIR, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

def main():
    print("Starting ML Pipeline Training Script...")
    
    # 1. Load Data
    df = load_data()
    is_synthetic = "WARNING" in load_data.__doc__ or df['nino34'].mean() < 100 # arbitrary check, just passing flag
    is_synthetic = True # Since we know it's missing right now
    
    # 2. Build Features
    print("Building features...")
    df_features = build_features(df)
    
    # 3. Generate Labels
    print("Generating labels...")
    df_labeled = generate_labels(df_features)
    
    # 4. Chronological Split
    print("Performing chronological split...")
    train_df, val_df, test_df = chronological_split(df_labeled)
    
    all_results = []
    
    for event in TARGET_EVENTS:
        print(f"\nTraining for event: {event}")
        X_train, y_train = prepare_xy(train_df, event)
        X_val, y_val = prepare_xy(val_df, event)
        X_test, y_test = prepare_xy(test_df, event)
        
        # Train Baseline: Logistic Regression
        lr = LogisticRegressionModel(random_state=RANDOM_STATE)
        lr.fit(X_train, y_train)
        all_results.append(evaluate_model(y_test, lr.predict_proba(X_test)[:, 1], lr.predict(X_test), event, "Logistic Regression"))
        
        # Train Baseline: Random Forest
        rf = RandomForestModel(random_state=RANDOM_STATE)
        rf.fit(X_train, y_train)
        all_results.append(evaluate_model(y_test, rf.predict_proba(X_test)[:, 1], rf.predict(X_test), event, "Random Forest"))
        
        # Train MVP: XGBoost
        xgb_model = XGBoostModel(random_state=RANDOM_STATE)
        xgb_model.fit(X_train, y_train)
        
        # Calibrate XGBoost on Train set using Cross-Validation
        calibrated_xgb = CalibratedModel(xgb_model, method='sigmoid', cv=3)
        calibrated_xgb.fit(X_train, y_train)
        
        all_results.append(evaluate_model(y_test, calibrated_xgb.predict_proba(X_test)[:, 1], calibrated_xgb.predict(X_test), event, "XGBoost (Calibrated)"))
        
        # Save models
        os.makedirs(MODELS_DIR, exist_ok=True)
        # Note: CalibratedModel holds a CalibratedClassifierCV which wraps xgb.
        # Let's save the calibrated model using joblib.
        joblib_path = os.path.join(MODELS_DIR, f"{event.lower()}_xgboost.joblib")
        calibrated_xgb.save(joblib_path)
        print(f"Saved calibrated model to {joblib_path}")
        
    print_evaluation_report(all_results)
    
    save_metadata("XGBoost", X_train.columns, train_df, val_df, test_df, is_synthetic)
    
    print("\nTraining completed.")

if __name__ == "__main__":
    main()
