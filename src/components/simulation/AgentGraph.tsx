"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface AgentNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  persona: string;
  position: "support" | "oppose" | "neutral";
  influence: number;
  group: number;
}

interface AgentLink extends d3.SimulationLinkDatum<AgentNode> {
  influence: number;
  type: "social" | "debate";
}

interface AgentGraphProps {
  personas?: any[];
  debateResults?: any[];
  width?: number;
  height?: number;
}

export function AgentGraph({
  personas = [],
  debateResults = [],
  width = 800,
  height = 600,
}: AgentGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<AgentNode | null>(null);

  // Transform personas into graph nodes
  const nodes: AgentNode[] = [];
  const links: AgentLink[] = [];

  // Create nodes from personas
  personas.forEach((persona, personaIndex) => {
    const isVariant = persona.is_variant;
    const count = persona.count || 5;

    for (let i = 0; i < (isVariant ? 1 : Math.min(count, 3)); i++) {
      const nodeId = isVariant
        ? `${persona.parent_persona}_${personaIndex}_${i}`
        : `${persona.name}_${i}`;

      // Determine position based on debate results (mock for now)
      const positionRand = Math.random();
      const position: "support" | "oppose" | "neutral" =
        positionRand > 0.6 ? "support" : positionRand > 0.3 ? "oppose" : "neutral";

      nodes.push({
        id: nodeId,
        name: isVariant ? persona.name || `Variant ${i + 1}` : persona.name,
        persona: persona.parent_persona || persona.name,
        position,
        influence: Math.random() * 100,
        group: personaIndex,
      });
    }
  });

  // Create social links between agents (same persona = stronger connection)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const samePersona = nodes[i].persona === nodes[j].persona;
      if (samePersona || Math.random() > 0.7) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          influence: samePersona ? 0.8 : 0.3,
          type: "social",
        });
      }
    }
  }

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create force simulation
    const simulation = d3
      .forceSimulation<AgentNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<AgentNode, AgentLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(30));

    // Draw links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => {
        const sourceNode = nodes.find((n) => n.id === d.source.id);
        const targetNode = nodes.find((n) => n.id === d.target.id);
        if (sourceNode?.position === targetNode?.position) {
          return sourceNode?.position === "support" ? "#22c55e" : sourceNode?.position === "oppose" ? "#ef4444" : "#6b7280";
        }
        return "#9ca3af";
      })
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => d.influence * 2);

    // Draw nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => 10 + d.influence / 10)
      .attr("fill", (d) => {
        switch (d.position) {
          case "support":
            return "#22c55e";
          case "oppose":
            return "#ef4444";
          default:
            return "#6b7280";
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d);
      })
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).attr("stroke", "#000").attr("stroke-width", 3);
      })
      .on("mouseout", (event, d) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 2);
      });

    // Add tooltips
    node.append("title").text((d) => `${d.name}\nPosition: ${d.position}`);

    // Add labels for larger nodes
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes.filter((n) => n.influence > 50))
      .join("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("font-size", "10px")
      .attr("fill", "#6b7280")
      .text((d) => d.name.substring(0, 15) + (d.name.length > 15 ? "..." : ""));

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-xl bg-gray-50"
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg border border-gray-200">
        <h4 className="font-medium text-sm mb-2">Agent Positions</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Supporting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Opposing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span>Neutral/Undecided</span>
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {(selectedNode || hoveredNode) && (
        <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200 max-w-xs">
          <h4 className="font-semibold mb-2">
            {(selectedNode || hoveredNode)?.name}
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Persona:</span>{" "}
              <span className="font-medium">{(selectedNode || hoveredNode)?.persona}</span>
            </div>
            <div>
              <span className="text-gray-500">Position:</span>{" "}
              <span
                className={`font-medium ${(selectedNode || hoveredNode)?.position === "support" ? "text-green-600" : (selectedNode || hoveredNode)?.position === "oppose" ? "text-red-600" : "text-gray-600"}`}
              >
                {(selectedNode || hoveredNode)?.position}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Influence:</span>{" "}
              <span className="font-medium">
                {Math.round((selectedNode || hoveredNode)?.influence || 0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-gray-500">Nodes:</span>{" "}
            <span className="font-medium">{nodes.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Links:</span>{" "}
            <span className="font-medium">{links.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Support:</span>{" "}
            <span className="font-medium text-green-600">
              {nodes.filter((n) => n.position === "support").length}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Oppose:</span>{" "}
            <span className="font-medium text-red-600">
              {nodes.filter((n) => n.position === "oppose").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
