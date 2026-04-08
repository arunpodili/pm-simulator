# PM Simulator v2.0 Completion Design Specification

**Date:** 2026-04-08  
**Project:** PM Simulator v2.0 - Product Management Training Platform  
**Scope:** Complete missing features for production-ready release

---

## 1. Executive Summary

### Current State
PM Simulator v2.0 is a functional product management training platform with:
- Next.js 14 frontend + Flask backend
- Rule-based simulation engine (1000 autonomous agents)
- Authentication, dashboard, simulation wizard
- Industry-specific templates (SaaS, FinTech, Health, E-commerce, AI/ML)
- Docker staging, 95%+ test coverage

### Missing Features (This Design)
1. **Persona Builder** - Define up to 5 target customer personas
2. **Structured Fields** - What/Who/Why/Impact/When framework
3. **Inline Hint System** - Contextual guidance with PM expertise
4. **Export Engine** - Professional exports (PDF, Docx, Notion, Google Docs)
5. **Change Log Manager** - Track simulation iterations
6. **3D Agent Visualization** - Live network showing agent interactions

### Success Metrics
- Users can define custom personas (not just templates)
- Complete structured briefs 40% faster with hints
- 60%+ of simulations exported professionally
- Real-time 3D visualization at 60fps

---

## 2. Architecture Overview

```
Frontend (Next.js 14 + TypeScript)
├── Components/
│   ├── persona-builder/          # Persona CRUD
│   ├── structured-fields/        # Framework inputs
│   ├── export-manager/           # Export flow
│   └── 3d-visualization/         # Agent network
├── Lib/
│   ├── export/                   # PDF, Docx, API clients
│   └── hints/                    # Hint database
└── Hooks/
    ├── usePersonas.ts
    ├── useExport.ts
    └── use3DVisualization.ts

Backend (Flask + Python)
├── api_v2/
│   ├── personas.py              # CRUD endpoints
│   └── exports.py               # Export generation
├── export/
│   ├── pdf_service.py           # Server-side fallback
│   └── formatters.py
├── models/
│   ├── simulation_persona.py    # New table
│   └── change_log.py            # Change tracking
└── streaming.py                 # SSE for 3D updates
```

---

## 3. Feature Specifications

### 3.1 Persona Builder

**Purpose:** Let PMs define up to 5 target customer personas for simulation.

**UI:**
```
┌──────────────────────────────────────────────────────────────┐
│  Target Personas                              [+ Add Persona] │
│  ─────────────────────────────────────────────────────────  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ 👤 Sarah   │ │ 👤 Mike    │ │ [+ Add]    │              │
│  │  Founder   │ │  Trader    │ │  3 of 5    │              │
│  │  ✓ Valid   │ │  ⚠ Needs   │ │            │              │
│  └────────────┘ └────────────┘ └────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | Max 100 chars |
| Role | Select | Yes | From industry presets |
| Pain Level | Slider | Yes | 1-10 |
| Tech Savviness | Slider | Yes | 1-10 |
| Age Range | Select | No | 18-24, 25-34, etc. |
| Income Level | Select | No | Low/Medium/High/Enterprise |
| Goals | Textarea | No | Max 2000 chars |
| Frustrations | Textarea | No | Max 2000 chars |

**Rules:**
- Min 1 persona, max 5 personas
- Auto-save draft every 5 seconds
- Duplicate role warnings (not blocking)

**API Endpoints:**
```
GET  /api/v2/simulations/{id}/personas
POST /api/v2/simulations/{id}/personas
PUT  /api/v2/personas/{id}
DELETE /api/v2/personas/{id}
POST /api/v2/personas/{id}/duplicate
```

**Database Schema:**
```python
class SimulationPersona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    simulation_id = db.Column(db.Integer, db.ForeignKey('simulation.id'))
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    pain_level = db.Column(db.Integer, nullable=False)  # 1-10
    tech_savviness = db.Column(db.Integer, nullable=False)  # 1-10
    age_range = db.Column(db.String(20))
    income_level = db.Column(db.String(20))
    goals = db.Column(db.Text)
    frustrations = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
