"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph3D } from "react-force-graph";
import { Sprite, SpriteMaterial, TextureLoader } from "three";

interface AgentNode {
  id: string;
  name: string;
  position: "support" | "oppose" | "neutral";
  confidence: number;
  reasoning: string;
  debateRounds: Array<{
    round: number;
    argument: string;
    sentiment: string;
  }>;
  influencedBy: string[];
  influenced: string[];
}

interface AgentLink {
  source: string;
  target: string;
  value: number;
}

interface Agent3DGraphProps {
  agentReasoning: AgentNode[];
  width?: number;
  height?: number;
  onAgentSelect?: (agent: AgentNode) => void;
  onAgentHover?: (agent: AgentNode | null) => void;
}

export function Agent3DGraph({
  agentReasoning,
  width = 800,
  height = 600,
  onAgentSelect,
  onAgentHover,
}: Agent3DGraphProps) {
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<AgentNode | null>(null);

  // Transform agent data into graph format
  const graphData = useMemo(() => {
    const nodes = agentReasoning.map((agent) => ({
      id: agent.id,
      name: agent.name,
      val: agent.confidence * 10, // Size based on confidence
      color:
        agent.position === "support"
          ? "#22c55e"
          : agent.position === "oppose"
            ? "#ef4444"
            : "#6b7280",
      ...agent,
    }));

    // Create links from influenced_by relationships
    const links: any[] = [];
    agentReasoning.forEach((agent) => {
      agent.influencedBy?.forEach((sourceId: string) => {
        links.push({
          source: sourceId,
          target: agent.id,
          value: Math.random() * 0.5 + 0.5, // Random influence strength
        });
      });
    });

    return { nodes, links };
  }, [agentReasoning]);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: any) => {
      const agent = agentReasoning.find((a) => a.id === node.id);
      if (agent && onAgentSelect) {
        onAgentSelect(agent);
      }
      // Zoom to node
      if (fgRef.current) {
        fgRef.current.cameraPosition(
          { x: node.x, y: node.y, z: node.z + 100 },
          node,
          1000
        );
      }
    },
    [agentReasoning, onAgentSelect]
  );

  // Handle node hover
  const handleNodeHover = useCallback(
    (node: any) => {
      if (node) {
        const agent = agentReasoning.find((a) => a.id === node.id);
        setHoveredNode(agent || null);
        if (onAgentHover) {
          onAgentHover(agent || null);
        }
      } else {
        setHoveredNode(null);
        if (onAgentHover) {
          onAgentHover(null);
        }
      }
    },
    [agentReasoning, onAgentHover]
  );

  // Custom 3D object for nodes
  const nodeThreeObject = useCallback((node: any) => {
    const sprite = new Sprite(
      new SpriteMaterial({
        color: node.color,
        map: null,
      })
    );
    // Scale based on confidence
    const scale = node.val / 5;
    sprite.scale.set(scale * 8, scale * 8, 1);
    return sprite;
  }, []);

  if (!agentReasoning || agentReasoning.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-900 rounded-xl"
        style={{ width, height }}
      >
        <div className="text-center text-gray-400">
          <div className="text-lg mb-2">No Agent Data Available</div>
          <div className="text-sm">Run a simulation to see 3D visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="#0f172a"
        nodeLabel="name"
        nodeColor="color"
        nodeVal="val"
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        linkWidth={2}
        linkOpacity={0.4}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeThreeObject={nodeThreeObject}
        warmupTicks={100}
        cooldownTicks={50}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700">
        <h4 className="font-medium text-sm mb-3 text-white">Agent Positions</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-300">Supporting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-300">Opposing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-300">Neutral</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <h4 className="font-medium text-sm mb-2 text-white">Controls</h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>• Left click + drag: Rotate</div>
            <div>• Right click + drag: Pan</div>
            <div>• Scroll: Zoom</div>
            <div>• Click node: View details</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-gray-400">Agents:</span>{" "}
            <span className="font-medium text-white">
              {agentReasoning.length}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Support:</span>{" "}
            <span className="font-medium text-green-400">
              {agentReasoning.filter((a) => a.position === "support").length}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Oppose:</span>{" "}
            <span className="font-medium text-red-400">
              {agentReasoning.filter((a) => a.position === "oppose").length}
            </span>
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700 max-w-xs">
          <h4 className="font-semibold text-white mb-2">{hoveredNode.name}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Position:</span>
              <span
                className={`font-medium ${
                  hoveredNode.position === "support"
                    ? "text-green-400"
                    : hoveredNode.position === "oppose"
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {hoveredNode.position}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Confidence:</span>{" "}
              <span className="font-medium text-white">
                {Math.round(hoveredNode.confidence * 100)}%
              </span>
            </div>
            <p className="text-gray-300 text-xs mt-2 line-clamp-3">
              {hoveredNode.reasoning}
            </p>
            <div className="text-xs text-gray-500 mt-2">
              Click to see full reasoning
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
