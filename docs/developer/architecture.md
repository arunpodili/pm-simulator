# PM Simulator Architecture

## Overview

PM Simulator is a full-stack application built with:
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Python Flask with SQLAlchemy
- **Database**: PostgreSQL (production) / SQLite (development)
- **Cache/Queue**: Redis + Celery
- **LLM**: Ollama (local) or cloud providers (OpenAI, Anthropic)

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (Load Balancer)                    │
│                         - Rate limiting                           │
│                         - SSL termination                         │
└──────────────┬────────────────────────────────┬───────────────┘
               │                                │
        ┌──────▼──────┐                  ┌──────▼──────┐
        │   Frontend  │                  │   Backend   │
        │  (Next.js)  │◄────────────────►│   (Flask)   │
        │   Port 3000 │    REST API /    │   Port 5001 │
        └─────────────┘     WebSocket    └──────┬──────┘
                                                  │
                       ┌──────────────────────────┼──────────────────────────┐
                       │                          │                          │
                 ┌─────▼─────┐            ┌──────▼──────┐           ┌──────▼──────┐
                 │ PostgreSQL│            │    Redis    │           │   Celery    │
                 │   Port    │            │   Port      │           │   Workers   │
                 │   5432    │            │   6379      │           │             │
                 └───────────┘            └─────────────┘           └─────────────┘
```

## Frontend Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4 + CSS variables for theming
- **Components**: Radix UI primitives + custom components
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State**: React hooks + Context API
- **Data Fetching**: SWR for caching/revalidation

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles + Tailwind
│   ├── simulate/                 # Simulation wizard (4 steps)
│   │   └── page.tsx
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx
│   ├── results/                  # Simulation results
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/                      # Next.js API routes (if any)
├── components/
│   ├── ui/                       # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── persona-builder/          # Persona Builder feature
│   │   ├── PersonaCard.tsx
│   │   ├── PersonaForm.tsx
│   │   └── PersonaList.tsx
│   ├── structured-fields/        # Structured Fields feature
│   │   └── FrameworkSection.tsx
│   ├── hints/                    # Hint System feature
│   │   ├── InlineHint.tsx
│   │   └── HintBadge.tsx
│   ├── export/                   # Export Engine feature
│   │   ├── ExportDialog.tsx
│   │   └── FormatSelector.tsx
│   ├── change-log/               # Change Log feature
│   │   ├── ChangeLogPanel.tsx
│   │   └── ChangeTimeline.tsx
│   └── 3d-visualization/         # 3D Visualization feature
│       ├── OptimizedAgentNetwork.tsx
│       └── AgentCluster.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useSimulation.ts
│   ├── useAgentSimulation.ts
│   └── useToast.ts
├── lib/                          # Utilities and configs
│   ├── utils.ts                  # General utilities
│   ├── export/                   # Export generators
│   │   ├── pdf-generator.tsx
│   │   ├── docx-generator.ts
│   │   └── notion-client.ts
│   └── hints/
│       └── hint-database.ts      # Hint content database
├── types/                        # TypeScript definitions
│   └── index.ts
└── components.json               # shadcn/ui config
```

### Key Design Patterns

1. **Feature-Based Organization**: Components grouped by feature, not by type
2. **Custom Hooks**: Business logic extracted into reusable hooks
3. **SWR for Data Fetching**: Caching, revalidation, deduplication
4. **Optimistic UI**: Immediate feedback before server confirmation

## Backend Architecture

### Tech Stack
- **Framework**: Flask 3.0
- **ORM**: SQLAlchemy 2.0
- **Authentication**: PyJWT with refresh tokens
- **Task Queue**: Celery 5.3 with Redis broker
- **Rate Limiting**: Flask-Limiter
- **Caching**: Flask-Caching with Redis

### Directory Structure

