# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PM Simulator is a product management training platform with a Next.js 14 frontend and Python Flask backend. It features AI-powered market simulations using both rule-based statistical models and LLM-driven agent debates.

**Repository Location:** `/c/Users/DELL/pm-simulator`  
**Current Branch:** `feature/production-architecture-v2`

## Architecture

### High-Level Structure

```
pm-simulator/
├── src/                    # Next.js 14 Frontend (Port 3000+)
├── ai-agents-service/      # Flask Backend (Port 5001)
├── security-agent/          # Security scanning tool
├── tests/                 # pytest + Jest tests
└── .github/workflows/     # CI/CD (non-blocking during development)
```

### Frontend-Backend Communication

- **Frontend**: Next.js App Router with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Flask with SQLAlchemy ORM, JWT auth, Redis caching
- **Protocol**: REST API with Server-Sent Events (SSE) for streaming simulation progress
- **Auth**: JWT tokens stored in memory, refreshed via `/api/auth/refresh`

### Simulation Engine (Two Modes)

**Rule-Based** (`simulation/simulation_engine.py`):
- 1000 statistical personas
- ~5 minute runtime
- Outputs: conversion rates, NPS, satisfaction scores

**LLM-Driven** (`simulation/llm_simulation_engine.py`):
- 50 debating agents
- Mock mode: ~2 seconds (no LLM calls, for development)
- Full mode: ~15 minutes (requires Ollama or cloud LLM)
- Outputs: qualitative debates, network graphs, insights

### Database & Cache

- **Development**: SQLite (no setup required)
- **Production**: PostgreSQL + Redis (for Celery task queue)
- **Models**: `Simulation`, `UserPersona`, `PersonaType` (ENTHUSIAST, PRAGMATIST, SKEPTIC, LAGGARD)

## Development Commands

### Frontend (Next.js)

```bash
cd /c/Users/DELL/pm-simulator

# Install dependencies
npm install

# Development server (runs on first available port: 3000, 3001, etc.)
npm run dev

# Production build
npm run build

# Linting
npm run lint
```

### Backend (Flask)

```bash
cd /c/Users/DELL/pm-simulator/ai-agents-service

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py              # Basic version (Port 5001)
python app_v2.py           # Enhanced with v2 API features

# Initialize database (first time)
python -c "from database import init_db; init_db()"
```

### Testing

```bash
# Backend tests (from ai-agents-service/)
cd /c/Users/DELL/pm-simulator/ai-agents-service
pytest ../tests/unit/ -v
pytest ../tests/integration/ -v
pytest ../tests/benchmark/ -v

# Single test file
pytest ../tests/unit/test_simulation.py -v

# Frontend tests (not fully configured)
npm test
```

### Docker

```bash
# Staging environment (includes nginx, postgres, redis)
cd /c/Users/DELL/pm-simulator
docker-compose -f docker-compose.staging.yml up --build

# Access: http://localhost (nginx routes /api to backend)
```

## Key Files

### Frontend Entry Points

- `src/app/page.tsx` - Landing page
- `src/app/simulate/page.tsx` - Simulation wizard (4 steps)
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/layout.tsx` - Root layout with AuthProvider

### Backend Entry Points

- `ai-agents-service/app.py` - Basic Flask app
- `ai-agents-service/app_v2.py` - Enhanced with auth, rate limiting, streaming
- `ai-agents-service/simulation/simulation_engine.py` - Rule-based simulation
- `ai-agents-service/simulation/llm_simulation_engine.py` - LLM-driven simulation

### Configuration

- Frontend env: `.env.local` (NEXT_PUBLIC_API_URL=http://localhost:5001)
- Backend env: `ai-agents-service/.env` (DATABASE_URL, JWT_SECRET_KEY, REDIS_URL)
- Templates: `src/app/templates/` - Industry-specific simulation configs

## Module-Specific Docs

- Frontend: `src/CLAUDE.md`
- Backend: `ai-agents-service/CLAUDE.md`
- Security Agent: `security-agent/CLAUDE.md`

## Tech Stack Details

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript 5.4, Tailwind CSS 3.4 |
| UI Components | Radix UI primitives, Lucide icons, Framer Motion |
| Backend | Python 3.11, Flask 3.0, SQLAlchemy 2.0, Celery 5.3 |
| Database | SQLite (dev), PostgreSQL (prod) |
| Cache/Queue | Redis 7 |
| LLM | Ollama (local), OpenAI, Anthropic, Kimi, Qwen |
| Testing | pytest, Jest (CI: GitHub Actions, non-blocking) |

## Important Notes

- CI/CD tests are configured with `continue-on-error: true` during development
- LLM mode requires Ollama running locally or API keys for cloud providers
- Three.js was removed; use CSS-based 3D effects in `components/3d/`
- The qwen3.5 model requires 7GB RAM (system has 6.9GB)
- Demo account: `demo@example.com` / `demo123`
