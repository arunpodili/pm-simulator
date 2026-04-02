# 3D Agent Visualization Plan

**Feature:** 3D Force Graph for LLM Simulation Results  
**Goal:** Build user trust by visualizing how AI agents think and make decisions  
**Last Updated:** 2026-04-03

---

## 🎯 Why This Feature?

**User Pain Point:** Users see simulation results but don't understand HOW agents reached their conclusions. This creates doubt.

**Solution:** A 3D interactive visualization showing:
- Each agent's position in 3D space
- How agents influence each other
- Decision paths and thought processes
- Real-time trust-building transparency

---

## 📊 Comparison: Current vs Proposed

| Aspect | Current (2D D3) | Proposed (3D Force Graph) |
|--------|-----------------|---------------------------|
| **Visualization** | Flat circles and lines | 3D spheres with depth |
| **Interaction** | Click/hover only | Rotate, zoom, fly-through |
| **Trust Factor** | "Here's the result" | "See exactly how we got here" |
| **Data Shown** | Position only | Position + reasoning + influence chains |
| **User Engagement** | Passive viewing | Active exploration |

---

## 🏗️ Technical Architecture

### Library Choice: `3d-force-graph`

**Why this library?**
- Built on Three.js/WebGL (industry standard)
- React bindings available via `react-force-graph`
- Supports custom node geometries (text, images, HTML)
- Force-directed physics engine
- Interactive camera controls (trackball, orbit, fly)
- Particles on links for data flow visualization

**Alternatives Considered:**
- Raw Three.js: Too complex, requires 3D expertise
- D3 3D: Limited 3D capabilities
- Recharts: 2D only
- **Winner:** 3d-force-graph (best balance of power vs ease)

---

## 📁 Implementation Plan

### Phase 1: Data Structure (Backend)

**File:** `ai-agents-service/simulation/llm_simulation_engine.py`

**Current State:** Returns basic results
```json
{
  "report": {...},
  "personas": [...],
  "debate_results": [...]
}
```

**Required Enhancement:** Add agent reasoning chains
```json
{
  "report": {...},
  "personas": [...],
  "debate_results": [...],
  "agent_reasoning": [
    {
      "agent_id": "meeting_fatigue_manager_1",
      "persona": "Meeting Fatigue Manager",
      "position": "support",
      "confidence": 0.85,
      "reasoning": "Has 6+ meetings daily, desperately needs solution",
      "influenced_by": ["async_advocate_1", "sales_power_user_2"],
      "influenced": ["enterprise_compliance_1"],
      "debate_rounds": [
        {"round": 1, "argument": "Time savings worth price", "sentiment": "positive"},
        {"round": 2, "argument": "Integration concerns", "sentiment": "neutral"},
        {"round": 3, "argument": "Saw competitor success", "sentiment": "positive"}
      ],
      "final_position": "support"
    }
  ],
  "influence_network": {
    "nodes": [...],
    "links": [...]
  }
}
```

**Tasks:**
1. Modify `_run_mock_simulation()` to include reasoning data
2. Add `AgentReasoning` dataclass in `models.py`
3. Update debate tracking to capture influence chains

---

### Phase 2: 3D Graph Component (Frontend)

**New File:** `src/components/simulation/Agent3DGraph.tsx`

**Installation:**
```bash
npm install 3d-force-graph react-force-graph
```

**Component Structure:**
```typescript
interface Agent3DGraphProps {
  agentReasoning: AgentReasoning[];
  width?: number;
  height?: number;
  onAgentSelect?: (agent: AgentReasoning) => void;
}

export function Agent3DGraph({
  agentReasoning,
  width = 800,
  height = 600,
  onAgentSelect
}: Agent3DGraphProps) {
  // 3D force graph implementation
}
```

**Visual Design:**

1. **Nodes (Agents)**
   - Sphere geometry
   - Color: Green (support) | Red (oppose) | Gray (neutral)
   - Size: Based on influence level
   - Label: Agent name floating above
   - Hover: Glow effect + tooltip with reasoning

2. **Links (Influences)**
   - Curved lines with direction arrows
   - Color: Gradient from source to target
   - Thickness: Based on influence strength
   - Animation: Particles flowing along link (shows information transfer)

3. **Background**
   - Dark theme (matches simulation results page)
   - Subtle grid for spatial reference
   - Fog effect for depth perception

4. **Camera Controls**
   - Orbit: Rotate around center
   - Zoom: Mouse wheel
   - Pan: Right-click drag
   - Reset: Double-click