```
ai-agents-service/
├── app.py                        # Basic Flask app (legacy)
├── app_v2.py                     # Enhanced app with v2 API
├── config.py                     # Configuration classes
├── database.py                   # SQLAlchemy setup
├── requirements.txt            # Dependencies
├── requirements-production.txt   # Prod dependencies
├── simulation/                   # Core simulation modules
│   ├── __init__.py
│   ├── models.py                 # SQLAlchemy models
│   ├── simulation_engine.py      # Rule-based simulation
│   ├── llm_simulation_engine.py  # LLM-driven simulation
│   ├── user_agent.py             # Agent behavior logic
│   ├── persona_generator.py      # Statistical personas
│   └── persona_generator_llm.py # LLM-based personas
├── api_v2/                       # API v2 routes
│   ├── __init__.py
│   ├── simulations.py
│   ├── personas.py
│   ├── framework.py
│   ├── export.py
│   └── hints.py
├── utils/                        # Utilities
│   ├── __init__.py
│   ├── llm_client.py             # LLM routing (Ollama/Cloud)
│   └── cache.py                  # Redis caching utilities
├── migrations/                   # Database migrations
│   └── ...
└── tests/                        # Test files (symlinked to root tests/)
```

### API Layer Structure

```python
# api_v2/simulations.py
from flask import Blueprint

simulations_bp = Blueprint('simulations', __name__, url_prefix='/api/simulation')

@simulations_bp.route('/llm/create', methods=['POST'])
def create_simulation():
    """Create new simulation."""
    pass

@simulations_bp.route('/<int:id>/run', methods=['POST'])
def run_simulation(id):
    """Start simulation."""
    pass
```

### Simulation Engines

#### Rule-Based Engine (`simulation_engine.py`)

```
Input: Product brief + personas (or generated)
      ↓
Generate: 1000 statistical agents with:
  - Demographics (industry, company size, role)
  - Behavioral traits (risk tolerance, tech adoption)
  - Preferences (price sensitivity, feature priorities)
      ↓
Simulate: Time-based evolution (90 days)
  - Each agent: unaware → aware → signed_up → active → engaged/churned
  - Probabilities based on product-market fit alignment
      ↓
Output: Metrics + agent timelines + insights
```

#### LLM-Driven Engine (`llm_simulation_engine.py`)

