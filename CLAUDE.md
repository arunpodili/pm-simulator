# PM Simulator

**Product Management Training Platform**  
*Last Updated: 2026-04-03*

## Quick Links

| Resource | Location |
|----------|----------|
| Frontend Dev Server | http://localhost:3007 |
| Backend API | http://localhost:5001 |
| Health Check | http://localhost:5001/api/simulation/health |
| GitHub | https://github.com/arunpodili/pm-simulator |
| Branch | feature/production-architecture-v2 |

## Project Structure

```
pm-simulator/
├── src/                    # Next.js 14 Frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   │   ├── simulation/    # Simulation UI
│   │   └── ui/            # Reusable UI components
│   └── lib/               # Utilities, API clients
├── ai-agents-service/     # Python Flask Backend
│   ├── simulation/         # Core simulation engine
│   └── utils/             # LLM client, helpers
├── security-agent/        # Security scanning tool
├── tests/                 # Unit, integration, e2e tests
└── .github/workflows/     # CI/CD pipelines
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Python 3.11, Flask, SQLAlchemy |
| Database | SQLite (dev), PostgreSQL (prod) |
| Cache | Redis |
| Task Queue | Celery |
| Testing | Jest, pytest |

## Quick Start

```bash
# Frontend
cd /c/Users/DELL/pm-simulator
npm run dev

# Backend
cd /c/Users/DELL/pm-simulator/ai-agents-service
python app.py
```

## Module Documentation

- [Frontend](./src/CLAUDE.md)
- [Backend](./ai-agents-service/CLAUDE.md)
- [Security Agent](./security-agent/CLAUDE.md)

## Current Status

- **Frontend**: ~85% complete - UI refreshed with minimal clean design
- **Backend**: ~90% complete - Mock mode working, full LLM mode needs optimization
- **Security Agent**: ~95% complete - Awaits Telegram bot setup

## Key Features

1. **Rule-based Simulation** - 1000 personas, statistical metrics
2. **LLM-driven Simulation** - 50 agents, qualitative debates (mock mode ready)
3. **Security Scanning** - 50+ vulnerability patterns
4. **3D Visualizations** - CSS-based animations

## CI/CD

GitHub Actions workflow runs on push to `feature/*` branches.
Tests are configured to report but not block commits during development.

## Environment

Create `.env.local` from `.env.example` for local development.
