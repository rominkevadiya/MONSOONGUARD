# 🌧️ MonsoonGuard

> **Smart India Hackathon (SIH) 2026 Prototype**  
> **Problem Statement:** SIH26086 - Hyperlocal Monsoon Onset & Break Prediction System (Block/Village Scale)  
> **Category:** Software | **Theme:** Agriculture, FoodTech & Rural Development  
> **Sponsor:** Ministry of Earth Sciences (MoES)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![XGBoost](https://img.shields.io/badge/Machine%20Learning-XGBoost-orange?style=for-the-badge)

## 📖 Project Overview

**MonsoonGuard** is a robust agricultural decision-support system built to tackle one of the most critical challenges farmers face: **"Is it safe to sow?"**

Initial rainfall does not always indicate a sustained monsoon. Often, early rains are followed by a prolonged dry spell (a "dry-break"). This phenomenon, known as a **false onset**, acts as a trap. If farmers sow seeds immediately after a false onset, the seeds germinate but subsequently die due to a lack of moisture, leading to massive financial and agricultural losses.

MonsoonGuard shifts the focus from simple weather forecasting to **agricultural impact forecasting**. It evaluates hyperlocal rainfall, calculates monsoon persistence probabilities, and flags high-risk periods to determine a safe "Potential Sowing Window."

---

## 🌟 Key Features

- **Hyperlocal Risk Assessment:** Predicts monsoon onset, persistence, and dry-break risks at the block/village scale.
- **Dual Dashboards:** 
  - **Farmer Dashboard:** Simple, actionable insights regarding sowing risks and crop-stage advisories.
  - **Extension Officer Dashboard:** A comprehensive regional map flagging high-risk blocks for targeted intervention.
- **Multilingual Support:** Dynamic, zero-reload localization supporting English, Gujarati (`ગુજરાતી`), and Hindi (`हिन्दी`).
- **Deterministic Risk Engine & ML Pipeline:** A Python-based rule engine that acts as the single source of truth, backed by a calibratable XGBoost Machine Learning pipeline architecture.
- **Built-in Demo Mode:** Ensures seamless presentation in evaluation environments with synthetic, pre-defined meteorological scenarios (Persistent Onset, False Onset, Heavy Rain).

---

## 🏗️ Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.11, FastAPI, Pydantic, SQLAlchemy ORM
- **Database:** PostgreSQL
- **Machine Learning:** Scikit-Learn, XGBoost, Pandas, NumPy, Joblib
- **Infrastructure:** Docker, Docker Compose

---

## 📚 Technical Documentation

For an in-depth understanding of the system's architecture, data models, and ML capabilities, please refer to the comprehensive documentation located in the [`docs/`](./docs) directory:

1. [Project and Problem Statement](./docs/01-project-and-problem.md)
2. [Solution and System Architecture](./docs/02-solution-and-system-architecture.md)
3. [Technical Implementation](./docs/03-technical-implementation.md)
4. [Data, Risk Engine, and ML Pipeline](./docs/04-data-risk-and-ml.md)
5. [Demo, Testing, and Roadmap](./docs/05-demo-testing-and-roadmap.md)

---

## 💻 Manual Setup (Without Docker)

If you prefer to run the services locally without Docker, follow these steps:

### 1. Database Setup (PostgreSQL)
Ensure you have PostgreSQL installed and running on your system.
1. Create a database named `monsoonguard`.
2. Execute the SQL scripts located in `database/schema.sql` and `database/seed.sql` to initialize the tables and populate the demo data.

### 2. Backend Setup (FastAPI)
Requires Python 3.11+.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup (React/Vite)
Requires Node.js 18+.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🚀 Quick Start (Docker)

If you prefer using Docker, the easiest way to run the entire stack locally is using Docker Compose.

```bash
# Clone the repository
git clone https://github.com/rominkevadiya/MONSOONGUARD.git
cd MONSOONGUARD

# Build and start the containers
docker compose up --build
```

- **Frontend (Farmer & Officer UI):** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **API Documentation (Swagger UI):** `http://localhost:8000/docs`

---

## 📂 Repository Structure

```
MONSOONGUARD/
├── frontend/           # React SPA (Vite + TypeScript + Tailwind)
├── backend/            # FastAPI application (Routes, Models, Risk Engine)
├── ml/                 # Machine Learning pipeline (Feature Eng., Training)
├── database/           # SQL schemas and seed data
├── docs/               # Comprehensive technical documentation
├── docker-compose.yml  # Container orchestration
└── README.md           # Project entry point
```

---

## ⚠️ Important Prototype Disclaimer

This software is a **decision-support prototype** developed exclusively for the SIH 2026 hackathon. 
- It **does not** replace official IMD meteorological forecasts or local government agricultural advisories.
- **Machine Learning Status:** The current ML pipeline operates on a **synthetic smoke-test dataset** designed to prove architectural feasibility. Predictions generated by the ML layer in this repository do not reflect scientifically validated real-world forecasting accuracy. Live telemetry and historical datasets are required for production calibration.
