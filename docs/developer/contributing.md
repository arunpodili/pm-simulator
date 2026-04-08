# Contributing to PM Simulator

Thank you for your interest in contributing to PM Simulator! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **Python**: 3.11 or higher
- **Docker**: (optional, for database/cache)
- **Git**: 2.x or higher

### Quick Start

```bash
# Clone the repository
git clone https://github.com/arunpodili/pm-simulator.git
cd pm-simulator

# Install frontend dependencies
npm install

# Install backend dependencies
cd ai-agents-service
pip install -r requirements.txt
cd ..

# Setup environment
cp .env.local.example .env.local
cp ai-agents-service/.env.example ai-agents-service/.env

# Start development servers
npm run dev          # Next.js (starts on :3000)
# In another terminal:
cd ai-agents-service
python app_v2.py   # Flask API (starts on :5001)
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
pm-simulator/
├── src/                      # Next.js frontend
│   ├── app/                  # App router pages
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   └── lib/                  # Utilities
├── ai-agents-service/        # Python Flask backend
│   ├── api_v2/               # API routes
│   ├── simulation/           # Simulation engines
│   └── utils/                # Utilities
├── tests/                    # Test files
├── docs/                     # Documentation
└── .github/                  # CI/CD workflows
```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

Example: `feature/persona-avatar-upload`

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change, no behavior change
- `test`: Adding tests
- `chore`: Build, dependencies, etc.

Examples:
```
feat(persona): add avatar upload to persona builder

Users can now upload images to represent their personas.
Images are stored in the database as base64.

Closes #123
```

```
fix(simulation): handle missing persona attributes

Previously, simulations would fail if a persona was missing
demographics. Now we provide sensible defaults.

Fixes #456
```

## Code Style

### TypeScript/JavaScript

We use ESLint and Prettier. Run before committing:

```bash
npm run lint
npm run format
```

### Python

We follow PEP 8. Run linting:

```bash
cd ai-agents-service
flake8 .
black .
```

### Code Review Checklist

Before submitting a PR:

- [ ] Tests pass: `npm test` and `pytest`
- [ ] Linting passes: `npm run lint`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Code follows existing patterns
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention

## Testing

### Frontend Tests

```bash
# Run all tests
npm test

# Run specific file
npm test -- PersonaCard.test.tsx

# Watch mode
npm test -- --watch
```

### Backend Tests

```bash
cd ai-agents-service

# Run all tests
pytest ../tests/ -v

# Run specific file
pytest ../tests/unit/test_simulation.py -v

# Run with coverage
pytest ../tests/ -v --cov=app --cov-report=html
```

### Writing Tests

#### Frontend Example

```typescript
// src/components/persona-builder/__tests__/PersonaCard.test.tsx
import { render, screen } from '@testing-library/react'
import { PersonaCard } from '../PersonaCard'

describe('PersonaCard', () => {
  it('renders persona name and role', () => {
    const persona = {
      id: 1,
      name: 'Sarah',
      role: 'CTO',
      pain_level: 4,
      tech_savviness: 5
    }

    render(<PersonaCard persona={persona} />)

    expect(screen.getByText('Sarah')).toBeInTheDocument()
    expect(screen.getByText('CTO')).toBeInTheDocument()
  })
})
```

#### Backend Example

```python
# tests/unit/test_persona_api.py
import pytest
from app_v2 import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_create_persona(client):
    response = client.post('/api/v2/simulations/1/personas', json={
        'name': 'Test Persona',
        'role': 'Developer',
        'pain_level': 3,
        'tech_savviness': 4
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Test Persona'
```

## Adding New Features

### Example: Adding a New Export Format

1. **Backend**:
   - Add generator in `ai-agents-service/utils/export/`
   - Add endpoint in `ai-agents-service/api_v2/export.py`
   - Add tests in `tests/unit/test_export.py`

2. **Frontend**:
   - Add format option in `src/components/export/FormatSelector.tsx`
   - Add generator call in `src/lib/export/`
   - Add tests

