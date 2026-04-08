# Changelog

All notable changes to PM Simulator are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-08

### Added - v2.0 Core Features

#### Persona Builder
- Create up to 5 custom personas per simulation
- Define demographics, behavior traits, pain levels, tech savviness
- Persona-based simulation adaptation
- Visual persona cards with trait visualization
- API endpoints: `GET/POST /api/v2/simulations/{id}/personas`

#### Structured Fields Framework
- What/Who/Why/Impact/When framework for product briefs
- Collapsible sections with hide/show functionality
- Section-specific hint recommendations
- Database persistence for all framework content
- API endpoints: `GET/PUT /api/v2/simulations/{id}/framework`

#### Inline Hint System
- Contextual hints based on content analysis
- Content from "Inspired", "The Lean Startup", "The Mom Test"
- Pattern matching for hint relevance
- Source icons and explanations
- Toggle hints per section

#### Export Engine
- PDF export with @react-pdf/renderer
- Word Docx export with docx library
- Notion integration via Notion API
- Google Docs integration via Google Drive API
- Format selector with preview
- Download or direct share

#### Change Log Manager
- Track all changes to simulation briefs
- Author attribution and timestamps
- Before/after diff display
- Revert to previous versions
- JSON-based value storage for complex data

#### 3D Agent Visualization
- CSS3D-based agent network visualization
- Level of Detail (LOD) system for performance
- Cluster view for large agent populations
- Real-time state transitions (unaware → aware → signed_up → active → engaged/churned)
- Interactive agent inspection

### Added - Phase 7: Production Architecture

#### Analytics & Monitoring (7A)
- API logging middleware with response time tracking
- Performance monitoring with detailed metrics
- Health check endpoints
- User analytics dashboard foundation
- Database index optimization

#### Performance Optimization (7B)
- Query optimization with strategic indexes
- Caching layer for frequently accessed data
- Connection pooling for database and Redis
- Static file optimization
- Bundle size monitoring

#### Deployment Infrastructure (7D)
- Multi-stage Dockerfile.production
- Docker Compose production stack (frontend, backend, database, redis, nginx, celery)
- Rolling deployment script with health checks
- GitHub Actions CI/CD pipeline
- Nginx configuration with rate limiting
- Environment configuration templates

#### Documentation (7E)
- OpenAPI specification (docs/api/openapi.yml)
- Getting started guide (docs/guides/getting-started.md)
- Best practices guide (docs/guides/best-practices.md)
- Deployment guide (docs/developer/deployment-guide.md)
- Architecture documentation (docs/architecture/system-overview.md)
- Contributing guidelines (docs/developer/contributing.md)
- This changelog

### Changed

- Enhanced simulation engine with persona support
- Updated database schema with new tables (simulation_personas, framework_sections, change_logs)
- Improved API with v2 endpoints
- Enhanced frontend component organization (feature-based structure)
- Upgraded to Next.js 14 App Router

### Fixed

- Circular import issues in SQLAlchemy models (resolved with string references)
- Windows encoding issues in TypeScript files
- Test isolation with separate database connections
- TypeScript strict mode compliance

## [1.5.0] - 2026-03-15

### Added

- LLM-driven simulation mode with debating agents
- Ollama integration for local LLM execution
- Cloud LLM provider support (Anthropic, OpenAI)
- Real-time simulation progress via Server-Sent Events
- Simulation result caching with Redis

### Changed

- Refactored simulation engine for dual-mode support
- Enhanced API with streaming endpoints
- Updated frontend with real-time progress indicators

## [1.4.0] - 2026-03-01

### Added

- Industry-specific templates (SaaS, FinTech, Health, E-commerce, AI/ML)
- User authentication with JWT
- Simulation history dashboard
- Rate limiting on API endpoints

### Fixed

- Database connection issues in production
- Frontend build optimization

## [1.3.0] - 2026-02-15

### Added

- Rule-based simulation engine with 1000 autonomous agents
- Agent state machine (unaware → aware → signed_up → active → engaged/churned)
- Statistical persona generation
- NPS and satisfaction scoring
- Docker staging environment

## [1.2.0] - 2026-02-01

### Added

- Next.js 14 frontend
- Flask API backend
- PostgreSQL database support
- Celery task queue integration
- Basic simulation creation and results

## [1.1.0] - 2026-01-15

### Added

- Docker development environment
- SQLite database for development
- Basic user authentication
- Simulation wizard (4-step flow)

## [1.0.0] - 2026-01-01

### Added

- Initial release
- Basic product brief input
- Simple simulation results
- Dashboard foundation

## Migration Notes

### Upgrading to 2.0

1. **Database Migration Required**:
   ```bash
   cd /opt/pm-simulator
   ./deploy-production.sh
   ```
   Migration will run automatically during deployment.

2. **New Environment Variables** (add to `.env.production`):
   ```bash
   # Optional: LLM Configuration
   OLLAMA_URL=http://localhost:11434
   ANTHROPIC_API_KEY=your_key
   ```

3. **Redis Required**: v2.0 requires Redis for caching and Celery.

4. **Breaking Changes**:
   - API v1 endpoints deprecated (still functional but will be removed in v3.0)
   - Database schema changes (automatic migration)

## Deprecations

- **API v1** (`/api/simulation/*` without `/v2/` prefix): Will be removed in v3.0
- **Old export format**: Legacy export endpoints replaced by `/api/v2/simulations/{id}/export`

## Security Updates

| Version | CVE | Severity | Description |
|---------|-----|----------|-------------|
| 2.0.0 | - | - | Added rate limiting, input validation |
| 1.5.0 | - | - | JWT refresh token rotation |

## Performance Improvements

| Version | Metric | Before | After |
|---------|--------|--------|-------|
| 2.0.0 | Query time (simulation list) | 250ms | 45ms |
| 2.0.0 | Bundle size (main) | 1.2MB | 780KB |
| 1.5.0 | Simulation runtime (LLM mode) | 25min | 15min |

## Known Issues

- **2.0.0**: LLM mode requires 7GB RAM for qwen3.5 model (system has 6.9GB)
- **2.0.0**: Notion export requires OAuth setup (see docs)

## Contributors

Thanks to all contributors who made v2.0 possible!

- Core development: Claude Code + Arun Podili
- Architecture review: Community feedback
- Testing: Beta users

---

For unreleased changes, see the [main branch](https://github.com/arunpodili/pm-simulator/tree/main).
