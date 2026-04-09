'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { AgentInstancedMesh } from './AgentInstancedMesh';
import { AgentDetailCard } from './AgentDetailCard';
import { Agent3D } from '@/types/agent3d';

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

  // Filter invalid agents
  const validAgents = agents.filter(a =>
    typeof a.x === 'number' && typeof a.y === 'number' && typeof a.z === 'number'
  );

  return (
    <div className="relative w-full" style={{ height }}>
      <Canvas
        camera={{ position: [0, 100, 400], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <pointLight position={[100, 100, 100]} intensity={0.8} />
          <pointLight position={[-100, -100, -100]} intensity={0.3} color="#06b6d4" />

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
