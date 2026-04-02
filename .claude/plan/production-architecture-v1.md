# 📋 Implementation Plan: Production-Ready PM Simulator Architecture

**Version**: 1.0  
**Created**: 2026-04-02  
**Scope**: Full-stack production enhancements  
**Estimated Effort**: 3-4 days

---

## 🎯 Executive Summary

Transform the existing MVP PM Simulator into a production-grade application by implementing:
1. **Streaming API** - Real-time simulation progress via WebSocket/SSE
2. **Field Mapping Engine** - Smart transformation of user inputs to simulation parameters
3. **Async Job Queue** - Celery + Redis for background processing
4. **Validation Framework** - Compare results against industry benchmarks
5. **Multi-Model LLM Strategy** - Hybrid local (Ollama) + cloud (Claude/Gemini) approach

---

## 📊 Current State Analysis

### ✅ What Works
| Component | Status | Details |
|-----------|--------|---------|
| Rule-Based Simulation | ✅ Stable | 1000 personas, 5-min runtime, statistical modeling |
| Mock Mode | ✅ Stable | 2-second results, template-based |
| Flask API | ✅ Working | REST endpoints functional |
| React Frontend | ✅ Working | Basic UI components complete |
| Data Models | ✅ Solid | Well-structured Pydantic-style dataclasses |

### ❌ Critical Issues
| Issue | Impact | Root Cause |
|-------|--------|------------|
| LLM Mode Unusable | Can't use premium feature | 15+ min runtime, Ollama JSON parsing fails |
| No Real-Time Feedback | Poor UX, users don't know if running | Synchronous blocking API design |
| Weak Input Mapping | Simulation doesn't use user inputs effectively | Missing NLP/field extraction layer |
| No Validation | Low confidence in results | No benchmark comparison |
| API Blocking | Can't scale | No async job queue |

---

## 🏗️ Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FRONTEND (Next.js/React)                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │ │
│  │  │ Smart Input  │  │ Real-Time    │  │ Validation   │              │ │
│  │  │ Forms        │  │ Progress UI  │  │ Dashboard    │              │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │ │
│  │         │                 │                 │                       │ │
│  │         └─────────────────┴─────────────────┘                       │ │
│  │                           │                                         │ │
│  │                    WebSocket Client                                 │ │
│  └───────────────────────────┼─────────────────────────────────────────┘ │
│                              │                                             │
│                              ▼ WebSocket/SSE                               │
│                                                                             │
│  BACKEND (Python/Flask)                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  ┌───────────────────────────────────────────────────────────────┐  │ │
│  │  │                    API LAYER                                    │  │ │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐               │  │ │
│  │  │  │ /create    │  │ /stream    │  │ /validate  │               │  │ │
│  │  │  │ (sync)     │  │ (SSE)      │  │ (sync)     │               │  │ │
│  │  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘               │  │ │
│  │  └────────┼───────────────┼───────────────┼──────────────────────┘  │ │
│  │           │               │               │                         │ │
│  │  ┌────────┼───────────────┼───────────────┼──────────────────────┐  │ │
│  │  │        ▼               ▼               ▼                      │  │ │
│  │  │  ┌───────────────────────────────────────────────────────────┐  │  │ │
│  │  │  │               SERVICE LAYER                             │  │  │ │
│  │  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │  │ │
│  │  │  │  │ Field      │  │ Streaming  │  │ Validation │        │  │  │ │
│  │  │  │  │ Mapper     │  │ Service    │  │ Engine     │        │  │  │ │
│  │  │  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘        │  │  │ │
│  │  │  └────────┼───────────────┼───────────────┼───────────────┘  │  │ │
│  │  └───────────┼───────────────┼───────────────┼──────────────────┘  │ │
│  │              │               │               │                       │ │
│  │  ┌───────────▼───────────────▼───────────────▼──────────────────┐  │ │
│  │  │                    ASYNC LAYER (Celery)                      │  │ │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐               │  │ │
│  │  │  │ Simulation │  │ LLM        │  │ Results    │               │  │ │
│  │  │  │ Worker     │  │ Worker     │  │ Processor  │               │  │ │
│  │  │  └────────────┘  └────────────┘  └────────────┘               │  │ │
│  │  └──────────────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  INFRASTRUCTURE                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Redis (Queue)  │  SQLite (Results)  │  Ollama/Cloud LLM            │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure Changes

