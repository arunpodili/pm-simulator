'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Brain, Target, TrendingUp } from 'lucide-react';
import { Agent3D } from '@/types/agent3d';
import { getColorForState } from '@/lib/3d/colors';

interface AgentDetailCardProps {
  agent: Agent3D;
  onClose: () => void;
}

// Template-based reasoning
const getReasoning = (agent: Agent3D): string => {
  const templates: Record<string, string> = {
    converted: `This agent converted because the pricing aligned with their budget approval process. The key features directly addressed their pain point of inefficient workflows.`,
    churned: `This agent churned after realizing the learning curve was steeper than expected. They needed more onboarding support for their team's technical skill level.`,
    engaged: `This agent remains highly engaged, actively exploring advanced features. Their high tech savviness means they're leveraging the full product potential.`,
    aware: `This agent is aware of the product but comparing alternatives. Price sensitivity is moderate - they need more social proof before committing.`,
    unaware: `This agent hasn't encountered the product yet. Their pain points don't strongly align with current marketing messaging.`,
  };
  return templates[agent.state] || 'Agent behavior under analysis.';
};

export function AgentDetailCard({ agent, onClose }: AgentDetailCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stateColor = getColorForState(agent.state);
  const colorHex = '#' + stateColor.getHexString();

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-50 glass-elevated rounded-xl p-5 max-w-sm"
          style={{ top: '20px', right: '20px' }}
        >
          {/* Header with agent icon and close button */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colorHex + '20',
                  border: `2px solid ${colorHex}`
                }}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorHex }} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Agent #{agent.id.split('-')[1] || agent.id}</h3>
                <p className="text-sm text-gray-400 capitalize">{agent.persona_type}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-surface-muted rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Status badge */}
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: colorHex + '20', color: colorHex }}
          >
            {agent.state.replace('_', ' ').toUpperCase()}
          </div>

          {/* Reasoning section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" /> Why This Happened
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">{getReasoning(agent)}</p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-muted rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Target className="w-3 h-3" /> Pain Level
              </div>
              <div className="text-lg font-bold">{Math.round(agent.influence_score * 10)}/10</div>
            </div>
            <div className="glass-muted rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <TrendingUp className="w-3 h-3" /> Influence
              </div>
              <div className="text-lg font-bold">{Math.round(agent.influence_score * 100)}%</div>
            </div>
          </div>

          {/* Social network info */}
          <div className="text-sm text-gray-400">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span>Social Network</span>
            </div>
            <p className="text-gray-500">
              Influenced {Math.round(agent.influence_score * 5)} similar agents
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
