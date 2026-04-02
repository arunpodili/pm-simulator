# Backend (Python Flask)

**Location:** `ai-agents-service/`  
**Last Updated:** 2026-04-03

## Architecture Overview

Flask-based REST API with async task processing via Celery and Redis.

```
ai-agents-service/
├── app.py                    # Main Flask application
├── app_v2.py                 # Enhanced API with v2 endpoints
├── requirements.txt          # Base dependencies
├── requirements-production.txt # Production dependencies
├── simulation/               # Core simulation modules
│   ├── simulation_engine.py  # Rule-based simulation
│   ├── llm_simulation_engine.py # LLM-driven debates
│   ├── user_agent.py         # Agent behavior logic
│   ├── models.py             # SQLAlchemy models
│   ├── persona_generator.py  # Statistical personas
│   └── persona_generator_llm.py # LLM-based personas
├── utils/                    # Utilities
│   └── llm_client.py         # Ollama/Claude LLM routing
├── api_v2/                   # API v2 routes
│   └── simulations.py
├── tests/                    # Test files (moved to root tests/)
└── migrations/               # Database migrations
```

## Key Modules

### Simulation Engine

**Rule-based** (`simulation_engine.py`):
- 1000 personas, statistical metrics
- ~5 minutes per simulation
- Metrics: conversion, NPS, satisfaction

**LLM-driven** (`llm_simulation_engine.py`):
- 50 agents, qualitative debates
- Mock mode: ~2 seconds (no LLM calls)
- Full mode: ~15 minutes (requires Ollama or Claude API)

### LLM Client

`utils/llm_client.py`:
- Role-based routing (extractor, architect, swarm, report)
- Supports Ollama local models
- Fallback to cloud APIs (Kimi, Qwen)
- JSON extraction with robust error handling

### Database Models

`simulation/models.py`:
- `Simulation` - Simulation runs
- `UserPersona` - Virtual user definitions
- `PersonaType` - ENTHUSIAST, PRAGMATIST, SKEPTIC, LAGGARD

## API Endpoints

Base URL: `http://localhost:5001`

### Health
```bash
GET /api/simulation/health
```

### Simulation
```bash
# Create simulation
POST /api/simulation/llm/create
Body: {"brief": "...", "fast_mode": true}

# Run simulation
POST /api/simulation/llm/{id}/run

# Get results
GET /api/simulation/{id}/llm/results

# List simulations
GET /api/simulation/history
```

## Running Locally

```bash
cd ai-agents-service

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py       # Port 5001

# Run with production config
python app_v2.py    # Enhanced features
```

## Environment Variables

```bash
# Database
DATABASE_URL=sqlite:///simulation.db
TEST_DATABASE_URL=sqlite:///test_simulation.db

# Redis (for Celery)
REDIS_URL=redis://localhost:6379/0

# LLM Configuration
OLLAMA_URL=http://localhost:11434
ANTHROPIC_API_KEY=        # Optional

# Security
JWT_SECRET_KEY=your-secret-key
```

## Dependencies

```
Flask>=2.3.0
Flask-CORS>=4.0.0
SQLAlchemy>=2.0.0
psycopg2-binary>=2.9.0
Celery[redis]>=5.3.0
redis>=4.6.0
numpy>=1.24.0
pandas>=2.0.0
PyJWT>=2.8.0
pytest>=7.4.0
```

## Testing

```bash
# Unit tests
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# Performance benchmarks
pytest tests/benchmark/ -v
```

## Deployment

### Docker
```bash
docker build -f Dockerfile.staging -t pm-simulator-api .
docker run -p 5001:5001 pm-simulator-api
```

### Production
- Uses Gunicorn WSGI server
- Requires PostgreSQL and Redis
- Configure secrets via environment variables

## Known Limitations

- **qwen3.5 model**: Requires 7GB RAM (system has 6.9GB)
- **LLM mode**: JSON parsing can be unreliable with smaller models
- **Celery**: Requires Redis running separately

## Future Enhancements

- [ ] Auto-fix suggestions with code generation
- [ ] GitHub Security tab integration
- [ ] Dependency vulnerability scanning
- [ ] Custom rules engine
