'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentNode } from './AgentNode';
import { ViewControls } from './ViewControls';
import { TimelineScrubber } from './TimelineScrubber';

interface AgentState {
  id: string;
  x: number;
  y: number;
  z: number;
  state: 'unaware' | 'aware' | 'signed_up' | 'active' | 'engaged' | 'churned' | 'advocate';
  personaType: string;
  influence: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

interface AgentNetworkProps {
  agents: AgentState[];
  connections: Connection[];
  currentDay: number;
  totalDays: number;
  onDayChange?: (day: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

export function AgentNetwork({
  agents,
  connections,
  currentDay,
  totalDays,
  onDayChange,
  isPlaying = false,
  onPlayToggle,
}: AgentNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setRotation((prev) => ({
        x: Math.max(-90, Math.min(90, prev.x - dy * 0.5)),
        y: prev.y + dx * 0.5,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setRotation({ x: -20, y: 45 });
    setSelectedAgent(null);
  }, []);

  // Group agents by state for clustering
  const agentsByState = agents.reduce((acc, agent) => {
    if (!acc[agent.state]) acc[agent.state] = [];
    acc[agent.state].push(agent);
    return acc;
  }, {} as Record<string, AgentState[]>);

  // Calculate cluster positions
  const clusterCenters: Record<string, { x: number; y: number; z: number }> = {
    unaware: { x: -200, y: 0, z: -200 },
    aware: { x: -100, y: 50, z: -100 },
    signed_up: { x: 0, y: 100, z: 0 },
    active: { x: 100, y: 50, z: 100 },
    engaged: { x: 200, y: 0, z: 200 },
    churned: { x: 0, y: -150, z: 0 },
    advocate: { x: 200, y: 100, z: -100 },
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full cursor-move"
        style={{ perspective: '1000px' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full relative transition-transform duration-100"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: 'translateZ(-100px)',
            }}
          />

          {/* Cluster labels */}
          {Object.entries(clusterCenters).map(([state, center]) => {
            const count = agentsByState[state]?.length || 0;
            if (count === 0) return null;
            return (
              <div
                key={state}
                className="absolute text-xs text-gray-500 uppercase tracking-wider pointer-events-none"
                style={{
                  left: `calc(50% + ${center.x}px)`,
                  top: `calc(50% + ${center.y}px)`,
                  transform: `translateZ(${center.z}px)`,
                }}
              >
                {state} ({count})
              </div>
            );
          })}

          {/* Connection lines */}
          {connections.map((conn, index) => {
            const source = agents.find((a) => a.id === conn.source);
            const target = agents.find((a) => a.id === conn.target);
            if (!source || !target) return null;

            return (
              <line
                key={index}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={conn.strength * 2}
              />
            );
          })}

          {/* Agent nodes */}
          {agents.map((agent) => (
            <AgentNode
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Controls overlay */}
      <ViewControls
        scale={scale}
        onZoomIn={() => setScale((s) => Math.min(3, s * 1.2))}
        onZoomOut={() => setScale((s) => Math.max(0.5, s * 0.8))}
        onReset={resetView}
      />

      <TimelineScrubber
        currentDay={currentDay}
        totalDays={totalDays}
        onChange={onDayChange}
        isPlaying={isPlaying}
        onPlayToggle={onPlayToggle}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 p-3 rounded-lg text-xs">
        <h4 className="font-medium mb-2 text-gray-300">Agent States</h4>
        <div className="space-y-1">
          {[
            { state: 'unaware', color: 'bg-gray-500' },
            { state: 'aware', color: 'bg-blue-500' },
            { state: 'signed_up', color: 'bg-green-500' },
            { state: 'active', color: 'bg-emerald-400' },
            { state: 'engaged', color: 'bg-yellow-500' },
            { state: 'churned', color: 'bg-red-500' },
            { state: 'advocate', color: 'bg-purple-500' },
          ].map(({ state, color }) => (
            <div key={state} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="capitalize text-gray-400">{state.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected agent info */}
      {selectedAgent && (
        <div className="absolute top-4 right-4 bg-gray-800/90 p-4 rounded-lg min-w-[200px]">
          <h4 className="font-medium mb-2">Agent Details</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-500">ID:</span> {selectedAgent.id}
            </p>
            <p>
              <span className="text-gray-500">State:</span>{' '}
              <span className="capitalize">{selectedAgent.state.replace('_', ' ')}</span>
            </p>
            <p>
              <span className="text-gray-500">Type:</span> {selectedAgent.personaType}
            </p>
            <p>
              <span className="text-gray-500">Influence:</span>{' '}
              {(selectedAgent.influence * 100).toFixed(0)}%
            </p>
          </div>
          <button
            onClick={() => setSelectedAgent(null)}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
