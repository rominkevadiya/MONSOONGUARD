# Solution & System Architecture

## Overall Solution Architecture
MonsoonGuard uses a modern, decoupled architecture. The frontend is a React application built with Vite and TypeScript, styled with Tailwind CSS. It communicates via REST APIs to a Python FastAPI backend. The backend orchestrates data retrieval, invokes either a deterministic Risk Engine or an ML Prediction Service (depending on the configuration), and stores structural data in PostgreSQL.

### Technology Stack
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Recharts, Lucide React
*   **Backend:** Python, FastAPI, Pydantic, SQLAlchemy
*   **Database:** PostgreSQL
*   **Machine Learning:** Scikit-Learn, XGBoost, Joblib
*   **Infrastructure:** Docker, Docker Compose

### Repository Structure
*   `frontend/` - React SPA containing Farmer and Officer dashboards.
*   `backend/` - FastAPI application containing API routes, models, and the risk engine.
*   `ml/` - ML pipeline scripts for feature engineering, training, and calibration.
*   `docs/` - Project documentation.

---

## 1. High-Level Architecture

```mermaid
flowchart LR
    subgraph Client
        F[Farmer Dashboard]
        O[Officer Dashboard]
    end

    subgraph Backend Services
        API[FastAPI Router]
        RE[Risk Engine]
        ML[ML Prediction Service]
    end

    subgraph Storage
        DB[(PostgreSQL)]
        Models[(ML Artifacts .joblib)]
    end

    F -->|REST API| API
    O -->|REST API| API
    
    API <--> RE
    API <--> ML
    ML <--> Models
    API <--> DB
```

## 2. Farmer Request/Response Sequence

```mermaid
sequenceDiagram
    actor Farmer
    participant UI as React Frontend
    participant API as FastAPI Backend
    participant DB as PostgreSQL
    participant RE as Risk Engine

    Farmer->>UI: Selects Location & Crop
    UI->>API: GET /api/risk/{location_id}/crop/{crop}
    API->>DB: Fetch Location metadata
    DB-->>API: Location Record
    API->>RE: _generate_risk_response(location, crop)
    RE->>RE: calculate_onset_probability()
    RE->>RE: calculate_persistence_probability()
    RE->>RE: detect_false_onset()
    RE->>RE: calculate_sowing_risk()
    RE-->>API: Risk Assessment Payload
    API-->>UI: JSON Response
    UI-->>Farmer: Renders Dashboard & Sowing Window
```

## 3. Officer Dashboard Flow

```mermaid
flowchart TD
    A[Officer Logs In] --> B[View Regional Risk Map]
    B --> C{Filter Applied}
    C -->|High Sowing Risk| D[Highlight High-Risk Blocks]
    C -->|False Onset| E[Highlight False-Onset Traps]
    
    B --> F[View Alert Panel]
    F --> G[Identify Immediate Intervention Needs]
    
    B --> H[Select Specific Block]
    H --> I[View Block-Level Analytics & Probabilities]
```

## 4. Demo Mode Architecture
Because the prototype must function reliably in presentation environments without live telemetry, a sophisticated Demo Mode is implemented on the frontend.

```mermaid
flowchart TD
    A[React Context: DemoContext] -->|Provides State| B[Frontend Components]
    A -->|Contains| C[Demo Scenarios]
    
    C --> D[Persistent Onset]
    C --> E[False Onset]
    C --> F[Heavy Rain Risk]
    C --> G[Uncertain]
    
    B --> H{isDemoMode?}
    H -->|Yes| I[Use DemoContext synthetic data]
    H -->|No| J[Fetch from FastAPI Backend]
```

## 5. Multilingual Architecture
The frontend utilizes a lightweight, custom React Context provider to handle translations dynamically without page reloads.

```mermaid
flowchart LR
    A[LanguageContext] -->|Loads on mount| B[localStorage]
    B -->|monsoonguard-language| A
    
    A -->|Provides t function| C[UI Components]
    
    subgraph Dictionaries
        EN[en.ts]
        GU[gu.ts]
        HI[hi.ts]
    end
    
    EN --> A
    GU --> A
    HI --> A
    
    C -->|User selects Gujarati| A
    A -->|Updates State and Cache| B
```

## 6. Core Risk-Processing Flow
False-onset detection and risk processing are strictly centralized within the backend. The frontend is a purely presentational layer.

```mermaid
flowchart TD
    A[Input Features: Rain, Climate, Date] --> B[Calculate Onset Probability]
    B --> C[Calculate Persistence Probability]
    C --> D[Calculate 7-Day Dry Spell]
    
    B --> E{Onset > 65% ?}
    C --> F{Persistence < 65% ?}
    D --> G{Dry Spell > 25% ?}
    
    E & F & G --> H[False-Onset Detected]
    
    H --> I[Calculate Sowing Risk]
    I --> J[Return to Client]
```
