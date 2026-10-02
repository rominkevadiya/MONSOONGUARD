"""
Probability Calibration for MonsoonGuard ML Pipeline.
"""
from sklearn.calibration import CalibratedClassifierCV
from ml.predict import BaseRiskModel
import joblib

class CalibratedModel(BaseRiskModel):
    def __init__(self, base_model, method='sigmoid', cv=3):
        self.base_model = base_model
        # Fits the estimator and calibrator using cross validation
        self.calibrator = CalibratedClassifierCV(estimator=base_model.model, method=method, cv=cv)
        
    def fit(self, X_val, y_val):
        self.calibrator.fit(X_val, y_val)
        
    def predict(self, X):
        return self.calibrator.predict(X)
        
    def predict_proba(self, X):
        return self.calibrator.predict_proba(X)
        
    def save(self, filepath):
        joblib.dump(self.calibrator, filepath)
        
    def load(self, filepath):
        self.calibrator = joblib.load(filepath)