```

---

### 3.2 Structured Fields (What/Who/Why/Impact/When)

**Purpose:** Guide PMs through systematic product brief creation.

**Framework Applied:**

**Problem Statement Section:**
| Field | Prompt | Min Length | Max Length |
|-------|--------|------------|------------|
| What | "What is the problem?" | 20 | 2000 |
| Who | "Who experiences this?" | 10 | 1000 |
| Why | "Why does this matter? (Impact)" | 20 | 2000 |
| Impact | "$ impact, % of users, frequency" | 10 | 1000 |
| When | "When does this occur?" | 10 | 1000 |

**Additional Sections:**
1. **Target Market** - Size/Segments/Characteristics/Entry strategy
2. **Value Proposition** - Benefit/Differentiation/Proof/Outcome
3. **Success Metrics** - North Star/Lag indicators/Lead indicators/Target

**Validation:**
- Required fields must be complete before simulation
- Min length enforcement (prevents "asdf" inputs)
- Progress indicator showing completion %

---

### 3.3 Inline Hint System

**Purpose:** Provide contextual guidance without leaving workflow.

**Hint Types:**
| Type | Icon | Trigger |
|------|------|---------|
| Example | 💡 | Field focus |
| Best Practice | ℹ️ | Hover on icon |
| Warning | ⚠️ | Validation error |
| Framework | 📊 | Section header |

**Hint Content Database:**
```typescript
// lib/hints/hint-database.ts
export const hintDatabase: Record<string, Hint[]> = {
  'problem-statement.what': [
    {
      type: 'example',
      content: 'Enterprise customers take 14 days to activate, with 40% dropping off before setup.',
      source: 'Typical SaaS onboarding friction'
    },
    {
      type: 'best-practice',
      content: 'Start with the customer pain, not your solution. Avoid mentioning features.',
      source: 'The Mom Test, Chapter 2'
    }
  ],
  'target-market.size': [
    {
      type: 'framework',
      content: 'TAM/SAM/SOM: Total market vs Serviceable vs Obtainable',
      visual: 'tam-sam-som-diagram'
    }
  ]
};
```

**Sources:**
- "Inspired" by Marty Cagan
- "The Lean Startup" by Eric Ries
- "The Mom Test" by Rob Fitzpatrick
- "Escaping the Build Trap" by Melissa Perri
- "Measure What Matters" by John Doerr

---

### 3.4 Export Engine

**Purpose:** Generate professional, shareable reports.

**Export Formats:**

| Format | Library | Location | Features |
|--------|---------|----------|----------|
| PDF | `@react-pdf/renderer` | Client | Cover, TOC, charts, A4/Letter |
| Docx | `docx` (npm) | Client | Editable, track changes |
| Notion | Notion API v1 | Server | Database properties, nested pages |
| Google Docs | Google Docs API | Server | Native formatting, sharing |

**PDF Structure:**
```
1. Cover Page
   - Title, date, author
2. Table of Contents
3. Executive Summary
   - Key metrics (conversion, revenue)
   - Critical insights
4. Simulation Parameters
   - Personas defined
   - Pricing model
   - Market conditions
5. Results Overview
   - Conversion funnel
   - Daily active users
   - Revenue projection
6. Persona Breakdown
   - Per-persona adoption curves
7. Agent Network Analysis
   - Influence patterns
   - Viral coefficients
8. Recommendations
   - Action items
   - Risk factors
