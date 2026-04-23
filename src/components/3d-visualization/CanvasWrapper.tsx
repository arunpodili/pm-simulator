'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { AgentInstancedMesh } from './AgentInstancedMesh';
import { AgentDetailCard } from './AgentDetailCard';
import { CameraController } from './CameraController';
import { TrustBadge } from './TrustBadge';
import { StatsOverlay } from './StatsOverlay';
import { Agent3D } from '@/types/agent3d';

interface CanvasWrapperProps {
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

export function CanvasWrapper({ agents, agentCount, height = 500 }: CanvasWrapperProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent3D | null>(null);

  return (
    <>
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
            agents={agents}
            onAgentClick={setSelectedAgent}
          />
        </Suspense>
      </Canvas>

      <StatsOverlay agents={agents} />

      {selectedAgent && (
        <AgentDetailCard
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </>
  );
}
