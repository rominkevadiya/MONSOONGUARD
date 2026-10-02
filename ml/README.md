# MonsoonGuard ML Pipeline

This directory contains the machine learning pipeline for MonsoonGuard.

**IMPORTANT: SYNTHETIC DATA USE ONLY**
There is currently no labeled historical dataset present in the repository. The pipeline automatically falls back to generating a small **synthetic dataset** strictly for smoke-testing the interface and API integration. The synthetic model outputs **do not represent scientific predictions** and should not be used as such.

## Pipeline Architecture
1.  **Data Loading**: `ml/train.py` attempts to load historical data. If missing, it generates synthetic data.
2.  **Feature Engineering**: `ml/feature_engineering.py` applies rainfall lags, cumulative sums, dry days, and climate features.
3.  **Label Generation**: `ml/labels.py` looks *forward* to generate boolean flags for Onset, Persistence, Dry Spells, and Heavy Rain events.
4.  **Training**: `ml/train.py` chronologically splits the data and trains Logistic Regression, Random Forest, and XGBoost models.
5.  **Calibration**: XGBoost probabilities are calibrated using Platt scaling (sigmoid) on a validation split (`ml/calibrate.py`).
6.  **Prediction Interface**: `backend/app/services/ml_prediction_service.py` connects the FastApi backend to the saved `joblib` artifacts.

## Usage
Run the pipeline test:
```bash
python -m ml.train
```
