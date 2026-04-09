'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Agent {
  id: string;
  x: number;
  y: number;
  state: string;
  type?: string;
}

interface AgentNetworkSimpleProps {
  agents?: Agent[];
  height?: number;
}

export function AgentNetworkSimple({ agents = [], height = 300 }: AgentNetworkSimpleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const getStateColor = (state: string) => {
      switch (state) {
        case 'unaware':
          return 'rgba(100, 116, 139, 0.8)';
        case 'aware':
          return 'rgba(6, 182, 212, 0.8)';
        case 'signed_up':
        case 'converted':
          return 'rgba(16, 185, 129, 0.9)';
        case 'active':
          return 'rgba(52, 211, 153, 0.9)';
        case 'engaged':
          return 'rgba(245, 158, 11, 0.9)';
        case 'churned':
          return 'rgba(244, 63, 94, 0.8)';
        case 'advocate':
          return 'rgba(168, 85, 247, 0.9)';
        default:
          return 'rgba(6, 182, 212, 0.8)';
      }
    };

    const animate = () => {
      time += 0.01;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Draw connections between nearby agents
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;

      agents.forEach((agent, i) => {
        agents.slice(i + 1).forEach((other) => {
          const dx = agent.x - other.x;
          const dy = agent.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(agent.x, agent.y);
            ctx.lineTo(other.x, other.y);
            ctx.globalAlpha = 1 - distance / 100;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      // Draw agents
      agents.forEach((agent, index) => {
        const offsetX = Math.sin(time + index) * 3;
        const offsetY = Math.cos(time + index) * 3;

        const x = agent.x + offsetX;
        const y = agent.y + offsetY;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, getStateColor(agent.state));
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = getStateColor(agent.state);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add some random floating particles
      for (let i = 0; i < 20; i++) {
        const px = ((time * 50 + i * 100) % width);
        const py = ((time * 30 + i * 80) % height);
        const size = 1 + Math.sin(time + i) * 0.5;

        ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [agents]);

  // Generate default agents if none provided
  const displayAgents = agents.length > 0 ? agents : generateDefaultAgents();

  return (
    <div className="relative w-full h-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-lg"
        style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)' }}
      />

      {/* Overlay stats */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <div className="glass rounded-lg px-3 py-2">
          <div className="text-xs text-gray-400">Active Agents</div>
          <div className="text-lg font-bold text-accent">{displayAgents.length.toLocaleString()}</div>
        </div>
        <div className="glass rounded-lg px-3 py-2 flex gap-3">
          {['converted', 'active', 'churned'].map((state) => {
            const count = displayAgents.filter((a) => a.state === state).length;
            const colors: Record<string, string> = {
              converted: 'bg-accent',
              active: 'bg-primary',
              churned: 'bg-danger',
            };
            return (
              <div key={state} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${colors[state]}`} />
                <span className="text-xs text-gray-400 capitalize">{state}: {count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function generateDefaultAgents(): Agent[] {
  const states = ['unaware', 'aware', 'converted', 'active', 'engaged', 'churned', 'advocate'];
  const agents: Agent[] = [];

  for (let i = 0; i < 50; i++) {
    agents.push({
      id: `agent-${i}`,
      x: 50 + Math.random() * 500,
      y: 50 + Math.random() * 200,
      state: states[Math.floor(Math.random() * states.length)],
    });
  }

  return agents;
}
