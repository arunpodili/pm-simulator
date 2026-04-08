'use client';

import { useMemo } from 'react';

interface AgentNodeProps {
  agent: {
    id: string;
    x: number;
    y: number;
    z: number;
    state: string;
    influence: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
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

const stateAnimations: Record<string, string> = {
  unaware: 'none',
  aware: 'pulse-slow',
  signed_up: 'glow',
  active: 'pulse-fast',
  engaged: 'sparkle',
  churned: 'fade',
  advocate: 'emit',
};

export function AgentNode({ agent, isSelected, onClick }: AgentNodeProps) {
  const color = stateColors[agent.state] || '#9CA3AF';
  const animation = stateAnimations[agent.state] || 'none';

  // Calculate node size based on influence
  const size = useMemo(() => {
    const baseSize = 8;
    const influenceBonus = agent.influence * 8;
    return baseSize + influenceBonus;
  }, [agent.influence]);

  const animationClass = useMemo(() => {
    switch (animation) {
      case 'pulse-slow':
        return 'animate-pulse';
      case 'pulse-fast':
        return 'animate-ping';
      case 'glow':
        return 'animate-pulse shadow-lg shadow-green-500/50';
      case 'sparkle':
        return 'animate-bounce';
      case 'fade':
        return 'opacity-50';
      case 'emit':
        return 'animate-pulse shadow-lg shadow-purple-500/50';
      default:
        return '';
    }
  }, [animation]);

  return (
    <div
      className={`absolute rounded-full cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-white scale-125 z-10' : 'hover:scale-110'
      } ${animationClass}`}
      style={{
        left: `calc(50% + ${agent.x}px - ${size / 2}px)`,
        top: `calc(50% + ${agent.y}px - ${size / 2}px)`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        transform: `translateZ(${agent.z}px)`,
        boxShadow: isSelected ? `0 0 20px ${color}` : `0 0 10px ${color}40`,
      }}
      onClick={onClick}
      title={`Agent ${agent.id} - ${agent.state}`}
    >
      {/* Influence indicator */}
      {agent.influence > 0.7 && (
        <div
          className="absolute -inset-1 rounded-full border-2 border-white/30"
          style={{ animation: 'pulse 2s infinite' }}
        />
      )}
    </div>
  );
}
