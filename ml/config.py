"""
Configuration for the ML pipeline.
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR = os.path.join(BASE_DIR, "data")
RAW_DATA_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, "processed")
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Prototype event definitions
ONSET_THRESHOLD_MM = 2.5
PERSISTENCE_THRESHOLD_MM = 10.0
DRY_SPELL_7_THRESHOLD_MM = 1.0 # Less than 1mm in 7 days
DRY_SPELL_14_THRESHOLD_MM = 1.0 # Less than 1mm in 14 days
HEAVY_RAIN_THRESHOLD_MM = 64.5

# Training parameters
TARGET_EVENTS = [
    "ONSET_EVENT",
    "PERSISTENCE_EVENT",
    "DRY_SPELL_7",
    "DRY_SPELL_14",
    "HEAVY_RAIN"
]

RANDOM_STATE = 42
