from app.rules.risk_engine import (
    calculate_onset_probability,
    calculate_persistence_probability,
    detect_false_onset,
    calculate_sowing_risk,
    calculate_potential_sowing_window
)

def test_onset_probability():
    # ID % 3 == 0 (e.g. 3) -> 0.95
    assert calculate_onset_probability(3) == 0.95
    # ID % 2 == 0 (e.g. 2) -> 0.82
    assert calculate_onset_probability(2) == 0.82
    # Other (e.g. 1) -> 0.40
    assert calculate_onset_probability(1) == 0.40

def test_false_onset_detection():
    # Strong onset, weak persistence, high dry spell
    result = detect_false_onset(0.82, 0.35, 0.78)
    assert result["detected"] is True
    assert "persistence probability is low" in result["reason"]
    
    # Normal safe onset
    result2 = detect_false_onset(0.95, 0.90, 0.05)
    assert result2["detected"] is False

def test_sowing_risk():
    # High persistence, low dry spell, low heavy rain -> LOW
    assert calculate_sowing_risk(0.90, 0.05, 0.10, "Cotton") == "LOW"
    
    # Low persistence -> HIGH
    assert calculate_sowing_risk(0.35, 0.78, 0.05, "Cotton") == "HIGH"

def test_sowing_window():
    assert calculate_potential_sowing_window("HIGH") is None
    assert calculate_potential_sowing_window("LOW") == "18 June - 23 June"
