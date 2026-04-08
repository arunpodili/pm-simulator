# Quick Reference

Common commands and patterns for PM Simulator development.

## Development Commands

### Start Development

```bash
# Terminal 1: Frontend
cd /c/Users/DELL/pm-simulator
npm run dev

# Terminal 2: Backend
cd /c/Users/DELL/pm-simulator/ai-agents-service
python app_v2.py

# Terminal 3: Redis (if using LLM/Celery)
redis-server
```

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd ai-agents-service
pytest ../tests/unit/ -v

# Specific test
pytest ../tests/unit/test_simulation.py::test_create_simulation -v

# With coverage
pytest ../tests/ -v --cov=app --cov-report=html
```

### Linting & Formatting

```bash
# Frontend
npm run lint
npm run format

# Python
cd ai-agents-service
flake8 .
black .
```

## API Endpoints

### Authentication

```bash
# Register
POST /api/auth/register
{ "email": "test@example.com", "password": "test123", "name": "Test User" }

# Login
POST /api/auth/login
{ "email": "test@example.com", "password": "test123" }

# Refresh token
POST /api/auth/refresh
{ "refresh_token": "..." }
```

### Simulations

```bash
# Create simulation
POST /api/simulation/llm/create
{
  "title": "Test Product",
  "brief": "A project management tool for remote teams",
  "industry": "saas",
  "mode": "rule_based",
  "fast_mode": true
}

# Run simulation
POST /api/simulation/{id}/run

# Get results
GET /api/simulation/{id}/results

# List simulations
GET /api/simulation/history?page=1&per_page=20

# Stream progress
GET /api/simulation/stream?simulation_id={id}
```

### Personas (v2)

```bash
# List personas
GET /api/v2/simulations/{id}/personas

# Create persona (max 5)
POST /api/v2/simulations/{id}/personas
{
  "name": "Sarah - CTO",
  "role": "CTO at mid-size startup",
  "pain_level": 4,
  "tech_savviness": 5,
  "purchase_urgency": 3,
  "demographics": { "company_size": "50-200", "industry": "tech" },
  "behavior_traits": ["early_adopter", "data_driven"]
}
```

### Framework (v2)

```bash
# Get all sections
GET /api/v2/simulations/{id}/framework

# Update section
PUT /api/v2/simulations/{id}/framework
{
  "section_type": "what",
  "content": "We are building a tool that...",
  "hints_applied": ["inspired_mvp"]
}
```

### Export (v2)

```bash
# Export simulation results
POST /api/v2/simulations/{id}/export
{
  "format": "pdf",  // or "docx", "notion", "google_docs"
  "include_visualizations": true,
  "sections": ["summary", "metrics", "insights"]
}
```

### Hints (v2)

```bash
# Get hints for context
GET /api/v2/simulations/{id}/hints?context=framework_what
```

## Database

### Common Queries

```sql
-- List user's simulations
SELECT * FROM simulations WHERE user_id = 1 ORDER BY created_at DESC;

-- Get simulation with personas
SELECT s.*, p.name, p.role, p.pain_level
FROM simulations s
LEFT JOIN simulation_personas p ON s.id = p.simulation_id
WHERE s.id = 1;

-- Get change log for simulation
SELECT * FROM change_logs
WHERE simulation_id = 1
ORDER BY created_at DESC;

-- Get framework sections
SELECT * FROM framework_sections
WHERE simulation_id = 1
ORDER BY section_type;
```

### Migration Commands

```bash
cd ai-agents-service

# Run all migrations
python -c "
import sys
sys.path.insert(0, '.')
from migrations.setup import run_migrations
run_migrations()
"

# Check migration status
python -c "
from database import db_manager
db_manager.init_engine()
print('Connected:', db_manager.engine)
"
```

## Docker

### Development

```bash
# Start all services
docker-compose -f docker-compose.staging.yml up --build

# View logs
docker-compose -f docker-compose.staging.yml logs -f

# Run commands in container
docker-compose -f docker-compose.staging.yml exec backend python -c "print('Hello')"

# Reset database
docker-compose -f docker-compose.staging.yml down -v
docker-compose -f docker-compose.staging.yml up --build
```

### Production

```bash
# Deploy
./deploy-production.sh

# View logs
docker-compose -f docker-compose.production.yml logs -f backend

# Restart service
docker-compose -f docker-compose.production.yml restart backend

# Scale workers
docker-compose -f docker-compose.production.yml up -d --scale celery=3
```

## Git

### Common Operations

```bash
# Create feature branch
git checkout -b feature/persona-avatars

# Commit with conventional format
git commit -m "feat(persona): add avatar upload support

- Add file upload component
- Store images as base64 in database
- Update persona card display

Closes #123"

# Push and create PR
git push -u origin feature/persona-avatars
gh pr create --title "feat: add persona avatars" --body "..."

# Update feature branch
git checkout main
git pull
git checkout feature/persona-avatars
git rebase main
```

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_ENABLE_LLM=true
NEXT_PUBLIC_ENABLE_EXPORTS=true
```

### Backend (.env)

```bash
# Database
DATABASE_URL=sqlite:///simulation.db
TEST_DATABASE_URL=sqlite:///test_simulation.db

# Redis
REDIS_URL=redis://localhost:6379/0

# LLM
OLLAMA_URL=http://localhost:11434
ANTHROPIC_API_KEY=sk-ant-...

# Security
JWT_SECRET_KEY=your-secret
SECRET_KEY=your-secret
```

## Debugging

### Frontend

```typescript
// Add breakpoint
debugger;

// Console logging
console.log('Debug:', variable);
console.table(arrayData);

// React DevTools
// Install browser extension
```

### Backend

```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or IPython (better)
import IPython; IPython.embed()

# Logging
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Debug info: {data}")
```

### Common Issues

**"Port already in use"**:
```bash
lsof -i :3000  # or :5001
kill -9 <PID>
```

**"Module not found"**:
```bash
rm -rf node_modules && npm install
# or
rm -rf ai-agents-service/__pycache__ && pip install -r requirements.txt
```

**"Database locked"** (SQLite):
```bash
lsof simulation.db
kill -9 <PID>
```

## Testing Patterns

### Frontend Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    const mockFn = jest.fn()
    render(<Component onClick={mockFn} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalled()
  })
})
```

### Backend Test Template

```python
import pytest
from app_v2 import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_endpoint(client):
    response = client.post('/api/v2/endpoint', json={'key': 'value'})
    assert response.status_code == 201
    data = response.get_json()
    assert data['key'] == 'value'
```

## Useful Links

- **Local Dev**: http://localhost:3000
- **API Docs**: http://localhost:5001/api/docs (if enabled)
- **GitHub**: https://github.com/arunpodili/pm-simulator
- **Staging**: http://localhost (with docker-compose)