**Code Sketch:**
```typescript
import ForceGraph3D from 'react-force-graph-3d';
import { SpriteMaterial, Sprite, TextureLoader } from 'three';

export function Agent3DGraph({ agentReasoning, width, height }) {
  const graphData = useMemo(() => {
    const nodes = agentReasoning.map(agent => ({
      id: agent.agent_id,
      name: agent.persona,
      color: agent.position === 'support' ? '#22c55e' : 
             agent.position === 'oppose' ? '#ef4444' : '#6b7280',
      val: agent.confidence * 10, // Size based on confidence
      reasoning: agent.reasoning,
      debateRounds: agent.debate_rounds
    }));

    const links = agentReasoning.flatMap(agent =>
      agent.influenced_by.map(sourceId => ({
        source: sourceId,
        target: agent.agent_id,
        value: 1 // Influence strength
      }))
    );

    return { nodes, links };
  }, [agentReasoning]);

  return (
    <ForceGraph3D
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="#0f172a" // Dark slate
      nodeLabel="name"
      linkDirectionalArrowLength={6}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      linkWidth={2}
      onNodeClick={handleNodeClick}
      nodeThreeObject={node => {
        // Custom 3D object with label
        const sprite = new Sprite(
          new SpriteMaterial({ map: createTextTexture(node.name) })
        );
        sprite.scale.set(40, 20, 1);
        return sprite;
      }}
    />
  );
}
```

---

### Phase 3: Integration with Results Page

**File:** `src/components/simulation/LLMSimulationResults.tsx`

**Current Tabs:** "report" | "personas" | "debates" | "graph"

**New Tab:** "3D Network"

**Placement:** Add as 5th tab or replace existing "graph" tab

**Integration Code:**
```typescript
// In LLMSimulationResults.tsx
import { Agent3DGraph } from "./Agent3DGraph";

// Add new tab
const [activeTab, setActiveTab] = useState<
  "report" | "personas" | "debates" | "graph" | "3d-network"
>("report");

// In tab buttons
<button
  onClick={() => setActiveTab("3d-network")}
  className={activeTab === "3d-network" ? "active" : ""}
>
  <Network className="w-4 h-4 mr-2" />
  3D Network
</button>

// In content area
{activeTab === "3d-network" && (
  <div className="bg-gray-900 rounded-xl overflow-hidden">
    <Agent3DGraph
      agentReasoning={data.agent_reasoning || []}
      width={800}
      height={600}
      onAgentSelect={handleAgentSelect}
    />
  </div>
)}
```

---

### Phase 4: Agent Detail Panel

**New Component:** `src/components/simulation/AgentDetailPanel.tsx`

**Purpose:** Show reasoning when user clicks an agent in 3D graph

**Features:**
- Agent avatar/persona image
- Position badge (support/oppose/neutral)
- Confidence score progress bar
- Reasoning text
- Debate round timeline
- "Who influenced this agent" list
- "Who did this agent influence" list

**Design:**
```
┌─────────────────────────────────────┐
│  👤 Meeting Fatigue Manager         │
│  🟢 Supporting (85% confidence)    │
├─────────────────────────────────────┤
│  Reasoning:                         │
│  "Has 6+ meetings daily, desperately│
│   needs a solution. Saw competitor   │
│   succeed with similar tool."        │
├─────────────────────────────────────┤
│  Debate Journey:                    │
│  Round 1: 🤔 Neutral                │
│  Round 2: ✅ Positive (influenced)    │
│  Round 3: ✅ Strong Support         │
├─────────────────────────────────────┤
│  Influenced By:                     │
│  • Async-First Advocate             │
│  • Sales Power User                 │
├─────────────────────────────────────┤
│  Influenced:                        │
│  • Enterprise Compliance Lead       │
└─────────────────────────────────────┘
```

---

### Phase 5: Trust Indicators

**Add to Results Header:**

```typescript
// In LLMSimulationResults.tsx header section
<div className="flex items-center gap-4">
  <TrustIndicator 
    transparencyScore={calculateTransparencyScore(data)}
    agentsVisualized={data.agent_reasoning?.length || 0}
  />
</div>

// TrustIndicator component
function TrustIndicator({ transparencyScore, agentsVisualized }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
      <Shield className="w-5 h-5 text-green-400" />
      <div>
        <div className="text-sm font-medium">Transparent AI</div>
        <div className="text-xs text-white/70">
          {agentsVisualized} agents visualized • {transparencyScore}% transparency
        </div>
      </div>
    </div>
  );
}
```

---

## 📦 File Changes Required

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `3d-force-graph` and `react-force-graph` dependencies |
| `ai-agents-service/simulation/llm_simulation_engine.py` | Modify | Add agent reasoning tracking |
| `ai-agents-service/simulation/models.py` | Modify | Add `AgentReasoning` dataclass |
| `src/components/simulation/Agent3DGraph.tsx` | Create | New 3D graph component |
| `src/components/simulation/AgentDetailPanel.tsx` | Create | Agent reasoning detail view |
| `src/components/simulation/LLMSimulationResults.tsx` | Modify | Add "3D Network" tab and integration |
| `src/components/simulation/TrustIndicator.tsx` | Create | Transparency badge component |

