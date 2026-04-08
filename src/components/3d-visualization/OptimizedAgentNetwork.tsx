'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { AgentNode } from './AgentNode';
import { ViewControls } from './ViewControls';
import { TimelineScrubber } from './TimelineScrubber';
import { useVirtualization } from '@/hooks/useVirtualization';

interface AgentState {
  id: string;
  x: number;
  y: number;
  z: number;
  state: 'unaware' | 'aware' | 'signed_up' | 'active' | 'engaged' | 'churned' | 'advocate';
  personaType: string;
  influence: number;
}

interface OptimizedAgentNetworkProps {
  agents: AgentState[];
  currentDay: number;
  totalDays: number;
  onDayChange?: (day: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  maxVisibleAgents?: number;
}

// Group agents by state for clustering
const groupAgentsByState = (agents: AgentState[]) => {
  return agents.reduce((acc, agent) => {
    if (!acc[agent.state]) acc[agent.state] = [];
    acc[agent.state].push(agent);
    return acc;
  }, {} as Record<string, AgentState[]>);
};

export function OptimizedAgentNetwork({
  agents,
  currentDay,
  totalDays,
  onDayChange,
  isPlaying = false,
  onPlayToggle,
  maxVisibleAgents = 100,
}: OptimizedAgentNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Measure viewport for virtualization
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setViewportSize({ width: clientWidth, height: clientHeight });
    }
  }, []);

  // LOD System: Show clusters when zoomed out, individual agents when zoomed in
  const lodLevel = useMemo(() => {
    if (scale < 0.5) return 'cluster';      // Show clusters only
    if (scale < 1.0) return 'reduced';        // Show reduced detail
    return 'full';                            // Show all agents
  }, [scale]);

  // Group agents by state for clustering
  const agentsByState = useMemo(() => groupAgentsByState(agents), [agents]);

  // Calculate cluster centers
  const clusterCenters: Record<string, { x: number; y: number; z: number }> = {
    unaware: { x: -200, y: 0, z: -200 },
    aware: { x: -100, y: 50, z: -100 },
    signed_up: { x: 0, y: 100, z: 0 },
    active: { x: 100, y: 50, z: 100 },
    engaged: { x: 200, y: 0, z: 200 },
    churned: { x: 0, y: -150, z: 0 },
    advocate: { x: 200, y: 100, z: -100 },
  };

  // Virtualization: Only render visible agents
  const visibleAgents = useMemo(() => {
    if (lodLevel === 'cluster') return [];

    // Calculate visible range based on viewport and scale
    const visibleWidth = viewportSize.width / scale;
    const visibleHeight = viewportSize.height / scale;
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;

    return agents.filter(agent => {
      const screenX = centerX + agent.x * scale;
      const screenY = centerY + agent.y * scale;
      return (
        screenX >= -100 && screenX <= viewportSize.width + 100 &&
        screenY >= -100 && screenY <= viewportSize.height + 100
      );
    });
  }, [agents, viewportSize, scale, lodLevel]);

  // Limit visible agents for performance
  const renderedAgents = useMemo(() => {
    if (visibleAgents.length <= maxVisibleAgents) return visibleAgents;

    // Sample agents evenly if we have too many
    const step = Math.ceil(visibleAgents.length / maxVisibleAgents);
    return visibleAgents.filter((_, index) => index % step === 0);
  }, [visibleAgents, maxVisibleAgents]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.3, Math.min(3, prev * delta)));
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

  // Render clusters or individual agents based on LOD
  const renderContent = () => {
    if (lodLevel === 'cluster') {
      // Render state clusters
      return Object.entries(agentsByState).map(([state, agents]) => {
        if (agents.length === 0) return null;
        const center = clusterCenters[state];
        return (
          <div
            key={state}
            className="absolute flex flex-col items-center justify-center cursor-pointer"
            style={{
              left: `calc(50% + ${center.x}px - 40px)`,
              top: `calc(50% + ${center.y}px - 40px)`,
              width: '80px',
              height: '80px',
              transform: `translateZ(${center.z}px) scale(${Math.min(1, agents.length / 100)})`,
            }}
            onClick={() => {
              setScale(1.2); // Zoom in to see individual agents
              setRotation({ x: -30, y: center.y > 0 ? 30 : -30 });
            }}
          >
            <div
              className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                width: `${Math.min(80, 20 + agents.length)}px`,
                height: `${Math.min(80, 20 + agents.length)}px`,
                backgroundColor: stateColors[state] || '#9CA3AF',
                opacity: 0.8,
              }}
            >
              {agents.length}
            </div>
            <span className="text-xs mt-2 text-gray-400 capitalize whitespace-nowrap">
              {state.replace('_', ' ')}
            </span>
          </div>
        );
      });
    }

    // Render individual agents
    return renderedAgents.map((agent) => (
      <AgentNode
        key={agent.id}
        agent={agent}
        isSelected={selectedAgent?.id === agent.id}
        onClick={() => setSelectedAgent(agent)}
        simplified={lodLevel === 'reduced'} // Simplified rendering at medium zoom
      />
    ));
  };

  return (
    <div
      className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden"
      ref={containerRef}
    >
      {/* LOD Level Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 px-3 py-1 rounded text-xs text-gray-400">
        {lodLevel === 'cluster' ? 'Cluster View' : lodLevel === 'reduced' ? 'Reduced Detail' : 'Full Detail'}
        {' · '}{renderedAgents.length} agents
      </div>

      <div
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
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: 'translateZ(-100px)',
            }}
          />

          {renderContent()}
        </div>
      </div>

      <ViewControls
        scale={scale}
        onZoomIn={() => setScale((s) => Math.min(3, s * 1.2))}
        onZoomOut={() => setScale((s) => Math.max(0.3, s * 0.8))}
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
          {Object.entries(stateColors).map(([state, color]) => (
            <div key={state} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize text-gray-400">{state.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected agent info */}
      {selectedAgent && (
        <div className="absolute top-4 right-4 bg-gray-800/90 p-4 rounded-lg min-w-[200px] z-10">
          <h4 className="font-medium mb-2">Agent Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-500">ID:</span> {selectedAgent.id}</p>
            <p>
              <span className="text-gray-500">State:</span>{' '}
              <span className="capitalize">{selectedAgent.state.replace('_', ' ')}</span>
            </p>
            <p><span className="text-gray-500">Type:</span> {selectedAgent.personaType}</p>
            <p><span className="text-gray-500">Influence:</span> {(selectedAgent.influence * 100).toFixed(0)}%</p>
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

const stateColors: Record<string, string> = {
  unaware: '#9CA3AF',
  aware: '#3B82F6',
  signed_up: '#22C55E',
  active: '#34D399',
  engaged: '#EAB308',
  churned: '#EF4444',
  advocate: '#A855F7',
};