### New Files (Backend)
```
ai-agents-service/
├── streaming.py              # SSE/WebSocket streaming implementation
├── field_mapper.py           # NLP-based field extraction
├── tasks.py                  # Celery async tasks
├── validation.py             # Benchmark comparison framework
├── llm_router.py            # Multi-model LLM strategy
└── requirements-celery.txt   # Additional dependencies
```

### New Files (Frontend)
```
src/components/simulation/
├── StreamingResults.tsx      # Real-time progress display
├── SmartInputField.tsx       # AI-enhanced input with hints
├── ValidationBadge.tsx       # Confidence indicators
└── JobStatusPanel.tsx        # Async job monitoring

src/lib/
├── streaming-api.ts         # WebSocket client
└── field-mapping.ts         # Input transformation helpers
```

### Modified Files
```
ai-agents-service/
├── app.py                    # Add streaming endpoints
├── simulation/
│   ├── simulation_engine.py  # Add progress callbacks
│   └── llm_simulation_engine.py  # Add async support

src/components/simulation/
├── SimulationSetup.tsx       # Add smart field mapping
├── SimulationRunning.tsx     # Add streaming UI
└── SimulationResults.tsx     # Add validation display
```

---

## 🔧 Implementation Details

### Phase 1: Streaming API (Day 1)

**Objective**: Enable real-time simulation progress updates

**Technical Design**:
```python
# streaming.py
from flask import Response, stream_with_context
import json
import time

@app.route('/api/simulation/<sim_id>/stream')
def stream_simulation(sim_id):
    """Server-Sent Events for real-time updates"""
    def generate():
        for day in range(30):
            result = process_day(day)
            yield f"data: {json.dumps({
                'day': day,
                'progress': (day / 30) * 100,
                'metrics': result
            })}\n\n"
            time.sleep(0.1)  # Simulate processing time
    
    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    )
```

**Frontend Integration**:
```typescript
// streaming-api.ts
export class StreamingClient {
  connect(simId: string, onUpdate: (data: StreamData) => void) {
    const eventSource = new EventSource(
      `/api/simulation/${simId}/stream`
    );
    eventSource.onmessage = (event) => {
      onUpdate(JSON.parse(event.data));
    };
  }
}
```

**Acceptance Criteria**:
- [ ] User sees day-by-day progress during simulation
- [ ] Progress bar updates in real-time
- [ ] Can cancel simulation mid-run
- [ ] Graceful handling of connection drops

---

### Phase 2: Field Mapping Engine (Day 1-2)

**Objective**: Transform free-form user inputs into structured simulation parameters

**Technical Design**:
```python
# field_mapper.py
from typing import Dict, Any
import re

class FieldMappingEngine:
    """
    Transforms user product briefs into simulation configuration
    """
    
    def __init__(self):
        self.pain_keywords = {
            'high': ['critical', 'urgent', 'blocking', 'frustrated'],
            'medium': ['annoying', 'slow', 'inefficient'],
            'low': ['nice to have', 'improvement', 'optional']
        }
        
        self.market_size_indicators = {
            'enterprise': ['enterprise', 'fortune 500', 'large org'],
            'smb': ['small business', 'startup', 'team'],
            'consumer': ['consumers', 'users', 'individuals']
        }
    
    def map_brief_to_config(self, brief: Dict[str, str]) -> Dict[str, Any]:
        """
        Input: Raw user inputs
        Output: Structured simulation config
        """
        return {
            'pain_severity': self._extract_pain_level(brief),
            'market_size': self._estimate_market(brief),
            'price_sensitivity': self._analyze_pricing(brief),
            'viral_potential': self._estimate_virality(brief),
            'competitive_pressure': self._assess_competition(brief),
            'tech_adoption_speed': self._estimate_adoption_speed(brief)
        }
    
    def _extract_pain_level(self, brief: Dict[str, str]) -> float:
        """Extract pain severity from 0-1"""
        problem = brief.get('problem', '').lower()
        
        for severity, keywords in self.pain_keywords.items():
            if any(kw in problem for kw in keywords):
                return {'high': 0.9, 'medium': 0.6, 'low': 0.3}[severity]
        
        return 0.5  # default
```

