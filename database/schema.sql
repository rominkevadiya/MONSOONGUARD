CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    block VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS rainfall_records (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    date DATE NOT NULL,
    rainfall_mm FLOAT NOT NULL,
    temperature FLOAT,
    humidity FLOAT
);

CREATE TABLE IF NOT EXISTS climate_indices (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    nino34 FLOAT,
    dmi FLOAT,
    mjo_phase INTEGER,
    mjo_amplitude FLOAT
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    onset_probability FLOAT,
    persistence_probability FLOAT,
    dry_spell_7_probability FLOAT,
    dry_spell_14_probability FLOAT,
    heavy_rain_probability FLOAT,
    sowing_risk VARCHAR(50),
    confidence VARCHAR(50),
    forecast_horizon INTEGER
);

CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS crop_stages (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES crops(id),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS advisories (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    crop_id INTEGER REFERENCES crops(id),
    stage_id INTEGER REFERENCES crop_stages(id),
    risk_level VARCHAR(50),
    message TEXT
);

CREATE TABLE IF NOT EXISTS risk_snapshots (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    onset_risk VARCHAR(50),
    dry_break_risk VARCHAR(50),
    heavy_rain_risk VARCHAR(50),
    sowing_risk VARCHAR(50)
);