```
Input: Product brief
      ↓
Generate: 50 detailed personas via LLM
  - Name, role, demographics
  - Pain points, goals, objections
      ↓
Simulation rounds (5 iterations):
  - Agents debate product value
  - LLM judges sentiment and purchase likelihood
  - Update agent states based on debate outcomes
      ↓
Output: Qualitative debates + network relationships + insights
```

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Simulations
CREATE TABLE simulations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    brief TEXT NOT NULL,
    industry VARCHAR(50),
    mode VARCHAR(20) CHECK (mode IN ('rule_based', 'llm')),
    status VARCHAR(20) CHECK (status IN ('draft', 'running', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Personas (up to 5 per simulation)
CREATE TABLE simulation_personas (
    id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    pain_level INTEGER CHECK (pain_level BETWEEN 1 AND 5),
    tech_savviness INTEGER CHECK (tech_savviness BETWEEN 1 AND 5),
    purchase_urgency INTEGER CHECK (purchase_urgency BETWEEN 1 AND 5),
    demographics JSONB,
    behavior_traits TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Framework Sections (What/Who/Why/Impact/When)
CREATE TABLE framework_sections (
    id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE,
    section_type VARCHAR(20) CHECK (section_type IN ('what', 'who', 'why', 'impact', 'when')),
    content TEXT NOT NULL,
    hints_applied TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Change Logs
CREATE TABLE change_logs (
    id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id),
    change_type VARCHAR(50) CHECK (change_type IN ('edit', 'revert', 'hint_applied', 'export')),
    field VARCHAR(255),
    old_value JSONB,
    new_value JSONB,
    reason TEXT,
    impact TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Simulation Results
CREATE TABLE simulation_results (
    id SERIAL PRIMARY KEY,
    simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE,
    conversion_rate FLOAT,
    churn_rate FLOAT,
    nps_score FLOAT,
    satisfaction_score FLOAT,
    insights TEXT[],
    agent_network JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_sim_user_created ON simulations(user_id, created_at);
CREATE INDEX idx_sim_status ON simulations(status);
CREATE INDEX idx_personas_sim_id ON simulation_personas(simulation_id);
CREATE INDEX idx_framework_sim_id ON framework_sections(simulation_id);
CREATE INDEX idx_changelog_sim_id ON change_logs(simulation_id);
CREATE INDEX idx_results_sim_id ON simulation_results(simulation_id);
```

## Authentication Flow

```
User Login/Register
      ↓
Server validates credentials
      ↓
Generate JWT (15 min expiry) + Refresh token (7 days)
      ↓
Store tokens in httpOnly cookies (or localStorage for SPA)
      ↓
Subsequent requests: JWT in Authorization header
      ↓
Server verifies JWT signature + expiry
      ↓
If expired: Use refresh token to get new JWT
```

## Caching Strategy

| Data Type | Cache Key | TTL | Invalidation |
|-----------|-----------|-----|--------------|
| User profile | `user:{id}` | 1 hour | On profile update |
| Simulation list | `simulations:{user_id}:{page}` | 5 min | On new simulation |
| Simulation results | `results:{sim_id}` | 1 hour | On simulation complete |
| Hints database | `hints:{context}` | 24 hours | Never (static) |
| Agent network | `network:{sim_id}` | 30 min | On simulation complete |

## Deployment Architecture

### Docker Stack

```yaml
# Production (docker-compose.production.yml)
services:
  nginx:        # Load balancer, static file serving
  frontend:     # Next.js (production build)
  backend:      # Flask + Gunicorn
  database:     # PostgreSQL 15
  redis:        # Redis 7 (cache + Celery broker)
  celery:       # Background task workers
  celery-beat:  # Scheduled tasks
```

### Scaling Strategy

- **Stateless backend**: Can scale horizontally behind nginx
- **Celery workers**: Scale based on simulation queue depth
- **Database**: Primary + read replica for reporting queries
- **Redis**: Cluster mode for high availability

## Monitoring & Observability

### Key Metrics

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| API response time | Flask middleware | >500ms p95 |
| Simulation queue depth | Celery | >100 pending |
| Error rate | Sentry | >1% of requests |
| Database connections | PostgreSQL | >80% max |
| Frontend build size | CI/CD | >1MB JS bundle |

### Logging Levels

- **DEBUG**: Development only, detailed SQL, LLM prompts
- **INFO**: Production default, request/response summary, key events
- **WARNING**: Anomalies, slow queries, rate limit hits
- **ERROR**: Exceptions, failed simulations, auth failures

## Security Considerations

1. **Authentication**: JWT with short expiry, refresh token rotation
2. **Rate Limiting**: 10 req/s general, 5 req/min auth endpoints
3. **Input Validation**: Pydantic schemas for all API inputs
4. **SQL Injection**: SQLAlchemy ORM (parameterized queries)
5. **XSS**: React auto-escaping, sanitize user input
6. **CSRF**: SameSite cookies, CORS whitelist
7. **Secrets**: Environment variables, never committed

## Performance Optimizations

### Frontend
- Code splitting by route
- Image optimization (next/image)
- Tree shaking for unused code
- CDN for static assets

### Backend
- Database connection pooling
- Query result caching with Redis
- Async simulation processing via Celery
- N+1 query prevention (eager loading)

### Database
- Strategic indexes on query patterns
- Query result pagination
- JSONB for flexible schema (hints, insights)
- Connection pooling (SQLAlchemy pool)

## Development Guidelines

### Adding a New Feature

1. **Backend**: Add model → migration → API endpoint → tests
2. **Frontend**: Add types → API client → component → hook → tests
3. **Integration**: End-to-end test → documentation update

### Code Review Checklist

- [ ] Tests cover new functionality
- [ ] API follows existing patterns
- [ ] Database migrations are reversible
- [ ] No N+1 queries
- [ ] Frontend uses existing UI components
- [ ] Error handling in place
- [ ] Documentation updated

## Future Architecture Considerations

1. **Microservices**: Split simulation engine to separate service
2. **GraphQL**: Replace REST for more flexible frontend queries
3. **WebSocket**: Real-time collaboration on simulations
4. **Edge Functions**: Deploy hint system to edge for lower latency