**UI Enhancement**:
```typescript
// SmartInputField.tsx
interface SmartInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fieldType: 'problem' | 'pricing' | 'market';
}

export function SmartInputField({ 
  label, 
  value, 
  onChange,
  fieldType 
}: SmartInputFieldProps) {
  const [hints, setHints] = useState<string[]>([]);
  
  useEffect(() => {
    // Extract hints based on field type
    const newHints = extractHints(value, fieldType);
    setHints(newHints);
  }, [value, fieldType]);
  
  return (
    <div>
      <label>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      {hints.length > 0 && (
        <div className="hints">
          {hints.map(hint => (
            <span key={hint} className="hint-badge">{hint}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] User enters "AI meeting summarizer for remote teams, $15/month"
- [ ] System extracts: pain=0.8, market=large, price_sensitivity=0.4
- [ ] Real-time hints show as user types
- [ ] Mapped values displayed before simulation starts

---

### Phase 3: Async Job Queue (Day 2-3)

**Objective**: Enable background processing and scalability

**Technical Design**:
```python
# tasks.py
from celery import Celery
from simulation.simulation_engine import SimulationEngine

app = Celery('pm-simulator')
app.conf.update(
    broker_url='redis://localhost:6379/0',
    result_backend='redis://localhost:6379/0'
)

@app.task(bind=True)
def run_simulation_task(self, sim_id: str, config: dict):
    """
    Background task for running simulations
    """
    def progress_callback(day: int, total: int, metrics: dict):
        self.update_state(
            state='PROGRESS',
            meta={
                'day': day,
                'total': total,
                'progress': (day / total) * 100,
                'metrics': metrics
            }
        )
    
    engine = SimulationEngine(progress_callback=progress_callback)
    result = engine.run_simulation(config)
    
    return {
        'simulation_id': sim_id,
        'status': 'completed',
        'result': result.to_dict()
    }
```

**API Integration**:
```python
# app.py (modified)
from tasks import run_simulation_task

@app.route('/api/simulation/<sim_id>/run-async', methods=['POST'])
def run_simulation_async(sim_id):
    """Start async simulation"""
    config = active_simulations[sim_id]['config']
    
    # Queue the task
    task = run_simulation_task.delay(sim_id, config)
    
    return jsonify({
        'success': True,
        'simulation_id': sim_id,
        'task_id': task.id,
        'status': 'queued'
    })

@app.route('/api/tasks/<task_id>/status', methods=['GET'])
def get_task_status(task_id):
    """Check async task status"""
    task = run_simulation_task.AsyncResult(task_id)
    
    return jsonify({
        'task_id': task_id,
        'status': task.status,
        'progress': task.info.get('progress', 0) if task.info else 0
    })