3. **Documentation**:
   - Update `docs/api/openapi.yml`
   - Update `docs/guides/best-practices.md`

### Example: Adding a New Simulation Engine

1. Create engine in `ai-agents-service/simulation/your_engine.py`
2. Add mode to `simulation/models.py`
3. Update `simulation/simulation_orchestrator.py`
4. Add API endpoint
5. Update frontend mode selector
6. Add comprehensive tests
7. Update documentation

## Database Migrations

When changing models:

```bash
cd ai-agents-service

# Generate migration (manual - we don't use Alembic yet)
# Create file: migrations/004_add_new_field.py

# Run migration
python -c "
import sys
sys.path.insert(0, '.')
from migrations.setup import run_migrations
run_migrations()
"
```

Migration file template:

```python
"""Migration: Add new field to simulations table

Revision: 004
Revises: 003
"""

from sqlalchemy import text

def upgrade(engine):
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE simulations
            ADD COLUMN new_field VARCHAR(255)
        """))

def downgrade(engine):
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE simulations
            DROP COLUMN new_field
        """))
```

## Environment Variables

### Frontend

Create `.env.local`:

```
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5001

# Feature flags
NEXT_PUBLIC_ENABLE_LLM=true
NEXT_PUBLIC_ENABLE_EXPORTS=true
```

### Backend

Create `ai-agents-service/.env`:

```
# Database
DATABASE_URL=sqlite:///simulation.db

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# LLM
OLLAMA_URL=http://localhost:11434
# ANTHROPIC_API_KEY=sk-ant-...

# Security
JWT_SECRET_KEY=dev-secret-key
SECRET_KEY=dev-secret-key
```

## Debugging

### Frontend

1. Use React DevTools browser extension
2. Add `console.log` with care (remove before PR)
3. Use `debugger;` statements for breakpoints

### Backend

```python
# Add to your code
import pdb; pdb.set_trace()

# Or use IPython for better experience
import IPython; IPython.embed()
```

### Logs

```bash
# Frontend
npm run dev  # Logs in terminal

# Backend
python app_v2.py  # Logs in terminal
# Or with more verbosity:
LOG_LEVEL=DEBUG python app_v2.py
```

## Common Issues

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules && npm install
# or
rm -rf ai-agents-service/__pycache__ && pip install -r requirements.txt
```

### "Database locked" (SQLite)

```bash
# Kill any hanging processes
lsof simulation.db  # Get PID
kill -9 <PID>
```

### "Port already in use"

```bash
# Find and kill process
lsof -i :3000  # or :5001
kill -9 <PID>
```

### TypeScript errors

```bash
# Check types
npx tsc --noEmit

# If caching issues
rm -rf .next
npm run dev
```

## Pull Request Process

1. **Create a branch**: `git checkout -b feature/description`
2. **Make changes**: Write code + tests
3. **Test locally**: Run full test suite
4. **Commit**: Follow conventional commit format
5. **Push**: `git push -u origin feature/description`
6. **Open PR**: Use PR template
7. **Review**: Address reviewer feedback
8. **Merge**: Squash and merge by maintainer

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.logs left
- [ ] PR title follows convention

## Screenshots (if UI change)
[Include screenshots]
```

## Release Process

Maintainers only:

1. Update version in `package.json` and backend
2. Update `CHANGELOG.md`
3. Create release branch: `release/v2.x.x`
4. Run full test suite
5. Deploy to staging
6. Tag release: `git tag -a v2.x.x -m "Release version 2.x.x"`
7. Push tag: `git push origin v2.x.x`
8. GitHub Actions auto-deploys to production

## Questions?

- **Slack**: [Join our community](https://pmsimulator.slack.com)
- **Discord**: [PM Simulator Discord](https://discord.gg/pmsimulator)
- **Issues**: [GitHub Issues](https://github.com/arunpodili/pm-simulator/issues)
- **Email**: dev@pm-simulator.com

## Code of Conduct

Be respectful, constructive, and welcoming. We value diverse perspectives and collaborative problem-solving.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
