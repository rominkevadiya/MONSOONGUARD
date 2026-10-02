"""
Feature Engineering for MonsoonGuard ML Pipeline.

Implements features specified in the SIH concept.
DO NOT use future information as features.
"""
import pandas as pd
import numpy as np

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Accepts a clean dataframe and returns a model-ready feature dataframe.
    
    Required columns in input:
    - date (datetime)
    - rainfall_mm (float)
    - nino34 (float)
    - dmi (float)
    - mjo_phase (int)
    - mjo_amplitude (float)
    - latitude (float)
    - longitude (float)
    """
    df = df.copy()
    
    # Ensure date is sorted
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values(by=['latitude', 'longitude', 'date'])
        
        # Temporal Features
        df['day_of_year'] = df['date'].dt.dayofyear
        
        # Assuming June 1st (day 152 in leap year, 152 in normal usually but approx) as reference
        # For simplicity, just use day_of_year for now. We can calculate days_since_monsoon_reference.
        # Monsoon reference typically June 1st (day 152).
        df['days_since_monsoon_reference'] = df['day_of_year'] - 152
    
    # Group by location for rolling calculations
    grouped = df.groupby(['latitude', 'longitude'])
    
    # Rainfall Features
    df['rainfall_lag_1'] = grouped['rainfall_mm'].shift(1)
    df['rainfall_lag_3'] = grouped['rainfall_mm'].shift(3)
    df['rainfall_lag_7'] = grouped['rainfall_mm'].shift(7)
    df['rainfall_lag_14'] = grouped['rainfall_mm'].shift(14)
    
    # Cumulative rainfall
    df['rainfall_7d_cum'] = grouped['rainfall_mm'].rolling(window=7, min_periods=1).sum().reset_index(level=[0,1], drop=True)
    df['rainfall_30d_cum'] = grouped['rainfall_mm'].rolling(window=30, min_periods=1).sum().reset_index(level=[0,1], drop=True)
    
    # Consecutive dry days (rainfall < 2.5mm)
    def calc_dry_days(s):
        is_dry = s < 2.5
        # Cumulative sum of is_dry, reset when it rains
        # This is a bit tricky to vectorize efficiently over groups, using a simple loop for prototyping
        # or shifting.
        # Vectorized approach:
        a = is_dry.astype(int)
        return a.groupby((~is_dry).cumsum()).cumsum()
    
    df['consecutive_dry_days'] = grouped['rainfall_mm'].transform(calc_dry_days)
    
    # Rainfall anomaly (difference from 30-day mean)
    df['rainfall_30d_mean'] = grouped['rainfall_mm'].rolling(window=30, min_periods=1).mean().reset_index(level=[0,1], drop=True)
    df['rainfall_anomaly'] = df['rainfall_mm'] - df['rainfall_30d_mean']
    
    # Drop features we won't train on (like the raw date, though we might need it for splitting)
    # We will keep 'date' for chronological splitting and drop it later in the pipeline
    
    # Handle NaN values introduced by rolling/lag features
    # Since it's time series, we can forward fill or drop.
    # For safe training, we'll fill with 0 or mean.
    df.fillna(0, inplace=True)
    
    return df