```

**Frontend Job Monitoring**:
```typescript
// JobStatusPanel.tsx
export function JobStatusPanel({ taskId }: { taskId: string }) {
  const [status, setStatus] = useState<TaskStatus>('queued');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const task = await fetchTaskStatus(taskId);
      setStatus(task.status);
      setProgress(task.progress);
      
      if (task.status === 'completed' || task.status === 'failed') {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [taskId]);
  
  return (
    <div className="job-status">
      <div className="status-badge">{status}</div>
      <ProgressBar value={progress} />
      {status === 'failed' && (
        <button onClick={() => retryTask(taskId)}>Retry</button>
      )}
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] API returns immediately with job ID
- [ ] Simulation runs in background
- [ ] Can check status via `/api/tasks/<id>/status`
- [ ] Can list all running/completed jobs
- [ ] Failed jobs can be retried
- [ ] Multiple simulations can run concurrently

---

### Phase 4: Validation Framework (Day 3)

**Objective**: Compare simulation results to industry benchmarks for confidence scoring

**Technical Design**:
```python
# validation.py
from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class Benchmark:
    metric: str
    industry: str
    mean: float
    std_dev: float
    source: str

class ValidationFramework:
    """
    Validates simulation results against industry benchmarks
    """
    
    BENCHMARKS = {
        'saas': {
            'trial_to_paid': Benchmark(
                'trial_to_paid', 'saas', 0.15, 0.05, 'industry-avg-2024'
            ),
            'monthly_churn': Benchmark(
                'monthly_churn', 'saas', 0.05, 0.02, 'industry-avg-2024'
            ),
            'viral_coefficient': Benchmark(
                'viral_coefficient', 'saas', 0.2, 0.1, 'viral-marketing-study'
            ),
            'nps': Benchmark(
                'nps', 'saas', 30, 15, 'saas-nps-benchmarks'
            ),
            'ltv_cac_ratio': Benchmark(
                'ltv_cac_ratio', 'saas', 3.0, 1.0, 'saas-metrics-guide'
            )
        },
        'fintech': {
            'signup_to_activation': Benchmark(
                'signup_to_activation', 'fintech', 0.25, 0.08, 'fintech-onboarding-2024'
            ),
            'activation_to_purchase': Benchmark(
                'activation_to_purchase', 'fintech', 0.30, 0.10, 'fintech-conversion-2024'
            )
        }
    }
    
    def validate(self, results: Dict[str, Any], industry: str) -> Dict[str, Any]:
        """
        Validate results against industry benchmarks
        Returns confidence score and flags
        """
        benchmarks = self.BENCHMARKS.get(industry, self.BENCHMARKS['saas'])
        
        validation_results = {}
        total_confidence = 0
        
        for metric, benchmark in benchmarks.items():
            if metric in results:
                value = results[metric]
                z_score = (value - benchmark.mean) / benchmark.std_dev
                
                # Confidence based on how close to benchmark
                confidence = max(0, 1 - abs(z_score) / 3)
                
                validation_results[metric] = {
                    'value': value,
                    'benchmark': benchmark.mean,
                    'z_score': z_score,
                    'confidence': confidence,
                    'status': 'valid' if confidence > 0.7 else 'warning' if confidence > 0.4 else 'alert'
                }
                
                total_confidence += confidence
        
        avg_confidence = total_confidence / len(validation_results) if validation_results else 0
        
        return {
            'overall_confidence': avg_confidence,
            'is_realistic': avg_confidence > 0.6,
            'metrics': validation_results,
            'recommendations': self._generate_recommendations(validation_results)
        }
```

**UI Integration**:
```typescript
// ValidationBadge.tsx
export function ValidationBadge({ 
  confidence, 
  status 
}: { 
  confidence: number; 
  status: 'valid' | 'warning' | 'alert' 
}) {
  const colors = {
    valid: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    alert: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className={`validation-badge ${colors[status]}`}>
      <span className="confidence">{Math.round(confidence * 100)}%</span>
      <span className="status">{status}</span>
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] Results show confidence score (0-100%)
- [ ] Each metric compared to industry benchmark
- [ ] Z-score calculation shows deviation
- [ ] Flag unrealistic results (>3 std dev)
- [ ] Recommendations for improving model

---

### Phase 5: Multi-Model LLM Strategy (Day 3-4)

**Objective**: Implement hybrid LLM approach (local + cloud) for reliability and speed

**Technical Design**:
```python
# llm_router.py
from enum import Enum
from typing import Optional, Dict, Any
import os

class LLMProvider(Enum):
    LOCAL = "local"           # Ollama
    CLOUD_CLAUDE = "claude"   # Anthropic Claude
    CLOUD_GEMINI = "gemini"   # Google Gemini

class LLMRouter:
    """
    Routes LLM requests to appropriate provider based on task
    """
    
    def __init__(self):
        self.providers = {
            LLMProvider.LOCAL: OllamaClient(),
            LLMProvider.CLOUD_CLAUDE: AnthropicClient(
                api_key=os.getenv('ANTHROPIC_API_KEY')
            ),
            LLMProvider.CLOUD_GEMINI: GeminiClient(
                api_key=os.getenv('GEMINI_API_KEY')
            )
        }
    
    def route(self, task: str, complexity: str, require_json: bool = False) -> LLMProvider:
        """
        Determine best provider for task
        """
        if complexity == 'low' and not require_json:
            # Fast, cheap tasks use local
            return LLMProvider.LOCAL
        
        elif require_json:
            # JSON parsing needs reliable cloud model
            return LLMProvider.CLOUD_CLAUDE
        
        elif complexity == 'high':
            # Complex reasoning needs best model
            return LLMProvider.CLOUD_CLAUDE
        
        else:
            # Default to cost-effective option
            return LLMProvider.CLOUD_GEMINI
    
    async def generate(
        self, 
        prompt: str, 
        task: str,
        complexity: str = 'medium',
        require_json: bool = False
    ) -> Dict[str, Any]:
        """
        Generate with appropriate provider
        """
        provider = self.route(task, complexity, require_json)
        client = self.providers[provider]
        
        try:
            result = await client.generate(prompt)
            
            # If JSON required but parsing failed, fallback to cloud
            if require_json and not self._is_valid_json(result):
                result = await self.providers[LLMProvider.CLOUD_CLAUDE].generate(prompt)
            
            return {
                'provider': provider.value,
                'result': result,
                'cost': self._estimate_cost(provider, prompt),
                'latency': self._estimate_latency(provider)
            }
            
        except Exception as e:
            # Fallback to cloud on local failure
            if provider == LLMProvider.LOCAL:
                return await self.generate(
                    prompt, task, complexity, require_json
                )
            raise
```

**Cost Optimization**:
```python
# Cost tracking
class CostTracker:
    def __init__(self):
        self.daily_budget = float(os.getenv('LLM_DAILY_BUDGET', '10.0'))
        self.today_spend = 0.0
    
    def can_use_cloud(self, estimated_cost: float) -> bool:
        """Check if we can afford cloud API"""
        return (self.today_spend + estimated_cost) < self.daily_budget
    
    def track_spend(self, provider: LLMProvider, tokens: int):
        """Track spending"""
        costs = {
            LLMProvider.LOCAL: 0.0,
            LLMProvider.CLOUD_CLAUDE: tokens * 0.00003,
            LLMProvider.CLOUD_GEMINI: tokens * 0.00001
        }
        self.today_spend += costs[provider]
```

**Acceptance Criteria**:
- [ ] Fast tasks (<1s) use local Ollama
- [ ] JSON-critical tasks use Claude API
- [ ] Fallback to cloud on local failure
- [ ] Cost tracking per request
- [ ] Daily budget enforcement
- [ ] A/B testing between providers

---

## 🧪 Testing Strategy

### Unit Tests
```python
# tests/test_field_mapper.py
def test_pain_extraction():
    mapper = FieldMappingEngine()
    brief = {'problem': 'Critical security vulnerability blocking releases'}
    result = mapper.map_brief_to_config(brief)
    assert result['pain_severity'] == 0.9

def test_pricing_analysis():
    mapper = FieldMappingEngine()
    brief = {'pricing': '$15/month for teams'}
    result = mapper.map_brief_to_config(brief)
    assert result['price_sensitivity'] < 0.5  # Reasonable price
```

### Integration Tests
```python
# tests/test_streaming.py
def test_simulation_streaming():
    client = app.test_client()
    response = client.get('/api/simulation/test-123/stream')
    
    events = []
    for line in response.response:
        if line.startswith(b'data:'):
            events.append(json.loads(line[5:]))
    
    assert len(events) == 30  # 30 days
    assert events[-1]['progress'] == 100
```

### Load Tests
```bash
# Simulate 100 concurrent simulations
ab -n 100 -c 10 -p simulation.json -T application/json \
   http://localhost:5001/api/simulation/create
```

---

## 📦 Deployment Plan

### Dependencies
```bash
# requirements-additional.txt
celery[redis]
redis
flask-socketio
python-socketio
tenacity  # For retries
```

### Environment Variables
```bash
# .env.production
REDIS_URL=redis://localhost:6379/0
ANTHROPIC_API_KEY=sk-...
GEMINI_API_KEY=AIza...
LLM_DAILY_BUDGET=10.0
STREAMING_BUFFER_SIZE=100
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  worker:
    build: .
    command: celery -A tasks worker --loglevel=info
    depends_on:
      - redis
    env_file:
      - .env
  
  api:
    build: .
    ports:
      - "5001:5001"
    depends_on:
      - redis
      - worker
    env_file:
      - .env
```

---

## 🎯 Success Metrics

| Metric | Before | Target | How to Measure |
|--------|--------|--------|----------------|
| Simulation UX | Wait 5 min blindly | Real-time progress | Time to first progress update |
| Input Quality | Free text → ignored | Mapped to parameters | % of inputs with valid mappings |
| API Response | 5 min blocking | <100ms queue | Response time from POST /run-async |
| Result Confidence | Unknown | >80% confidence | Validation framework score |
| LLM Reliability | 30% success | >95% success | % successful JSON parsing |
| Cost per Sim | $0 (Ollama) | $0.50 average | Track via CostTracker |

---

## 🚨 Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Redis dependency | Medium | High | SQLite fallback for queue |
| Cloud API costs | High | Medium | Budget limits + local fallback |
| Streaming complexity | Medium | Medium | Start with polling fallback |
| Field mapping accuracy | Medium | Medium | Allow manual override |

---

## 📝 Notes

### SESSION_IDs for /ccg:execute
- CODEX_SESSION: `pending-execution`
- GEMINI_SESSION: `pending-execution`

These will be populated when we run the execute phase.

### Next Steps
1. Review this plan
2. Run `/ccg:execute .claude/plan/production-architecture-v1.md`
3. Or tell me to adjust specific sections

---

## ✅ Final Checklist

Before execution, ensure:
- [ ] All technical designs reviewed
- [ ] Dependencies available (Redis, Celery)
- [ ] Environment variables configured
- [ ] Database migrations (if any) planned
- [ ] Rollback strategy defined
- [ ] Monitoring/alerting in place

---

**Generated by**: Claude Code (CCG Planning Protocol)  
**Review Status**: Pending user approval  
**Execution Command**: `/ccg:execute .claude/plan/production-architecture-v1.md`
