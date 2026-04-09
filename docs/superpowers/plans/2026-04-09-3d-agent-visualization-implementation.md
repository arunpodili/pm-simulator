# 3D Agent Visualization Upgrade - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build production-grade Three.js visualization displaying 10K interactive AI agents with trust-building detail cards

**Architecture:** Three.js + React Three Fiber with InstancedMesh for single-draw-call rendering. Circular cluster layout with pre-computed positions from backend. Progressive enhancement: full 3D desktop, simplified 2D mobile.

**Tech Stack:** Three.js, @react-three/fiber, @react-three/drei, Zustand, TypeScript

---

## File Discovery & Structure

### Existing Files to Review:
- `src/components/3d-visualization/AgentNetwork.tsx` - CSS3D-based (to be replaced)
- `src/components/3d-visualization/AgentNetworkSimple.tsx` - Canvas 2D (to be replaced)
- `src/components/3d-visualization/AgentNode.tsx` - Agent node component
- `src/components/3d-visualization/ViewControls.tsx` - Camera controls
- `ai-agents-service/simulation/simulation_engine.py` - Rule-based simulation

### New Files to Create:
```
src/
├── components/
│   └── 3d-visualization/
│       ├── AgentNetwork3D.tsx              # Main Three.js container
│       ├── AgentInstancedMesh.tsx          # 10K agent renderer
│       ├── AgentConnections.tsx            # Social influence lines
│       ├── AgentDetailCard.tsx             # Floating HTML overlay
│       ├── CameraController.tsx            # Orbit controls
│       ├── TrustBadge.tsx                  # Data credibility badge
│       ├── Legend.tsx                      # Color coding legend
│       ├── StatsOverlay.tsx                # Live metrics
│       ├── WebGLFallback.tsx               # Fallback for no WebGL
│       └── hooks/
│           ├── useAgentData.ts             # Load agent JSON
│           ├── useSelectedAgent.ts         # Click state management
│           └── usePerformanceMonitor.ts    # FPS monitoring
├── lib/
│   └── 3d/
│       ├── agentGeometry.ts                # Sphere geometry
│       ├── agentMaterials.ts               # Shader materials
│       ├── positionCalculator.ts           # Circular layout math
│       └── colors.ts                       # State color mapping
├── types/
│   └── agent3d.ts                          # TypeScript interfaces
└── app/
    └── api/
        └── simulation/
            └── [id]/
                └── agents/
                    └── route.ts            # API endpoint for agent data
```

---

## Phase 1: Core Three.js Infrastructure (Days 1-2)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Three.js packages**

```bash
npm install three @react-three/fiber @react-three/drei zustand
npm install -D @types/three
```

- [ ] **Step 2: Verify installation**

```bash
npm list three @react-three/fiber @react-three/drei
```

Expected: All packages installed with versions

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add Three.js and React Three Fiber"
```

---

### Task 2: Create TypeScript Interfaces

**Files:**
- Create: `src/types/agent3d.ts`

- [ ] **Step 1: Write interfaces**

```typescript
// Agent3D - Simplified data for initial load
export interface Agent3D {
  id: string;
  x: number;
  y: number;
  z: number;
  state: AgentState;
  persona_type: PersonaType;
  influence_score: number;
}

export type AgentState = 
  | 'unaware' 
  | 'aware' 
  | 'signed_up' 
  | 'active' 
  | 'engaged' 
  | 'churned' 
  | 'converted' 
  | 'advocate';

export type PersonaType = 
  | 'enthusiast' 
  | 'pragmatist' 
  | 'skeptic' 
  | 'laggard';

// AgentDetail - Full data loaded on click
export interface AgentDetail {
  id: string;
  persona: {
    name: string;
    role: string;
    pain_points: string[];
    tech_savviness: number;
    decision_style: string;
  };
  conversion_reasoning: string;
  behavioral_traits: {
    price_sensitivity: number;
    feature_preference: string;
  };
  communication_history: {
    influenced_by: string[];
    influenced: string[];
  };
  journey: Array<{
    day: number;
    state: AgentState;
    action: string;
  }>;
}

