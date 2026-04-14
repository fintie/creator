# Visionary Studio

Artlist-inspired AI video generation site with a React frontend and FastAPI backend.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- Video tools: FFmpeg + Seedance2.0 API

## Features

- Upload video
- Apply prompt
- Generate variation
- Artlist-style cinematic landing page
- Pipeline overview for orchestration, evaluation, reward optimization, and final memo

## Run locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE=http://localhost:8000` if needed.

## Environment

Copy `backend/.env.example` to `backend/.env` and set:

- `SEEDANCE_API_KEY`
- `SEEDANCE_API_URL`
- `PUBLIC_BACKEND_URL`

If the Seedance API is not configured, the backend falls back to a local FFmpeg preview transform, or returns the original file as a placeholder.
