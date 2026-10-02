"""
Model Interface for MonsoonGuard ML Pipeline.
"""
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import os
import joblib

class BaseRiskModel:
    def fit(self, X, y):
        raise NotImplementedError
        
    def predict(self, X):
        raise NotImplementedError
        
    def predict_proba(self, X):
        raise NotImplementedError
        
    def save(self, filepath):
        joblib.dump(self.model, filepath)
        
    def load(self, filepath):
        self.model = joblib.load(filepath)

class LogisticRegressionModel(BaseRiskModel):
    def __init__(self, random_state=42):
        self.model = LogisticRegression(random_state=random_state, max_iter=1000)
        
    def fit(self, X, y):
        self.model.fit(X, y)
        
    def predict(self, X):
        return self.model.predict(X)
        
    def predict_proba(self, X):
        return self.model.predict_proba(X)

class RandomForestModel(BaseRiskModel):
    def __init__(self, random_state=42):
        self.model = RandomForestClassifier(random_state=random_state, n_estimators=100)
        
    def fit(self, X, y):
        self.model.fit(X, y)
        
    def predict(self, X):
        return self.model.predict(X)
        
    def predict_proba(self, X):
        return self.model.predict_proba(X)

class XGBoostModel(BaseRiskModel):
    def __init__(self, random_state=42):
        self.model = xgb.XGBClassifier(random_state=random_state, eval_metric="logloss")
        
    def fit(self, X, y):
        self.model.fit(X, y)
        
    def predict(self, X):
        return self.model.predict(X)
        
    def predict_proba(self, X):
        return self.model.predict_proba(X)
