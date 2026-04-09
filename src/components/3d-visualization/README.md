# 3D Agent Visualization

Production-grade Three.js visualization for displaying 10,000+ AI agents in an interactive 3D environment.

## Features

- **10K Agents**: Renders 10,000+ agents at 60fps using Three.js InstancedMesh
- **State-Based Colors**: Green (converted), Red (churned), Yellow (engaged), Gray (unaware)
- **Interactive**: Click any agent to see detailed reasoning and behavior
- **Camera Controls**: Zoom, pan, and rotate with smooth OrbitControls
- **Trust Building**: "Data-Backed Simulation" badge with verification checkmarks
- **WebGL Fallback**: Graceful degradation for unsupported browsers
- **Performance Monitoring**: Auto-reduces quality if FPS drops below 30

## Components

### AgentNetwork3D
Main container component that orchestrates the 3D scene.

```tsx
<AgentNetwork3D 
  agents={agents}           // Agent3D[] - positions and states
  agentCount={10000}        // Number for trust badge
  height={400}              // Canvas height in pixels
/>
```

### AgentInstancedMesh
Core rendering component using Three.js InstancedMesh for performance.

### AgentDetailCard
Floating detail overlay showing agent reasoning on click.

### TrustBadge
Top-left badge displaying simulation credibility info.

### StatsOverlay
Bottom stats showing agent counts by state.

## Hooks

### useAgentData
```tsx
const { agents, loading, error } = useAgentData(simulationId, agentCount);
```

Loads agent positions and states. Currently generates mock data with realistic distribution.

### usePerformanceMonitor
```tsx
const { fps, quality } = usePerformanceMonitor();
```

Tracks FPS and auto-adjusts quality (high/medium/low) based on performance.

### useSelectedAgent
```tsx
const { selectedAgent, selectAgent, clearSelection } = useSelectedAgent();
```

Manages selected agent state with async detail loading.

## Color System

| State | Color | Hex |
|-------|-------|-----|
| Converted | Green | #10B981 |
| Active | Light Green | #34D399 |
| Engaged | Gold | #F59E0B |
| Aware | Cyan | #06b6d4 |
| Unaware | Gray | #94A3B8 |
| Churned | Red | #F43F5E |
| Advocate | Purple | #A855F7 |

## Performance

- **Rendering**: Single GPU draw call via InstancedMesh
- **Optimization**: Auto quality reduction if FPS < 30
- **Loading**: Progressive loading with visual feedback
- **Fallback**: 2D fallback for WebGL-unsupported browsers

## Usage

```tsx
import { AgentNetwork3D, useAgentData } from '@/components/3d-visualization';

function MyComponent() {
  const { agents, loading } = useAgentData('sim-123', 10000);
  
  if (loading) return <Loading />;
  
  return <AgentNetwork3D agents={agents} agentCount={10000} />;
}
```
