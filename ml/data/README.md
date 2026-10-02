# MonsoonGuard Data Requirements

## Required Real Data

To train a scientifically valid model, the following real historical datasets are required. These are currently **missing** from the repository.

1.  **IMD Daily Gridded Rainfall**: High-resolution historical rainfall data covering the region of interest (Gujarat) for at least the last 20-30 years.
2.  **Gujarat Station Rainfall**: Localized telemetry data where available for finer geographic resolution.
3.  **Climate Indices**:
    *   Niño 3.4 Index (historical daily/monthly)
    *   Dipole Mode Index (DMI) for IOD
    *   Madden-Julian Oscillation (MJO) phase and amplitude
4.  **Geographic Boundaries**: Block/district boundary definitions for precise mapping.

These sources are mentioned in the SIH concept (e.g., NOAA/BOM climate info, IMD data). 

**Warning:** Do not download external datasets automatically. You must procure these datasets legally and place them in `ml/data/raw/` before attempting to train a production-ready model. The current pipeline generates a synthetic dataset *only* for smoke testing.
