'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { WebGLFallback } from './WebGLFallback';
import { Agent3D } from '@/types/agent3d';

interface AgentNetwork3DProps {
  agents: Agent3D[];
  agentCount: number;
  height?: number;
}

// Dynamically import the Canvas component with SSR disabled
const CanvasWrapper = dynamic(
  () => import('./CanvasWrapper').then((mod) => mod.CanvasWrapper),
  { ssr: false }
);

export function AgentNetwork3D({ agents, agentCount, height = 500 }: AgentNetwork3DProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Filter invalid agents
  const validAgents = agents.filter(a =>
    typeof a.x === 'number' && typeof a.y === 'number' && typeof a.z === 'number'
  );

  // Show loading while checking WebGL
  if (webglSupported === null) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-xl font-bold mb-2">Checking WebGL Support...</div>
        </div>
      </div>
    );
  }

  // Show fallback if WebGL not supported
  if (!webglSupported) {
    return (
      <div style={{ height }}>
        <WebGLFallback agentCount={agentCount} />
      </div>
    );
  }

  // Render the dynamic Canvas wrapper (client-side only)
  return (
    <div className="relative w-full" style={{ height }}>
      <CanvasWrapper agents={validAgents} agentCount={agentCount} height={height} />
    </div>
  );
}
