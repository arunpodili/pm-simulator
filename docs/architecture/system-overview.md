# System Architecture Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Web       │  │   Mobile     │  │    API       │  │   Export     │    │
│  │   Browser    │  │   (Future)   │  │   Clients    │  │   Download   │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
└─────────┼─────────────────┼─────────────────┼────────────────────────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────────────┐
│                            Load Balancer (Nginx)                         │
│                         - SSL termination                                  │
│                         - Rate limiting                                    │
│                         - Static file serving                              │
└────────────┬──────────────────────────────┬───────────────────────────────┘
             │                              │
    ┌────────▼────────┐            ┌────────▼────────┐
    │   Frontend      │            │    Backend      │
    │   (Next.js)     │            │    (Flask)      │
    │                 │            │                 │
    │  • React 18     │            │  • REST API     │
    │  • TypeScript   │            │  • WebSocket    │
    │  • Tailwind     │            │  • JWT Auth     │
    │  • Framer       │            │  • Rate Limit   │
    │  • SWR Cache    │            │  • Validation   │
    └────────┬────────┘            └────────┬────────┘
             │                              │
             │      ┌──────────────────┐    │
             └──────►                  ◄────┘
                    │    Redis Cache   │
                    │                  │
                    │  • Session Store │
                    │  • Celery Broker │
                    │  • Query Cache   │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │   Celery Worker │
                    │                 │
                    │  • Simulations  │
                    │  • Exports      │
                    │  • Analytics    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │                 │
                    │  • Users        │
                    │  • Simulations  │
                    │  • Results      │
                    │  • Personas     │
                    └─────────────────┘
