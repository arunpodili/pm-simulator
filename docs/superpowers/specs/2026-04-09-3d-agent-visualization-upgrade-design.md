# 3D Agent Visualization Upgrade - Design Specification

**Date:** 2026-04-09  
**Status:** Draft - Pending Review  
**Scope:** Upgrade from placeholder 50-agent Canvas to production-grade 10K-agent Three.js visualization

---

## 1. Executive Summary

### Current State
- 3D map shows only 50 static dots via 2D Canvas
- No interactivity, no detail on click
- Feels like a placeholder, doesn't build user trust
- Users cannot understand how the simulation results were generated

### Desired State
Production-grade 3D visualization displaying **10,000 AI agents** in an interactive, trust-building format:
- True 3D WebGL rendering with Three.js
- Agents clustered by conversion state with color coding
- Click any agent to see detailed persona, reasoning, and behavior
- Smooth camera controls (zoom, pan, rotate)
- Social influence connections visible between agents
- Configurable agent count (1K-10K based on user preference)

### Success Criteria
1. Renders 10K agents at 60fps on mid-range laptops
2. Users can click any agent and see details within 100ms
3. Visual design creates trust ("scientific", "data-backed" feel)
4. Works on cheapest static hosting (Vercel/Netlify - $0-5/month)
5. Loads within 3 seconds on standard internet connection

---

## 2. User Flow

### Step 1: Simulation Configuration
```
User creates simulation → Sees new field:
┌─────────────────────────────────────────┐
│  Agent Visualization Scale              │
│  ○ 1,000 agents (Fast, demo quality)     │
│  ○ 2,000 agents (Balanced)             │
│  ● 5,000 agents (Recommended)          │
│  ○ 10,000 agents (Maximum detail)      │
└─────────────────────────────────────────┘
```

### Step 2: Results Page
```
User clicks "View 3D Agent Network" → Page loads:

┌────────────────────────────────────────────────────────────┐
│  [Trust Badge] 3D Network | 5,000 AI Agents | Real Data    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│    ┌──────────────────────────────────────────────────┐   │
│    │                                                  │   │
│    │        [3D AGENT VISUALIZATION]                  │   │
│    │                                                  │   │
│    │     🟢 Green = Converted (1,240 agents)        │   │
│    │     🔴 Red = Churned (420 agents)                │   │
│    │     🟡 Yellow = Neutral (890 agents)             │   │
│    │     ⚪ White = Unaware (2,450 agents)             │   │
│    │                                                  │   │
│    │     ~~~~~~~~~~ [Influence Lines] ~~~~~~~~~~~~    │   │
│    │                                                  │   │
│    │     [Click any agent for details ▼]            │   │
│    │                                                  │   │
│    └──────────────────────────────────────────────────┘   │
│                                                            │
│  ┌──────────────┐    [Controls]    ┌──────────────┐     │
│  │ 🔍 Zoom In   │    [Rotate]      │ 👁️ Reset    │     │
│  │ 🔍 Zoom Out  │    [Pan]         │ ℹ️ Legend   │     │
│  └──────────────┘                   └──────────────┘     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Step 3: Agent Detail Interaction
```
User clicks green dot → Floating card appears:

┌────────────────────────────────────────┐
│ 🟢 Agent #1,247  ✕                   │
│ ────────────────────────────────────── │
│ Persona: Pragmatic Paul (B2B Manager)  │
│ Status: CONVERTED → Paying Customer    │
│ ────────────────────────────────────── │
│ WHY THEY CONVERTED:                    │
│ "The $49/month pricing aligned with my  │
│  budget approval process. The team     │
│  collaboration feature directly        │
│  replaced our broken Slack workflow."   │
│ ────────────────────────────────────── │
│ Pain Points: 8/10                      │
│ Tech Savviness: 6/10                   │
│ Decision Style: Analytical             │
│ ────────────────────────────────────── │
│ Influenced: 3 other agents             │
│ [View Their Network]                   │
└────────────────────────────────────────┘
```

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| 3D Rendering | Three.js + React Three Fiber | Industry standard, React-native, high performance |
| State Management | Zustand | Lightweight, fast re-renders for agent selection |
| Animation | @react-spring/three | Smooth camera transitions |
| UI Components | @react-three/drei | HTML overlays in 3D space |
| Loading | react-query | Cache agent data, manage loading states |

### 3.2 Performance Strategy

**InstancedMesh Pattern:**
```javascript
// Single draw call for all 10K agents
const instancedMesh = new THREE.InstancedMesh(
  geometry,      // Shared sphere geometry
  material,      // Shader material with color attributes
  10000          // Max agent count
);
```

**Level of Detail (LOD):**
- Distance < 50 units: Full detail (glow, shadows)
- Distance 50-200 units: Simple sphere
- Distance > 200 units: Just a colored point

**Data Loading Strategy:**
1. **Phase 1** (Load first): Positions + States (~200KB for 10K)
   ```json
   [{"i":"a1","x":145.5,"y":-89.2,"z":23.1,"s":"converted","p":"pragmatist"}]
   ```
2. **Phase 2** (On click): Full agent details fetched via API
   ```json
   {"reasoning":"...","pain_points":["..."],"influenced_by":["a2","a3"]}
   ```

### 3.3 Spatial Layout: Circular Cluster Design

**Zone Structure (Concentric Cylinders):**
```
        [Top View]
              
         ⚪⚪⚪⚪⚪
      ⚪⚪⚪⚪⚪⚪⚪
    ⚪⚪🟡🟡🟡⚪⚪⚪    Zone 4: UNaware (White)
   ⚪⚪🟡🟢🟢🟡⚪⚪    Zone 3: Neutral (Yellow)
  ⚪⚪🟡🟢🔴🟢🟡⚪⚪   Zone 2: Converted (Green)
   ⚪⚪🟡🟢🟢🟡⚪⚪    Zone 1: Churned (Red - Center)
    ⚪⚪🟡🟡🟡⚪⚪⚪
      ⚪⚪⚪⚪⚪⚪⚪
         ⚪⚪⚪⚪⚪
              
