# MonsoonGuard
**Smart India Hackathon 2026 Prototype**

> **Disclaimer:** This prototype is for demonstration and decision-support purposes. It does not replace official meteorological forecasts or agricultural advisories.

## Project Overview
MonsoonGuard is an agricultural decision-support system that evaluates whether an onset-like rainfall event is likely to persist and what that means for crop establishment and sowing.

## Architecture
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, SQLAlchemy
- **Database:** PostgreSQL
- **ML:** XGBoost, Scikit-Learn
- **DevOps:** Docker, Docker Compose

## Quick Start
```bash
docker compose up --build
```
Frontend: `http://localhost:5173`
Backend API: `http://localhost:8000`

## Structure
- `frontend/`: React app
- `backend/`: FastAPI app
- `ml/`: Machine Learning pipelines
- `database/`: SQL schemas and seed data