```

## Component Responsibilities

### Frontend (Next.js 14)

**Location**: `src/`

**Primary Responsibilities**:
1. **User Interface**: Render simulation forms, results dashboards, 3D visualizations
2. **State Management**: Handle user sessions, simulation drafts, form state
3. **API Integration**: Communicate with backend via REST API
4. **Export Generation**: Generate PDF, Docx on client-side where possible
5. **Real-time Updates**: Connect to SSE streams for simulation progress

**Key Components**:
- **PersonaBuilder**: Create up to 5 custom user personas
- **FrameworkEditor**: Structured What/Who/Why/Impact/When fields
- **SimulationWizard**: 4-step simulation creation flow
- **ResultsDashboard**: Metrics display with 3D agent visualization
- **ExportEngine**: Multi-format export generation

**Tech Stack**:
- Next.js App Router
- React 18 with TypeScript
- Tailwind CSS + Radix UI
- Framer Motion animations
- SWR for data fetching
- @react-pdf/renderer for PDF generation

### Backend (Flask)

**Location**: `ai-agents-service/`

**Primary Responsibilities**:
1. **API Endpoints**: RESTful API for all frontend operations
2. **Authentication**: JWT-based auth with refresh tokens
3. **Simulation Orchestration**: Manage simulation lifecycle
4. **LLM Integration**: Route to Ollama or cloud providers
5. **Task Queue**: Celery integration for background processing

**Key Modules**:

```
app_v2.py
    ├── Auth Blueprint (/api/auth/*)
    ├── Simulation Blueprint (/api/simulation/*)
    └── API v2 Blueprint (/api/v2/*)
        ├── Simulations
        ├── Personas
        ├── Framework
        ├── Export
        └── Hints

simulation/
    ├── simulation_engine.py      # Rule-based: 1000 agents
    ├── llm_simulation_engine.py  # LLM-driven: 50 debating agents
    ├── user_agent.py             # Agent behavior logic
    ├── models.py                 # SQLAlchemy models
    └── persona_generator.py      # Statistical persona generation
```

### Database (PostgreSQL)

**Schema Overview**:

```sql
-- Core Tables
users
├── id, email, password_hash, name, created_at

simulations
├── id, user_id, title, brief, industry, mode, status
├── created_at, completed_at

simulation_personas (max 5 per simulation)
├── id, simulation_id, name, role
├── pain_level, tech_savviness, purchase_urgency
├── demographics (JSONB), behavior_traits[]

framework_sections
├── id, simulation_id, section_type
├── content, hints_applied[], updated_at

change_logs
├── id, simulation_id, author_id, change_type
├── field, old_value (JSONB), new_value (JSONB)
├── reason, impact, created_at

simulation_results
├── id, simulation_id
├── conversion_rate, churn_rate, nps_score, satisfaction_score
├── insights[], agent_network (JSONB)
```

**Indexes**:
- `idx_sim_user_created`: User's simulation list queries
- `idx_personas_sim_id`: Persona lookups by simulation
- `idx_framework_sim_id`: Framework section queries
- `idx_changelog_sim_id`: Audit trail queries

### Cache (Redis)

**Use Cases**:

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `session:{token}` | 15 min | JWT token validation |
| `user:{id}` | 1 hour | User profile caching |
| `simulations:{user_id}:{page}` | 5 min | Dashboard pagination |
| `results:{sim_id}` | 30 min | Simulation results |
| `hints:{context}` | 24 hours | Hint content (static) |
| `network:{sim_id}` | 30 min | Agent network graph |

### Task Queue (Celery + Redis)

**Background Tasks**:

1. **Simulation Execution**:
   ```python
   @celery.task(bind=True)
   def run_simulation(self, simulation_id, mode='rule_based'):
       # Update progress via self.update_state()
       # Run simulation engine
       # Store results in database
   ```

2. **Export Generation**:
   ```python
   @celery.task
   def generate_export(simulation_id, format, options):
       # Generate PDF/Docx/Notion/Google Docs
       # Upload to storage
       # Return download URL
   ```

3. **Analytics Aggregation**:
   ```python
   @celery.task
   def aggregate_daily_analytics():
       # Roll up metrics for dashboard
       # Update materialized views
   ```

## Data Flow

### Creating a Simulation

```
User → Frontend → POST /api/v2/simulations
                    ↓
              Backend: Validate input
                    ↓
              Database: Create simulation record
                    ↓
              Backend: Return 201 Created
                    ↓
              Frontend: Redirect to simulation detail page
```

### Running a Simulation

```
User → Frontend → POST /api/simulation/{id}/run
                    ↓
              Backend: Queue Celery task
                    ↓
              Celery: Start simulation process
                    ↓
              User ← SSE Stream ← Celery (progress updates)
                    ↓
              Celery: Store results in database
                    ↓
              User ← Frontend ← Notification (complete)
```

### Exporting Results

```
User → Frontend → POST /api/v2/simulations/{id}/export
                    ↓
              Backend: Queue Celery task
                    ↓
              Celery Worker:
                - Fetch simulation + results from DB
                - Generate PDF (client-side or server-side)
                - Upload to storage (if applicable)
                    ↓
              User ← Download URL ← Backend
```

## Authentication Flow

```
Login:
  POST /api/auth/login {email, password}
         ↓
    Backend: Verify credentials
         ↓
    JWT: Generate access (15 min) + refresh (7 day) tokens
         ↓
    Frontend: Store in httpOnly cookies

Authenticated Request:
  Request → Authorization: Bearer {access_token}
         ↓
    Backend: Verify JWT signature + expiry
         ↓
    If expired: Return 401
         ↓
    Frontend: POST /api/auth/refresh {refresh_token}
         ↓
    Backend: Issue new access token
         ↓
    Frontend: Retry original request
```

## Scaling Strategy

### Horizontal Scaling

**Frontend**:
- Static files served from CDN
- Next.js app can run multiple instances behind load balancer

**Backend**:
- Stateless Flask app scales horizontally
- Session data in Redis (shared across instances)

**Celery Workers**:
- Scale based on queue depth
- Auto-scaling: 2-10 workers based on load

### Database Scaling

**Current**: Single PostgreSQL instance
**Future**:
- Read replica for reporting queries
- Connection pooling with PgBouncer
- Horizontal partitioning by user_id for large tables

### Caching Strategy

**Current**: Single Redis instance
**Future**:
- Redis Cluster for high availability
- Separate cache instances (sessions vs query results)

## Security Architecture

### Layers

```
1. Edge (Nginx)
   - Rate limiting: 10 req/s per IP
   - DDoS protection
   - SSL termination

2. Application (Flask)
   - JWT validation
   - Input sanitization (Pydantic)
   - SQL injection prevention (SQLAlchemy ORM)

3. Data (PostgreSQL)
   - Row-level security (planned)
   - Encrypted at rest (AWS RDS)
   - Connection encryption

4. Transport
   - HTTPS only (HSTS enabled)
   - Secure cookies (httpOnly, SameSite)
```

### Secrets Management

Development:
- `.env` files (not committed)
- Example files in repo

Production:
- Environment variables
- Docker secrets (swarm mode)
- AWS Secrets Manager (future)

## Monitoring Points

### Metrics

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| API latency | Flask middleware | P95 > 500ms |
| Error rate | Sentry | > 1% of requests |
| DB connections | PostgreSQL | > 80% of max |
| Queue depth | Celery | > 100 pending |
| Export time | Celery task | > 5 minutes |

### Logging

**Structured logs** (JSON format):
```json
{
  "timestamp": "2026-04-08T10:30:00Z",
  "level": "INFO",
  "service": "backend",
  "request_id": "uuid",
  "user_id": "123",
  "method": "POST",
  "path": "/api/simulation/1/run",
  "duration_ms": 150,
  "status_code": 202
}
```

## Future Architecture

### Near-term (v2.1)

1. **WebSocket for Real-time Collaboration**: Multiple users editing same simulation
2. **GraphQL API**: More flexible queries, reduce over-fetching
3. **Edge Functions**: Deploy hint system to edge (lower latency)

### Long-term (v3.0)

1. **Microservices**: Split simulation engine to separate service
2. **Event Sourcing**: Full audit trail of all changes
3. **Multi-region**: Deploy to EU, Asia for lower latency
4. **Kubernetes**: Replace Docker Compose with K8s

## API Gateway (Future)

```
Client → Kong/AWS API Gateway → Services
                              ├── Auth Service
                              ├── Simulation Service
                              ├── Export Service
                              └── Analytics Service
```