[3D View - Side]
     ┌─────────┐
    /    ⚪⚪⚪   \      Height levels:
   /   ⚪⚪⚪⚪⚪    \     - Top: Advocates (Purple glow)
  │  ⚪⚪🟡🟡⚪⚪   │    - Mid: Active/Engaged
  │ ⚪🟡🟢🔴🟢🟡⚪ │    - Base: New/Unaware
  │  ⚪⚪🟡🟡⚪⚪   │
   \   ⚪⚪⚪⚪⚪    /
    \    ⚪⚪⚪   /
     └─────────┘
```

**Agent Distribution Algorithm:**
```javascript
function calculateAgentPosition(agent, totalAgents) {
  const zone = getZoneForState(agent.state); // Returns angle range + height
  const clusterIndex = getPersonaCluster(agent.persona_type); // Groups by type
  
  // Spiral distribution within zone
  const angle = zone.startAngle + (clusterIndex / totalInCluster) * zone.arcWidth;
  const radius = baseRadius + (Math.random() * zone.depth);
  const height = zone.baseHeight + (Math.random() * zone.heightVariation);
  
  return {
    x: radius * Math.cos(angle),
    y: height,
    z: radius * Math.sin(angle)
  };
}
```

### 3.4 Color System

| State | Color Hex | Three.js Color | Meaning |
|-------|-----------|----------------|---------|
| Converted | #10B981 | `0x10B981` | Green - Ready to pay |
| Active | #34D399 | `0x34D399` | Light Green - Engaged user |
| Advocate | #A855F7 | `0xA855F7` | Purple - Promoting product |
| Neutral | #F59E0B | `0xF59E0B` | Yellow - Considering |
| Unaware | #94A3B8 | `0x94A3B8` | Gray - Not reached |
| Churned | #F43F5E | `0xF43F5E` | Red - Rejected/churned |

### 3.5 Social Connection Lines

**Implementation:** `THREE.LineSegments` with BufferGeometry
- Show connections between agents with `influence_strength > 0.5`
- Line opacity based on strength (0.1 - 0.6)
- Color gradient from source to target agent
- Max 5,000 lines visible at once (performance limit)

---

## 4. Component Structure

```
src/
├── components/
│   └── 3d-visualization/
│       ├── AgentNetwork3D.tsx          # Main container
│       ├── AgentInstancedMesh.tsx      # 10K agent renderer
│       ├── ConnectionLines.tsx         # Social graph lines
│       ├── AgentDetailCard.tsx         # Floating HTML card
│       ├── CameraControls.tsx          # Orbit controls wrapper
│       ├── TrustBadge.tsx              # "10K data-backed" badge
│       ├── Legend.tsx                  # Color explanation
│       ├── StatsOverlay.tsx            # Live counters
│       └── hooks/
│           ├── useAgentData.ts         # Load agent JSON
│           ├── useSelectedAgent.ts     # Click state
│           └── useCameraAnimation.ts   # Smooth transitions
├── lib/
│   └── 3d/
│       ├── agentGeometry.ts            # Shared geometries
│       ├── agentMaterials.ts           # Shader materials
│       └── positionCalculator.ts       # Layout algorithm
└── types/
    └── agent3d.ts                      # TypeScript interfaces
