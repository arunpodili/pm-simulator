# PM Simulator v2.0 - Product Management Training & Validation Platform

A production-ready platform for product managers to **simulate, validate, and test** their product ideas before going live. Built with AI-powered market simulation, real-time analytics, and comprehensive API integration.

## 🎯 What This Is

PM Simulator v2.0 helps product managers:
- **Simulate product launches** with AI-powered virtual users (10K+ simulated users)
- **Validate pricing strategies** before building
- **Test market fit** with realistic market dynamics
- **Get actionable insights** on conversion, churn, and revenue
- **Practice PM skills** with guided templates and expert content
- **Train and learn** through community case studies

## ✨ Key Features (v2.0)

### 1. AI-Powered Product Simulation
Simulate your product before writing code:
- **10K+ virtual users** with realistic behavior
- **Market dynamics** simulation (competition, pricing sensitivity)
- **Real-time results** with conversion, churn, revenue metrics
- **Streaming progress** with live insights
- **4-step guided wizard**: Define → Configure → Simulate → Analyze

### 2. Authentication & User Management
Production-ready auth system:
- JWT-based authentication
- Protected routes and dashboards
- User profiles and simulation history
- Secure token refresh

### 3. Simulation Dashboard
Track all your simulations:
- Filter by status (completed, running, failed)
- Quick stats overview
- Detailed results with metrics
- Export capabilities

### 4. API Integration
Full API for external integrations:
- **API Keys**: Generate and manage access keys
- **Webhooks**: Real-time event notifications
- **REST API**: Complete CRUD for simulations
- **Documentation**: Built-in API docs

### 5. Industry-Specific Templates
Practice with real-world scenarios:
- **SaaS**: MRR, LTV:CAC, NRR, enterprise sales
- **FinTech**: Compliance, fraud rates, partnerships
- **Health**: HIPAA, FDA, patient outcomes
- **E-commerce**: Conversion, AOV, inventory
- **AI/ML**: Model accuracy, latency, ethics

### 6. Embedded Learning
Expert guidance from 30+ years of PM experience:
- How-to guides for every section
- Best practices from industry veterans
- Framework explanations (RICE, JTBD, OKRs)
- Common pitfalls to avoid

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** with custom design system
- **Server-Sent Events** for real-time streaming

### Backend
- **Flask** (Python) with async support
- **JWT Authentication** with role-based access
- **SQLAlchemy** + PostgreSQL with migrations
- **Redis** for caching and rate limiting
- **Celery** for background tasks
- **Prometheus** metrics and structured logging

### Infrastructure
- **Docker** + Docker Compose
- **Nginx** reverse proxy
- **CI/CD** with GitHub Actions
- **Pre-commit** hooks for security

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.10+
- PostgreSQL 14+
- Redis 7+

### 1. Clone and Setup

```bash
git clone https://github.com/arunpodili/Pm-simulation.git
cd pm-simulator

# Install frontend dependencies
npm install

# Install backend dependencies
cd ai-agents-service
pip install -r requirements.txt
cd ..
```

### 2. Environment Configuration

Create `.env.local` in root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Create `.env` in `ai-agents-service/`:
```env
FLASK_APP=app_v2.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=postgresql://user:pass@localhost/pm_simulator
REDIS_URL=redis://localhost:6379/0
```

### 3. Database Setup

```bash
cd ai-agents-service
python -c "from database import init_db; init_db()"
python migrations/setup.py
```

### 4. Run Development Servers

Terminal 1 - Backend:
```bash
cd ai-agents-service
python app_v2.py
# Or: flask --app app_v2 run --port 5001
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Documentation**: http://localhost:3000/api-integration

## 📖 Usage Guide

### Running Your First Simulation

1. **Sign In**
   - Visit http://localhost:3000/login
   - Use demo@example.com / demo123 (or create account)

2. **Start Simulation**
   - Click "Start Simulation" on homepage
   - Or go to `/simulate`

3. **Step 1: Define**
   - Product name: "TaskFlow Pro"
   - Description: "AI-powered task management for teams"
   - Target market: "Small businesses, 10-50 employees"

4. **Step 2: Configure**
   - Pricing model: Freemium
   - Price point: $29/month
   - Key features: "AI prioritization, team collaboration"
   - Competitors: "Asana, Monday.com"

5. **Step 3: Simulate**
   - Review summary
   - Click "Start Simulation"
   - Watch progress bar (2-3 minutes)
   - See insights appear

6. **Step 4: Analyze**
   - View conversion rate, projected revenue
   - Read AI insights
   - Export or run another simulation

### Using the Dashboard

1. Go to `/dashboard`
2. See all your simulations
3. Filter by status
4. Click any simulation to view details

### API Integration

1. Go to `/api-integration`
2. Create API key
3. Copy the key (shown once)
4. Use in your applications:

```bash
curl -X POST http://localhost:5001/api/v2/simulations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "My App",
    "target_market": "SMBs",
    "pricing_model": "subscription",
    "price_point": "$19/month"
  }'