```

**Export Flow:**
1. User clicks "Export" → Modal opens
2. Select format → Preview generates
3. Confirm → Generate file
4. Download or open in external app

**API Endpoints:**
```
POST /api/v2/exports/pdf
POST /api/v2/exports/docx
POST /api/v2/exports/notion
POST /api/v2/exports/google-docs
GET  /api/v2/exports/:id/status
```

**Notion Integration:**
- OAuth scope: `pages:write`, `databases:read`
- Creates page with icon 📊
- Database properties: Status, Revenue, Conversion
- Nested content blocks: headings, callouts, tables

**Google Docs Integration:**
- OAuth scope: `docs`, `drive.file`
- Native formatting (headings, lists, tables)
- Shareable link generation

---

### 3.5 Change Log Manager

**Purpose:** Track iterations and decisions across simulation runs.

**Change Types:**
- `param_change` - Pricing, features, market conditions
- `persona_edit` - Add/remove/modify personas
- `result_note` - Manual annotations on results
- `decision` - Strategic decisions recorded

**Data Model:**
```typescript
interface ChangeLogEntry {
  id: string;
  simulationId: string;
  timestamp: Date;
  author: string;
  type: 'param_change' | 'persona_edit' | 'result_note' | 'decision';
  field: string;
  oldValue: any;
  newValue: any;
  reason?: string;
  impact?: string;
}
```

**UI: Timeline View**
```
Apr 8, 3:45 PM    Pricing changed: $29 → $19
├─ By: demo@example.com
├─ Reason: "Competitor analysis showed lower price point"
└─ Impact: Conversion +8%, Revenue -12%

Apr 8, 2:20 PM    Added persona: "Enterprise IT Manager"
├─ By: demo@example.com
├─ Pain level: 7, Tech-savvy: 5
└─ Result: Expanded TAM by 20%
```

**Features:**
- Auto-log all parameter changes
- Manual annotations with "decision" type
- Side-by-side version comparison
- Rollback to previous configuration

---

### 3.6 3D Agent Visualization

**Purpose:** Visualize persona interactions and adoption in real-time.

**Components:**

| Component | Description |
|-----------|-------------|
| **Agent Network** | 3D graph showing 1000 agents |
| **Persona Clusters** | Group by persona type (color-coded) |
| **Influence Paths** | Animated lines showing word-of-mouth |
| **State Changes** | Nodes pulse when state changes |
| **Timeline Scrubber** | Drag to see network at any day |

**States & Visuals:**
| State | Color | Animation |
|-------|-------|-----------|
| Unaware | Gray | Static |
| Aware | Blue | Slow pulse |
| Signed Up | Green | Glow |
| Active | Bright green | Fast pulse |
| Engaged | Gold | Sparkle |
| Churned | Red | Fade out |
| Advocate | Purple | Emit particles |

**Performance Optimizations:**
- **LOD System:**
  - Zoom > 80%: Individual agents (1000 nodes)
  - Zoom 40-80%: Clusters by persona (5 groups)
  - Zoom < 40%: Summary metrics only
- **Batched Updates:** Group 10 changes into single re-render
- **Spatial Indexing:** Quadtree for O(log n) lookups
- **WebGL Fallback:** CSS3D for unsupported browsers

**Data Flow:**
```
Flask SSE Stream → Event Parser → State Update (useReducer) 
→ React Re-render → 3D Scene Update (CSS3D/Three.js)
```

**Events:**
- `day_complete` - End of day summary
- `agent_state_change` - Individual transition
- `influence_propagated` - Word-of-mouth spread

---

## 4. Component Architecture

```
src/
├── app/
│   └── simulate/
│       └── page.tsx
│           ├── PersonaBuilderSection
│           │   ├── PersonaCard
│           │   ├── PersonaForm
│           │   └── PersonaList
│           ├── StructuredBriefSection
│           │   ├── FrameworkSection
│           │   │   ├── StructuredField
│           │   │   └── InlineHint
│           │   └── FrameworkProgress
│           └── SimulationRunner
│               ├── SimulationControls
│               ├── AgentVisualization3D
│               │   ├── AgentNetworkGraph
│               │   ├── AgentNode
│               │   ├── InfluencePath
│               │   ├── TimelineScrubber
│               │   └── ViewControls
│               ├── SimulationResults
│               │   ├── MetricsDashboard
│               │   ├── ConversionFunnel
│               │   ├── PersonaBreakdown
│               │   └── ExportButton
│               └── ExportModal
│                   ├── FormatSelector
│                   ├── ExportPreview
│                   ├── ExportProgress
│                   └── ExportSuccess
│
├── components/
│   ├── persona-builder/
│   │   ├── PersonaCard.tsx
│   │   ├── PersonaForm.tsx
│   │   ├── PersonaList.tsx
│   │   └── RoleSelector.tsx
│   ├── structured-fields/
│   │   ├── StructuredField.tsx
│   │   ├── InlineHint.tsx
│   │   ├── FrameworkSection.tsx
│   │   └── CompletionIndicator.tsx
│   ├── export/
│   │   ├── ExportModal.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── ExportPreview.tsx
│   │   └── ExportProgress.tsx
│   └── 3d-visualization/
│       ├── AgentNetwork.tsx
│       ├── AgentNode.tsx
│       ├── InfluencePath.tsx
│       ├── TimelineScrubber.tsx
│       ├── ViewControls.tsx
│       └── useAgentSimulation.ts
│
├── lib/
│   ├── export/
│   │   ├── pdf-generator.tsx
│   │   ├── docx-generator.ts
│   │   ├── notion-client.ts
│   │   └── google-docs-client.ts
│   ├── hints/
│   │   └── hint-database.ts
│   └── 3d/
│       ├── agent-positioning.ts
│       ├── influence-calculations.ts
│       └── scene-optimizations.ts
│
└── hooks/
    ├── usePersonas.ts
    ├── useStructuredFields.ts
    ├── useExport.ts
    └── use3DVisualization.ts
