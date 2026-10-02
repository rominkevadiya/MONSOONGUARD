"""
Label Generation for MonsoonGuard ML Pipeline.

Future rainfall is used ONLY to construct the target label.
"""
import pandas as pd
from ml.config import (
    ONSET_THRESHOLD_MM,
    PERSISTENCE_THRESHOLD_MM,
    DRY_SPELL_7_THRESHOLD_MM,
    DRY_SPELL_14_THRESHOLD_MM,
    HEAVY_RAIN_THRESHOLD_MM
)

def generate_labels(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generate target labels for the dataset.
    
    Labels:
    - ONSET_EVENT: > ONSET_THRESHOLD_MM in next 1 day
    - PERSISTENCE_EVENT: > PERSISTENCE_THRESHOLD_MM total in next 7 days
    - DRY_SPELL_7: < DRY_SPELL_7_THRESHOLD_MM total in next 7 days
    - DRY_SPELL_14: < DRY_SPELL_14_THRESHOLD_MM total in next 14 days
    - HEAVY_RAIN: > HEAVY_RAIN_THRESHOLD_MM in next 1 day
    """
    df = df.copy()
    
    # Ensure date is sorted
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values(by=['latitude', 'longitude', 'date'])
        
    grouped = df.groupby(['latitude', 'longitude'])
    
    # Forward-looking rolling sums (shift backwards)
    # ONSET: Will it rain > 2.5mm tomorrow?
    df['future_1d_rain'] = grouped['rainfall_mm'].shift(-1)
    df['ONSET_EVENT'] = (df['future_1d_rain'] >= ONSET_THRESHOLD_MM).astype(int)
    
    # HEAVY_RAIN: Will it rain > 64.5mm tomorrow?
    df['HEAVY_RAIN'] = (df['future_1d_rain'] >= HEAVY_RAIN_THRESHOLD_MM).astype(int)
    
    # PERSISTENCE / DRY SPELLS: Sum of rainfall over next 7 / 14 days
    # To get future 7 day sum, we can reverse the series, do rolling sum, and reverse back
    def future_rolling_sum(s, window):
        return s[::-1].rolling(window=window, min_periods=1).sum()[::-1]
    
    df['future_7d_rain'] = grouped['rainfall_mm'].transform(lambda x: future_rolling_sum(x.shift(-1), 7))
    df['future_14d_rain'] = grouped['rainfall_mm'].transform(lambda x: future_rolling_sum(x.shift(-1), 14))
    
    df['PERSISTENCE_EVENT'] = (df['future_7d_rain'] >= PERSISTENCE_THRESHOLD_MM).astype(int)
    df['DRY_SPELL_7'] = (df['future_7d_rain'] < DRY_SPELL_7_THRESHOLD_MM).astype(int)
    df['DRY_SPELL_14'] = (df['future_14d_rain'] < DRY_SPELL_14_THRESHOLD_MM).astype(int)
    
    # Drop intermediate columns
    df.drop(columns=['future_1d_rain', 'future_7d_rain', 'future_14d_rain'], inplace=True)
    
    # Drop rows at the end of the time series where future data is NaN
    # Since we use future data up to 14 days, the last 14 days won't have valid labels.
    df.dropna(subset=['ONSET_EVENT', 'PERSISTENCE_EVENT', 'DRY_SPELL_7', 'DRY_SPELL_14', 'HEAVY_RAIN'], inplace=True)
    
    return df