```

---

## 5. Data Models

### 5.1 Agent Data (Simplified - Loaded on init)
```typescript
interface Agent3D {
  id: string;              // "agent-1" to "agent-10000"
  x: number;               // -500 to 500
  y: number;               // -100 to 100 (height = engagement level)
  z: number;               // -500 to 500
  state: AgentState;       // "converted" | "churned" | etc.
  persona_type: string;    // "pragmatist" | "enthusiast" | etc.
  influence_score: number; // 0.0 to 1.0
}
```

### 5.2 Agent Detail (Loaded on click)
```typescript
interface AgentDetail {
  id: string;
  persona: {
    name: string;
    role: string;
    pain_points: string[];
    tech_savviness: number;
    decision_style: string;
  };
  conversion_reasoning: string;      // Template-based text
  behavioral_traits: {
    price_sensitivity: number;
    feature_preference: string;
  };
  communication_history: {
    influenced_by: string[];         // Agent IDs
    influenced: string[];            // Agent IDs
  };
  journey: {
    day: number;
    state: AgentState;
    action: string;
  }[];
}
```

### 5.3 API Endpoints
```
GET /api/simulation/{id}/agents3d
  Response: Agent3D[] (simplified data)
  
GET /api/simulation/{id}/agents/{agent_id}/detail
  Response: AgentDetail (full data)
  
GET /api/simulation/{id}/connections
  Response: {source: string, target: string, strength: number}[]
```

---

## 6. Trust Building Elements

### 6.1 Trust Badge (Always Visible)
```
┌─────────────────────────────────────────────┐
│ 🛡️  TrustScore: Data-Backed Simulation     │
│ ─────────────────────────────────────────── │
│ ✓ 10,000 AI agents simulated                │
│ ✓ 95.2% prediction accuracy                 │
│ ✓ 6 persona types modeled                   │
│ ✓ Social influence graph calculated         │
└─────────────────────────────────────────────┘
```

### 6.2 Visual Trust Signals
- **Particle effects** around converted agents (subtle success glow)
- **Pulsing animation** on high-influence agents (thought leaders)
- **Connection pulse** when agents influence each other
- **Depth of field** blur on background (focuses attention, feels premium)

### 6.3 Data Transparency
- Click "View Raw Data" → Shows JSON behind the visualization
- Hover on metrics → Shows confidence intervals
- Timestamp: "Generated 2026-04-09 at 14:32:15"

---

## 7. Performance Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| Initial Load | < 2s | 3s |
| Agent Data Load | < 1s | 2s |
| FPS | 60fps | 30fps |
| Memory | < 200MB | 300MB |
| Click-to-Detail | < 100ms | 250ms |
| Total Bundle | < 500KB | 1MB |

---

## 8. Error Handling

### 8.1 WebGL Not Supported
```
┌─────────────────────────────────────────┐
│ ⚠️ 3D Visualization Unavailable          │
│                                         │
│ Your browser doesn't support WebGL.     │
│                                         │
│ [View 2D Simplified Version]            │
│ [Download Results as PDF]               │
└─────────────────────────────────────────┘
```

### 8.2 Low Performance Mode
If FPS < 30 for 5 seconds:
- Automatically reduce visible agents to 5,000
- Show toast: "Switched to reduced detail for performance"

### 8.3 Data Loading Fail
- Retry 3 times with exponential backoff
- Show skeleton placeholder in 3D view
- Allow user to retry manually

---

## 9. Accessibility

- **Keyboard navigation**: Tab through agents, Enter to select
- **Screen reader**: "3D visualization showing 10,000 agents..."
- **High contrast mode**: Boost agent color saturation
- **Reduced motion**: Disable camera auto-rotation

---

## 10. Implementation Phases

### Phase 1: Core Infrastructure (Day 1-2)
- Set up Three.js + React Three Fiber
- Create base AgentNetwork3D component
- Implement camera controls

### Phase 2: Agent Rendering (Day 3-4)
- Build InstancedMesh for 10K agents
- Implement color coding by state
- Add basic hover/click detection

### Phase 3: Layout Algorithm (Day 5-6)
- Create circular cluster positioning
- Implement zone-based distribution
- Add social connection lines

### Phase 4: Interaction (Day 7-8)
- Build floating AgentDetailCard
- Connect to backend API
- Add agent count selector (1K-10K)

### Phase 5: Trust Features (Day 9-10)
- Add TrustBadge component
- Implement loading states
- Add stats overlay
- Performance optimization

### Phase 6: Polish (Day 11-12)
- Animation polish
- Error handling
- Testing on various devices
- Documentation

---

## 11. Open Questions

1. **Backend Agent Generation**: Do we need to update the Python simulation engine to generate 10K agent positions, or can we derive them from existing simulation results?

2. **Connection Data**: Should we calculate influence connections in real-time (computationally expensive) or pre-compute during simulation?

3. **Mobile Support**: Should we show a simplified 2D version on mobile, or is 3D desktop-only?

4. **Caching**: How long should agent data be cached? Should users be able to share visualizations via URL?

---

## 12. Approval Checklist

Before implementation, confirm:
- [ ] Budget model ($0 hosting) is acceptable
- [ ] 12-day timeline works
- [ ] Design approach (InstancedMesh + Circular clusters) approved
- [ ] Agent count selector (1K-10K) confirmed
- [ ] Color coding (Green/Red/Yellow/White) confirmed
- [ ] Trust badge concept approved
- [ ] Backend API contract agreed upon

---

**Next Step:** After approval, create Implementation Plan with /superpowers-writing-plans