```

---

## 5. Error Handling & Edge Cases

| Scenario | Handling |
|----------|----------|
| User tries 6th persona | Error: "Maximum 5 personas" |
| Export generation fails | Retry x3, fallback to manual download |
| OAuth expires | Redirect re-auth, preserve intent |
| 3D visualization crashes | Fallback to 2D graph |
| No WebGL support | Auto-detect, use 2D fallback |
| SSE connection drops | Auto-reconnect with last event ID |
| Simulation > 10 min | Progress bar + "notify when done" |
| Mobile device | Disable 3D, show summary cards |

---

## 6. API Endpoints Summary

### Personas
```
GET    /api/v2/simulations/{id}/personas
POST   /api/v2/simulations/{id}/personas
PUT    /api/v2/personas/{id}
DELETE /api/v2/personas/{id}
POST   /api/v2/personas/{id}/duplicate
```

### Exports
```
POST /api/v2/exports/pdf
POST /api/v2/exports/docx
POST /api/v2/exports/notion
POST /api/v2/exports/google-docs
GET  /api/v2/exports/{id}/status
```

### Change Log
```
GET  /api/v2/simulations/{id}/changelog
POST /api/v2/simulations/{id}/changelog/annotate
```

### Streaming
```
GET /api/v2/simulations/{id}/stream  # Server-Sent Events
```

---

## 7. Testing Strategy

| Component | Test Type | Coverage |
|-----------|-----------|----------|
| PersonaBuilder | Unit + Integration | Form validation, CRUD |
| StructuredFields | Unit | Input validation, hints |
| Export Engine | Integration | All formats, error cases |
| 3D Visualization | Visual + Performance | 60fps, fallback |
| Change Log | Unit | Event tracking |

---

## 8. Dependencies

### Frontend
```json
{
  "@react-pdf/renderer": "^3.4.0",
  "docx": "^8.5.0",
  "framer-motion": "^12.38.0",
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "zustand": "^4.5.0"
}
```

### Backend
```
google-api-python-client>=2.100.0
notion-client>=2.2.0
reportlab>=4.0.0
python-docx>=1.1.0
```

---

## 9. Open Questions

1. Should we support importing personas from CSV/Excel?
2. Should exports include raw simulation data (JSON) for power users?
3. Should 3D visualization be recordable (export as video/GIF)?
4. Should we add AI-generated hints based on user's specific industry?

---

## 10. Approval

This design specification covers the completion of PM Simulator v2.0 with:
- Persona Builder (5 personas max)
- Structured Fields (What/Who/Why/Impact/When)
- Inline Hint System
- Export Engine (4 formats)
- Change Log Manager
- 3D Agent Visualization

**Next Step:** Write implementation plan using `writing-plans` skill.

---

*Document Version: 1.0*  
*Last Updated: 2026-04-08*