---

## 🎨 UI/UX Flow

```
User runs simulation
        ↓
Results page loads
        ↓
User sees "3D Network" tab
        ↓
Clicks tab
        ↓
3D graph animates in
        ↓
User sees 30-50 floating spheres
        ↓
Colors show positions (green/red/gray)
        ↓
Particles flow along influence lines
        ↓
User rotates view (orbit controls)
        ↓
User clicks on agent
        ↓
Detail panel slides in
        ↓
User reads reasoning + debate journey
        ↓
Trust established ✓
```

---

## ⚠️ Technical Considerations

### Performance
- **Issue:** 50 agents × 3D rendering = potential lag
- **Mitigation:** Use `react-force-graph` which optimizes rendering
- **Fallback:** If FPS < 30, switch to 2D mode automatically

### Browser Compatibility
- **Issue:** WebGL not supported in all browsers
- **Mitigation:** Detect WebGL support, fallback to 2D D3 graph

### Mobile
- **Issue:** 3D interaction difficult on touch devices
- **Mitigation:** Simplified controls, auto-rotate mode

### Bundle Size
- **Issue:** Three.js adds ~500KB
- **Mitigation:** Dynamic import, only load when user opens 3D tab

---

## 📊 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| 3D Tab Open Rate | >30% | Analytics on tab clicks |
| Time Spent in 3D | >60s | Session duration tracking |
| Agent Click Rate | >50% | Click events on nodes |
| User Trust Score | +20% | Post-simulation survey |
| Performance | 60 FPS | Browser dev tools |

---

## 🚀 Implementation Steps

### Step 1: Setup (30 min)
```bash
npm install 3d-force-graph react-force-graph
# Verify installation works
```

### Step 2: Backend Data (2 hours)
- Modify `llm_simulation_engine.py`
- Add reasoning tracking
- Test API response

### Step 3: Basic 3D Component (3 hours)
- Create `Agent3DGraph.tsx`
- Basic node/link rendering
- Color coding by position

### Step 4: Interactivity (3 hours)
- Node click handlers
- Camera controls
- Hover tooltips

### Step 5: Detail Panel (2 hours)
- Create `AgentDetailPanel.tsx`
- Wire up to graph clicks
- Style with Tailwind

### Step 6: Integration (1 hour)
- Add to `LLMSimulationResults.tsx`
- Tab switching
- Data flow

### Step 7: Polish (2 hours)
- Loading states
- Error handling
- Mobile responsiveness
- Performance optimization

**Total Estimated Time:** ~13 hours

---

## 🎓 User Education

**Add tooltip to 3D tab:**
```
"Explore how each AI agent formed their opinion. 
Rotate, zoom, and click agents to see their reasoning."
```

**First-time user tour:**
```
1. "Welcome to the 3D Network view"
2. "Each sphere is an AI agent"
3. "Colors show their position: green = support, red = oppose"
4. "Lines show who influenced whom"
5. "Click any agent to see their reasoning"
6. "Drag to rotate, scroll to zoom"
```

---

## ✅ Checklist Before Implementation

- [ ] User confirmed this feature addresses trust concerns
- [ ] Backend can provide agent reasoning data
- [ ] Bundle size increase acceptable (~500KB)
- [ ] Browser WebGL support verified
- [ ] Design team approved 3D visualization approach
- [ ] Performance budget established (60 FPS target)

---

## 🔗 References

- **Library:** https://github.com/vasturiano/3d-force-graph
- **React bindings:** https://github.com/vasturiano/react-force-graph
- **Demo:** https://vasturiano.github.io/3d-force-graph/example/large-graph/
- **Current 2D Graph:** `src/components/simulation/AgentGraph.tsx`

---

## 💡 Why This Builds Trust

1. **Transparency:** Users SEE the thinking process, not just results
2. **Verifiability:** Can check if agent reasoning makes sense
3. **Complexity Visualization:** Shows how 30-50 agents interact
4. **Control:** User can explore at their own pace
5. **Education:** Users learn how AI makes decisions

**Result:** Users trust results because they understand HOW they were made.

---

## 📋 Recommendation

**GO/NO-GO Decision:**

✅ **GO** — This feature addresses a real pain point (trust) with a proven solution (3d-force-graph used by thousands of projects). The implementation is straightforward with clear steps.

**Next Step:** Run `/ccg:execute .claude/plan/3d-agent-visualization.md` to start implementation.
