'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import ForceGraph3D from "3d-force-graph";
import { Sprite, SpriteMaterial } from "three";
import { GraphNode, GraphLink } from "@/lib/api/types";
import { getStateLabel, getArchetypeInfo } from "@/lib/api/ruleBasedSimulation";

// Type assertion for ForceGraph3D to work with JSX
const ForceGraph3DComponent = ForceGraph3D as unknown as React.ComponentType<any>;

interface Agent3DGraphProps {
  nodes?: GraphNode[];
  links?: GraphLink[];
  width?: number;
  height?: number;
  onAgentSelect?: (agent: GraphNode) => void;
  onAgentHover?: (agent: GraphNode | null) => void;
  selectedAgentId?: string | null;
  agentReasoning?: any;
}

export function Agent3DGraph({
  nodes = [],
  links = [],
  width,
  height,
  onAgentSelect,
  onAgentHover,
  selectedAgentId,
  agentReasoning,
}: Agent3DGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 500 });
  const [hasError, setHasError] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update dimensions on container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({
            width: width || rect.width,
            height: height || rect.height,
          });
        }
      }
    };

    updateDimensions();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = width || entry.contentRect.width;
        const newHeight = height || entry.contentRect.height || 400;
        setDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width, height]);

  // Transform agentReasoning into nodes if nodes not provided
  const transformedNodes: GraphNode[] = useMemo(() => {
    if (nodes.length > 0) return nodes;
    if (!agentReasoning || agentReasoning.length === 0) return [];

    return agentReasoning.map((agent: any, idx: number): GraphNode => {
      // Generate 3D positions in a sphere distribution
      const phi = Math.acos(-1 + (2 * idx) / agentReasoning.length);
      const theta = Math.sqrt(agentReasoning.length * Math.PI) * phi;
      const radius = 200 + Math.random() * 100;

      const state = agent.position === 'support' ? 'engaged' :
                    agent.position === 'oppose' ? 'churned' : 'aware';

      return {
        id: agent.id || `agent-${idx}`,
        name: agent.name || `Agent ${idx + 1}`,
        val: Math.max(3, (agent.confidence || 0.5) * 10),
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        color: getNodeColorForState(state),
        agent: {
          id: agent.id || `agent-${idx}`,
          name: agent.name || `Agent ${idx + 1}`,
          current_state: state,
          satisfaction_score: (agent.confidence || 0.5) * 10,
          engagement_level: (agent.confidence || 0.5) * 10,
          behavioral: {
            archetype: agent.reasoning?.includes('Innovator') ? 'INNOVATOR' :
                       agent.reasoning?.includes('Early') ? 'EARLY_ADOPTER' : 'EARLY_MAJORITY',
          },
        } as any,
      };
    });
  }, [nodes, agentReasoning]);

  // Generate links from influencedBy relationships
  const transformedLinks = useMemo(() => {
    if (links.length > 0) return links;
    if (!agentReasoning || agentReasoning.length === 0) return [];

    const newLinks: any[] = [];
    agentReasoning.forEach((agent: any) => {
      if (agent.influencedBy && Array.isArray(agent.influencedBy)) {
        agent.influencedBy.forEach((sourceId: string) => {
          newLinks.push({
            source: sourceId,
            target: agent.id,
            value: 0.5 + Math.random() * 0.3,
          });
        });
      }
    });
    return newLinks;
  }, [links, agentReasoning]);

  // Get color based on agent state
  function getNodeColorForState(state: string): string {
    const stateColors: Record<string, string> = {
      unaware: '#9CA3AF',
      aware: '#3B82F6',
      signed_up: '#8B5CF6',
      active: '#F59E0B',
      engaged: '#10B981',
      premium: '#059669',
      churned: '#EF4444',
    };
    return stateColors[state] || '#9CA3AF';
  }

  // Get color based on agent state (with selection support)
  function getNodeColor(node: GraphNode): string {
    // Highlight selected node
    if (selectedAgentId && node.id === selectedAgentId) {
      return '#FCD34D'; // yellow-300
    }

    const stateColors: Record<string, string> = {
      unaware: '#9CA3AF',    // gray-400
      aware: '#3B82F6',      // blue-500
      signed_up: '#8B5CF6',  // violet-500
      active: '#F59E0B',     // amber-500
      engaged: '#10B981',    // emerald-500
      premium: '#059669',    // emerald-600
      churned: '#EF4444',    // red-500
    };
    return node.agent?.current_state
      ? stateColors[node.agent.current_state] || '#9CA3AF'
      : node.color || '#9CA3AF';
  }

  // Transform data into graph format
  const graphData = useMemo(() => {
    const processedNodes = transformedNodes.map((node: GraphNode) => ({
      ...node,
      val: node.val || Math.max(3, (node.agent?.engagement_level || 5) * 0.6),
      color: getNodeColor(node),
    }));

    const processedLinks = transformedLinks.map((link: any) => ({
      source: typeof link.source === 'string' ? link.source : link.source.id,
      target: typeof link.target === 'string' ? link.target : link.target.id,
      value: link.value || 0.5,
    }));

    return { nodes: processedNodes, links: processedLinks };
  }, [transformedNodes, transformedLinks, selectedAgentId]);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: any) => {
      const graphNode = transformedNodes.find((n) => n.id === node.id);
      if (graphNode && onAgentSelect) {
        onAgentSelect(graphNode);
      }

      // Zoom to node
      if (fgRef.current && node) {
        const distance = 150;
        const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);
        fgRef.current.cameraPosition(
          { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
          node,
          1000
        );
      }
    },
    [transformedNodes, onAgentSelect]
  );

  // Handle node hover
  const handleNodeHover = useCallback(
    (node: any) => {
      const graphNode = node ? transformedNodes.find((n) => n.id === node.id) || null : null;
      setHoveredNode(graphNode);
      if (onAgentHover) {
        onAgentHover(graphNode);
      }
    },
    [transformedNodes, onAgentHover]
  );

  // Custom 3D object for nodes
  const nodeThreeObject = useCallback((node: any) => {
    // Use pre-computed color from node data, or fallback
    const color = node.color || '#9CA3AF';
    const sprite = new Sprite(
      new SpriteMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
      })
    );

    // Scale based on engagement/satisfaction
    const scale = (node.val || 4) * 1.5;
    sprite.scale.set(scale, scale, 1);
    return sprite;
  }, [selectedAgentId]);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error('WebGL not supported');
        setHasError(true);
      }
    } catch (e) {
      console.error('WebGL check failed:', e);
      setHasError(true);
    }
  }, []);

  // Initialize graph
  useEffect(() => {
    if (fgRef.current && !isInitialized && transformedNodes.length > 0) {
      // Initial camera position
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 400 });
      setIsInitialized(true);
    }
  }, [transformedNodes.length, isInitialized]);

  // Auto-rotate
  useEffect(() => {
    if (!fgRef.current) return;

    let angle = 0;
    const interval = setInterval(() => {
      if (fgRef.current && !hoveredNode) {
        angle += 0.002;
        fgRef.current.cameraPosition({
          x: 350 * Math.sin(angle),
          z: 350 * Math.cos(angle),
        }, undefined, 0);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [hoveredNode]);

  if (!isMounted) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center bg-gray-900 rounded-xl"
        style={{ width: dimensions.width, height: dimensions.height, minHeight: 400 }}
      >
        <div className="text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
          <div className="text-sm">Loading 3D visualization...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className="flex items-center justify-center bg-gray-900 rounded-xl"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-center text-gray-400">
          <div className="text-lg mb-2 text-red-400">3D Visualization Error</div>
          <div className="text-sm">WebGL may not be supported. Try a different browser.</div>
        </div>
      </div>
    );
  }

  if (!transformedNodes || transformedNodes.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center bg-gray-900 rounded-xl"
        style={{ width: dimensions.width, height: dimensions.height, minHeight: 400 }}
      >
        <div className="text-center text-gray-400">
          <div className="text-lg mb-2">No Agent Data Available</div>
          <div className="text-sm">Run a simulation to see 3D visualization</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalAgents = transformedNodes.length;
    const stateCounts: Record<string, number> = {};

    transformedNodes.forEach((node) => {
      const state = node.agent?.current_state || 'unknown';
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });

    return { totalAgents, stateCounts };
  }, [transformedNodes]);

  console.log('Agent3DGraph render:', {
    isMounted,
    hasError,
    nodeCount: transformedNodes.length,
    linkCount: transformedLinks.length,
    dimensions,
  });

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <ForceGraph3DComponent
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#111827"
        nodeLabel={(node: any) => {
          const graphNode = node as GraphNode;
          if (!graphNode.agent) return graphNode.name;
          const archetypeInfo = getArchetypeInfo(graphNode.agent.behavioral.archetype);
          return `
${graphNode.name}
${archetypeInfo.icon} ${archetypeInfo.label}
State: ${getStateLabel(graphNode.agent.current_state)}
Satisfaction: ${graphNode.agent.satisfaction_score.toFixed(1)}/10
Engagement: ${graphNode.agent.engagement_level.toFixed(1)}/10
          `;
        }}
        nodeColor="color"
        nodeVal="val"
        linkWidth={0.5}
        linkOpacity={0.4}
        linkColor={(link: any) => {
          const value = link.value || 0.5;
          if (value > 0.7) return '#10B981';
          if (value > 0.4) return '#F59E0B';
          return '#6B7280';
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeThreeObject={nodeThreeObject}
        warmupTicks={100}
        cooldownTicks={50}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        enableNodeDrag={false}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700 max-w-[200px]">
        <h4 className="font-medium text-sm mb-3 text-white">Agent States</h4>
        <div className="space-y-1.5 text-xs">
          {[
            { state: 'unaware', color: '#9CA3AF', label: 'Unaware' },
            { state: 'aware', color: '#3B82F6', label: 'Aware' },
            { state: 'signed_up', color: '#8B5CF6', label: 'Signed Up' },
            { state: 'active', color: '#F59E0B', label: 'Active' },
            { state: 'engaged', color: '#10B981', label: 'Engaged' },
            { state: 'premium', color: '#059669', label: 'Premium' },
            { state: 'churned', color: '#EF4444', label: 'Churned' },
          ].map(({ state, color, label }) => (
            <div key={state} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-300">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <h4 className="font-medium text-sm mb-2 text-white">Connection Strength</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-green-500" />
              <span className="text-gray-400 text-xs">Strong (&gt;70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-amber-500" />
              <span className="text-gray-400 text-xs">Medium (40-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gray-500" />
              <span className="text-gray-400 text-xs">Weak (&lt;40%)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <h4 className="font-medium text-sm mb-2 text-white">Controls</h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Left click: Select agent</div>
            <div>• Drag: Rotate view</div>
            <div>• Scroll: Zoom</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
        <div className="text-xs space-y-1">
          <div>
            <span className="text-gray-400">Total Agents:</span>{" "}
            <span className="font-medium text-white">{stats.totalAgents.toLocaleString()}</span>
          </div>
          {Object.entries(stats.stateCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([state, count]) => (
              <div key={state}>
                <span className="text-gray-400 capitalize">{getStateLabel(state)}:</span>{" "}
                <span className="font-medium text-white">{count.toLocaleString()}</span>
                <span className="text-gray-500"> ({((count / stats.totalAgents) * 100).toFixed(1)}%)</span>
              </div>
            ))}
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && hoveredNode.agent && (
        <div className="absolute top-4 right-4 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700 max-w-xs">
          <h4 className="font-semibold text-white mb-2">{hoveredNode.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Archetype:</span>
              {(() => {
                const info = getArchetypeInfo(hoveredNode.agent!.behavioral.archetype);
                return (
                  <span className="font-medium" style={{ color: info.color }}>
                    {info.icon} {info.label}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">State:</span>
              <span className={`font-medium ${
                hoveredNode.agent.current_state === 'engaged' || hoveredNode.agent.current_state === 'premium'
                  ? 'text-green-400'
                  : hoveredNode.agent.current_state === 'churned'
                  ? 'text-red-400'
                  : 'text-blue-400'
              }`}>
                {getStateLabel(hoveredNode.agent.current_state)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Satisfaction: </span>
              <span className="font-medium text-white">
                {hoveredNode.agent.satisfaction_score.toFixed(1)}/10
              </span>
            </div>
            <div>
              <span className="text-gray-400">Engagement: </span>
              <span className="font-medium text-white">
                {hoveredNode.agent.engagement_level.toFixed(1)}/10
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700">
              Click to see full details
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