```

## 📁 Project Structure

```
pm-simulator/
├── src/                          # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── login/page.tsx       # Login
│   │   ├── register/page.tsx    # Registration
│   │   ├── dashboard/page.tsx   # Simulation history
│   │   ├── simulate/page.tsx    # Simulation wizard
│   │   ├── demo/page.tsx        # Demo results
│   │   └── api-integration/     # API management
│   ├── components/
│   │   ├── ui/                  # Design system (Button, Card, Input, Hint)
│   │   └── Header.tsx           # Navigation
│   ├── lib/
│   │   ├── api/
│   │   │   ├── types.ts         # TypeScript definitions
│   │   │   └── client.ts        # API client
│   │   └── context/
│   │       └── AuthContext.tsx  # Auth state
│   └── styles/
│       └── globals-minimal.css  # Design tokens
│
├── ai-agents-service/           # Flask Backend
│   ├── app_v2.py               # Main Flask app
│   ├── auth_middleware.py      # JWT auth
│   ├── api_v2/
│   │   └── simulations.py      # CRUD endpoints
│   ├── streaming.py            # SSE streaming
│   ├── database.py             # SQLAlchemy models
│   ├── cache.py                # Redis caching
│   ├── rate_limiter.py         # Rate limiting
│   └── security/
│       └── api_key_auth.py     # API key management
│
├── tests/                       # Test suite (139+ tests)
├── docker-compose.staging.yml   # Docker setup
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout current user |
| POST | `/api/auth/refresh` | Refresh access token |

### Simulations (v2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/simulations` | List all simulations |
| POST | `/api/v2/simulations` | Create new simulation |
| GET | `/api/v2/simulations/{id}` | Get simulation details |
| DELETE | `/api/v2/simulations/{id}` | Delete simulation |
| GET | `/api/v2/simulations/{id}/stream` | Stream progress (SSE) |

### Legacy Simulation API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/simulation/create` | Create simulation (v1) |
| POST | `/api/simulation/map-fields` | Map user brief to config |
| GET | `/api/simulation/{id}/status` | Get simulation status |
| GET | `/api/simulation/{id}/results` | Get simulation results |

### API Keys
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/api-keys` | List API keys |
| POST | `/api/api-keys` | Create new key |
| DELETE | `/api/api-keys/{id}` | Revoke key |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List webhooks |
| POST | `/api/webhooks` | Create webhook |
| PUT | `/api/webhooks/{id}` | Update webhook |
| DELETE | `/api/webhooks/{id}` | Delete webhook |
| POST | `/api/webhooks/{id}/test` | Test webhook |

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd ai-agents-service
pytest ../tests/ -v

# Frontend tests (if available)
npm test
```

Test coverage: **95%+** (139+ tests)

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build and start all services
docker-compose -f docker-compose.staging.yml up --build

# Access:
# - Frontend: http://localhost
# - Backend API: http://localhost/api
# - API Docs: http://localhost/api-integration
```

### Manual Deployment

See `deploy-staging.sh` for production deployment script.

## 🎓 Learning Resources

Content inspired by PM literature:
- "Inspired" by Marty Cagan
- "The Lean Startup" by Eric Ries
- "The Mom Test" by Rob Fitzpatrick
- "Measure What Matters" by John Doerr
- "Escaping the Build Trap" by Melissa Perri

## 🤝 Contributing

This is a free community tool. Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT - Free for educational and commercial use

## 🙏 Acknowledgments

Built with expertise from 30+ years of product management experience.

---

**Train, Validate, Launch** - Perfect your product decisions before going live.

**Free forever for the community.**