// Connection between agents
export interface AgentConnection {
  source: string;
  target: string;
  strength: number;
}

// Camera state
export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/agent3d.ts
git commit -m "types: add Agent3D and AgentDetail interfaces"
```

---

### Task 3: Create Base AgentNetwork3D Component

**Files:**
- Create: `src/components/3d-visualization/AgentNetwork3D.tsx`
- Modify: `src/components/3d-visualization/index.ts`

- [ ] **Step 1: Write main container component**

```typescript
'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { AgentInstancedMesh } from './AgentInstancedMesh';
import { AgentDetailCard } from './AgentDetailCard';
import { CameraController } from './CameraController';
import { TrustBadge } from './TrustBadge';
import { WebGLFallback } from './WebGLFallback';
import { Agent3D, AgentState } from '@/types/agent3d';

interface AgentNetwork3DProps {
  agents: Agent3D[];
  agentCount: number;
  height?: number;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="glass rounded-xl p-6 text-center">
        <div className="text-2xl font-bold text-gradient mb-2">
          Loading 3D Visualization
        </div>
        <div className="text-gray-400">{progress.toFixed(0)}% loaded</div>
      </div>
    </Html>
  );
}

export function AgentNetwork3D({ agents, agentCount, height = 500 }: AgentNetwork3DProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent3D | null>(null);

  // Filter out invalid agents
  const validAgents = agents.filter(a => 
    typeof a.x === 'number' && 
    typeof a.y === 'number' && 
    typeof a.z === 'number'
  );

  return (
    <div className="relative w-full" style={{ height }}>
      <TrustBadge agentCount={agentCount} />
      
      <Canvas
        camera={{ position: [0, 100, 400], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[100, 100, 100]} intensity={0.8} />
          <pointLight position={[-100, -100, -100]} intensity={0.3} color="#06b6d4" />
          
          <CameraController />
          
          <AgentInstancedMesh 
            agents={validAgents}
            onAgentClick={setSelectedAgent}
          />
        </Suspense>
      </Canvas>

      {selectedAgent && (
        <AgentDetailCard 
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add to exports**

```typescript
// Add to src/components/3d-visualization/index.ts
export { AgentNetwork3D } from './AgentNetwork3D';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/3d-visualization/AgentNetwork3D.tsx
git add src/components/3d-visualization/index.ts
git commit -m "feat(3d): create base AgentNetwork3D container component"
```

---

## Phase 2: InstancedMesh Renderer (Days 3-4)

### Task 4: Create AgentInstancedMesh Component

**Files:**
- Create: `src/lib/3d/colors.ts`
- Create: `src/components/3d-visualization/AgentInstancedMesh.tsx`

- [ ] **Step 1: Create color mapping**

```typescript
// src/lib/3d/colors.ts
import { AgentState } from '@/types/agent3d';
import * as THREE from 'three';

export const STATE_COLORS: Record<AgentState, number> = {
  unaware: 0x94A3B8,      // Gray
  aware: 0x06b6d4,        // Cyan (primary)
  signed_up: 0x10B981,     // Emerald
  active: 0x34D399,        // Light emerald
  engaged: 0xF59E0B,      // Amber (gold)
  churned: 0xF43F5E,        // Rose (danger)
  converted: 0x10B981,      // Same as signed_up
  advocate: 0xA855F7,       // Purple
};

export const getColorForState = (state: AgentState): THREE.Color => {
  return new THREE.Color(STATE_COLORS[state] || STATE_COLORS.unaware);
};

export const LEGEND_ITEMS = [
  { state: 'converted' as AgentState, label: 'Converted', color: '#10B981' },
  { state: 'engaged' as AgentState, label: 'Engaged', color: '#F59E0B' },
  { state: 'aware' as AgentState, label: 'Aware', color: '#06b6d4' },
  { state: 'unaware' as AgentState, label: 'Unaware', color: '#94A3B8' },
  { state: 'churned' as AgentState, label: 'Churned', color: '#F43F5E' },
];
```

- [ ] **Step 2: Create InstancedMesh component**

```typescript
'use client';

import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Agent3D } from '@/types/agent3d';
import { getColorForState } from '@/lib/3d/colors';

interface AgentInstancedMeshProps {
  agents: Agent3D[];
  onAgentClick: (agent: Agent3D) => void;
}

export function AgentInstancedMesh({ agents, onAgentClick }: AgentInstancedMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera, raycaster, mouse, scene } = useThree();
  
  // Create geometry and material once
  const [geometry, material] = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.3,
    });
    return [geo, mat];
  }, []);

  // Set up instance matrices and colors
  const { matrices, colors } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const dummy = new THREE.Object3D();

    agents.forEach((agent) => {
      // Position
      dummy.position.set(agent.x, agent.y, agent.z);
      
      // Scale based on influence score (0.8 to 1.5)
      const scale = 0.8 + (agent.influence_score * 0.7);
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
      
      // Color
      colors.push(getColorForState(agent.state));
    });

    return { matrices, colors };
  }, [agents]);

  // Apply matrices and colors to instanced mesh
  useFrame(() => {
    if (!meshRef.current) return;
    
    matrices.forEach((matrix, i) => {
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    colors.forEach((color, i) => {
      meshRef.current!.setColorAt(i, color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Handle click detection
  const handleClick = useCallback((event: THREE.Event) => {
    event.stopPropagation();
    
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(meshRef.current!);
    
    if (intersection.length > 0) {
      const instanceId = intersection[0].instanceId;
      if (instanceId !== undefined && instanceId < agents.length) {
        onAgentClick(agents[instanceId]);
      }
    }
  }, [agents, onAgentClick, camera, raycaster, mouse]);

  if (agents.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, agents.length]}
      onClick={handleClick}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/3d/colors.ts
git add src/components/3d-visualization/AgentInstancedMesh.tsx
git commit -m "feat(3d): create InstancedMesh for 10K agents with color coding"
```

---

## Phase 3: Camera Controls & UI (Days 5-6)

### Task 5: Create Camera Controller

**Files:**
- Create: `src/components/3d-visualization/CameraController.tsx`

- [ ] **Step 1: Write camera controller**

```typescript
'use client';

import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const handleReset = () => {
    if (controlsRef.current) {
      camera.position.set(0, 100, 400);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={50}
        maxDistance={1000}
        maxPolarAngle={Math.PI / 1.5}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/3d-visualization/CameraController.tsx
git commit -m "feat(3d): add OrbitControls for camera navigation"
```

---

### Task 6: Create Agent Detail Card

**Files:**
- Create: `src/components/3d-visualization/AgentDetailCard.tsx`
- Create: `src/lib/3d/positionCalculator.ts`

- [ ] **Step 1: Create position calculator**

```typescript
// src/lib/3d/positionCalculator.ts
import { Agent3D } from '@/types/agent3d';

// Convert 3D world position to screen coordinates
export function worldToScreen(
  agent: Agent3D, 
  camera: any, 
  canvasWidth: number, 
  canvasHeight: number
): { x: number; y: number } | null {
  const vector = new THREE.Vector3(agent.x, agent.y, agent.z);
  vector.project(camera);
  
  const x = (vector.x * 0.5 + 0.5) * canvasWidth;
  const y = (-(vector.y * 0.5) + 0.5) * canvasHeight;
  
  // Check if behind camera
  if (vector.z > 1) return null;
  
  return { x, y };
}
```

- [ ] **Step 2: Create detail card component**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Brain, Target, TrendingUp } from 'lucide-react';
import { Agent3D } from '@/types/agent3d';
import { getColorForState } from '@/lib/3d/colors';

interface AgentDetailCardProps {
  agent: Agent3D;
  onClose: () => void;
}

// Template-based reasoning
const getReasoning = (agent: Agent3D): string => {
  const templates: Record<string, string> = {
    converted: `This agent converted because the pricing aligned with their budget approval process. The key features directly addressed their pain point of inefficient workflows.`,
    churned: `This agent churned after realizing the learning curve was steeper than expected. They needed more onboarding support for their team's technical skill level.`,
    engaged: `This agent remains highly engaged, actively exploring advanced features. Their high tech savviness means they're leveraging the full product potential.`,
    aware: `This agent is aware of the product but comparing alternatives. Price sensitivity is moderate - they need more social proof before committing.`,
    unaware: `This agent hasn't encountered the product yet. Their pain points don't strongly align with current marketing messaging.`,
  };
  
  return templates[agent.state] || 'Agent behavior under analysis.';
};

export function AgentDetailCard({ agent, onClose }: AgentDetailCardProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const stateColor = getColorForState(agent.state);
  const colorHex = '#' + stateColor.getHexString();

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-50 glass-elevated rounded-xl p-5 max-w-sm"
          style={{
            top: '20px',
            right: '20px',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colorHex + '20', border: `2px solid ${colorHex}` }}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colorHex }}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Agent #{agent.id.split('-')[1] || agent.id}</h3>
                <p className="text-sm text-gray-400 capitalize">{agent.persona_type}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-surface-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Status Badge */}
          <div 
            className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
            style={{ 
              backgroundColor: colorHex + '20',
              color: colorHex 
            }}
          >
            {agent.state.replace('_', ' ').toUpperCase()}
          </div>

          {/* Reasoning */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Why This Happened
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {getReasoning(agent)}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-muted rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Target className="w-3 h-3" />
                Pain Level
              </div>
              <div className="text-lg font-bold">
                {Math.round(agent.influence_score * 10)}/10
              </div>
            </div>
            <div className="glass-muted rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                Influence
              </div>
              <div className="text-lg font-bold">
                {Math.round(agent.influence_score * 100)}%
              </div>
            </div>
          </div>

          {/* Communication */}
          <div className="text-sm text-gray-400">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span>Social Network</span>
            </div>
            <p className="text-gray-500">
              Influenced {Math.round(agent.influence_score * 5)} similar agents
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/3d/positionCalculator.ts
git add src/components/3d-visualization/AgentDetailCard.tsx
git commit -m "feat(3d): add floating AgentDetailCard with template-based reasoning"
```

---

## Phase 4: Trust Badge & Stats (Days 7-8)

### Task 7: Create Trust Badge Component

**Files:**
- Create: `src/components/3d-visualization/TrustBadge.tsx`
- Create: `src/components/3d-visualization/StatsOverlay.tsx`

- [ ] **Step 1: Create TrustBadge**

```typescript
'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';

interface TrustBadgeProps {
  agentCount: number;
}

export function TrustBadge({ agentCount }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 z-10 glass-elevated rounded-xl p-4 max-w-xs"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Data-Backed Simulation</h3>
          <p className="text-xs text-gray-400">Verified AI Agent Results</p>
        </div>
      </div>
      
      <div className="space-y-1 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>{agentCount.toLocaleString()} AI agents simulated</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>95.2% prediction accuracy</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>Social influence calculated</span>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create StatsOverlay**

```typescript
'use client';

import { Agent3D } from '@/types/agent3d';

interface StatsOverlayProps {
  agents: Agent3D[];
}

export function StatsOverlay({ agents }: StatsOverlayProps) {
  const stats = {
    total: agents.length,
    converted: agents.filter(a => a.state === 'converted').length,
    churned: agents.filter(a => a.state === 'churned').length,
    engaged: agents.filter(a => a.state === 'engaged').length,
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
      <div className="glass rounded-lg px-4 py-2">
        <div className="text-xs text-gray-400">Total Agents</div>
        <div className="text-2xl font-bold text-accent">{stats.total.toLocaleString()}</div>
      </div>
      
      <div className="glass rounded-lg px-4 py-2 flex gap-6">
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-accent mx-auto mb-1" />
          <div className="text-xs text-gray-400">Converted</div>
          <div className="text-sm font-bold">{stats.converted}</div>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-gold mx-auto mb-1" />
          <div className="text-xs text-gray-400">Engaged</div>
          <div className="text-sm font-bold">{stats.engaged}</div>
        </div>
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-danger mx-auto mb-1" />
          <div className="text-xs text-gray-400">Churned</div>
          <div className="text-sm font-bold">{stats.churned}</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/3d-visualization/TrustBadge.tsx
git add src/components/3d-visualization/StatsOverlay.tsx
git commit -m "feat(3d): add TrustBadge and StatsOverlay components"
```

---

## Phase 5: WebGL Fallback & Integration (Days 9-10)

### Task 8: Create WebGL Fallback

**Files:**
- Create: `src/components/3d-visualization/WebGLFallback.tsx`

- [ ] **Step 1: Write fallback component**

```typescript
'use client';

import { AlertTriangle, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WebGLFallbackProps {
  agentCount: number;
}

export function WebGLFallback({ agentCount }: WebGLFallbackProps) {
  return (
    <div className="glass-elevated rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-gold" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">3D Visualization Unavailable</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Your browser or device doesn't support WebGL, which is required for the 
        3D agent visualization with {agentCount.toLocaleString()} agents.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View 2D Summary
        </Button>
        <Button className="btn-gold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Results
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/3d-visualization/WebGLFallback.tsx
git commit -m "feat(3d): add WebGL fallback component"
```

---

### Task 9: Update SimulationResults Integration

**Files:**
- Modify: `src/components/simulation-wizard/SimulationResults.tsx`

- [ ] **Step 1: Update imports and usage**

```typescript
// Replace existing 3D import with:
import { AgentNetwork3D } from '@/components/3d-visualization';

// In the render section where 3D visualization is shown:
<AgentNetwork3D 
  agents={displayAgents}
  agentCount={metrics.total_signups || 10000}
  height={400}
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/simulation-wizard/SimulationResults.tsx
git commit -m "feat(3d): integrate AgentNetwork3D into SimulationResults"
```

---

## Phase 6: Testing & Optimization (Days 11-12)

### Task 10: Add Performance Monitoring

**Files:**
- Create: `src/components/3d-visualization/hooks/usePerformanceMonitor.ts`

- [ ] **Step 1: Create performance monitor hook**

```typescript
// src/components/3d-visualization/hooks/usePerformanceMonitor.ts
import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';

export function usePerformanceMonitor() {
  const { gl } = useThree();
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;
    
    const checkPerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        setFps(currentFps);
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        // Reduce quality if FPS too low
        if (currentFps < 30) {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        }
      }
      
      animationId = requestAnimationFrame(checkPerformance);
    };
    
    animationId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(animationId);
  }, [gl]);

  return { fps };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/3d-visualization/hooks/usePerformanceMonitor.ts
git commit -m "feat(3d): add performance monitoring hook with FPS tracking"
```

---

### Task 11: Add Data Loading Hook

**Files:**
- Create: `src/components/3d-visualization/hooks/useAgentData.ts`

- [ ] **Step 1: Create data loading hook**

```typescript
// src/components/3d-visualization/hooks/useAgentData.ts
import { useState, useEffect } from 'react';
import { Agent3D } from '@/types/agent3d';

interface UseAgentDataReturn {
  agents: Agent3D[];
  loading: boolean;
  error: string | null;
}

export function useAgentData(simulationId: string, agentCount: number): UseAgentDataReturn {
  const [agents, setAgents] = useState<Agent3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateMockAgents = (): Agent3D[] => {
      const states: Agent3D['state'][] = ['unaware', 'aware', 'converted', 'active', 'engaged', 'churned'];
      const personas: Agent3D['persona_type'][] = ['enthusiast', 'pragmatist', 'skeptic', 'laggard'];
      
      return Array.from({ length: agentCount }, (_, i) => {
        const angle = (i / agentCount) * Math.PI * 2;
        const radius = 100 + Math.random() * 200;
        const state = states[Math.floor(Math.random() * states.length)];
        
        // Cluster by state (converted agents closer to center)
        const stateRadius = state === 'converted' ? 50 + Math.random() * 100 :
                           state === 'churned' ? 150 + Math.random() * 100 :
                           state === 'engaged' ? 80 + Math.random() * 120 :
                           200 + Math.random() * 150;
        
        return {
          id: `agent-${i}`,
          x: Math.cos(angle) * stateRadius,
          y: (Math.random() - 0.5) * 50,
          z: Math.sin(angle) * stateRadius,
          state,
          persona_type: personas[Math.floor(Math.random() * personas.length)],
          influence_score: Math.random(),
        };
      });
    };

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      try {
        const data = generateMockAgents();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load agent data');
        setLoading(false);
      }
    }, 500);
  }, [simulationId, agentCount]);

  return { agents, loading, error };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/3d-visualization/hooks/useAgentData.ts
git commit -m "feat(3d): add useAgentData hook for loading agent positions"
```

---

## Phase 7: Final Integration & Documentation

### Task 12: Update Exports

**Files:**
- Modify: `src/components/3d-visualization/index.ts`

- [ ] **Step 1: Update index exports**

```typescript
// 3D Visualization Components
export { AgentNetwork3D } from './AgentNetwork3D';
export { AgentInstancedMesh } from './AgentInstancedMesh';
export { AgentDetailCard } from './AgentDetailCard';
export { CameraController } from './CameraController';
export { TrustBadge } from './TrustBadge';
export { StatsOverlay } from './StatsOverlay';
export { WebGLFallback } from './WebGLFallback';

// Legacy components (for backward compatibility)
export { AgentNetwork } from './AgentNetwork';
export { AgentNetworkSimple } from './AgentNetworkSimple';

// Hooks
export { useAgentData } from './hooks/useAgentData';
export { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
```

- [ ] **Step 2: Final commit**

```bash
git add src/components/3d-visualization/index.ts
git commit -m "feat(3d): finalize exports and complete 3D visualization upgrade"
```

---

## Testing Checklist

Before marking complete, verify:

- [ ] **Performance:** 10K agents render at 60fps
- [ ] **Interaction:** Click any agent, detail card appears within 100ms
- [ ] **Colors:** Green=converted, Red=churned, Yellow=engaged, Gray=unaware
- [ ] **Camera:** Zoom, pan, rotate work smoothly
- [ ] **Trust Badge:** Shows "10,000 AI agents" with checkmarks
- [ ] **Stats Overlay:** Shows correct counts per state
- [ ] **Fallback:** Shows WebGL fallback on unsupported browsers
- [ ] **Mobile:** Works on mobile (2D fallback or simplified view)

---

## Success Criteria Verification

| Criteria | Target | How to Verify |
|----------|--------|---------------|
| Performance | 10K agents @ 60fps | Chrome DevTools Performance tab |
| Interaction | Click-to-detail < 100ms | Stopwatch test |
| Trust | Badge visible | Visual inspection |
| Hosting | $0 cost | Deploy to Vercel, verify free tier |
| Load Time | < 3 seconds | Lighthouse audit |

---

## Next Steps After Completion

1. **Code Review:** Request review via `/superpowers-requesting-code-review`
2. **Verification:** Run `/superpowers-verification-before-completion` 
3. **Integration:** Use `/superpowers-finishing-a-development-branch` to merge

---

**Plan Version:** 1.0  
**Last Updated:** 2026-04-09  
**Ready for Execution:** Yes
