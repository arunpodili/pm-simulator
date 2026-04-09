/**
 * useSelectedAgent Hook
 *
 * Manages selected agent state and fetches detailed agent information.
 * Provides async loading of full agent profiles when an agent is selected.
 */

'use client';

import { useState, useCallback } from 'react';
import { Agent3D, AgentDetail } from '@/types/agent3d';

interface UseSelectedAgentReturn {
  selectedAgent: Agent3D | null;
  agentDetail: AgentDetail | null;
  selectAgent: (agent: Agent3D) => void;
  clearSelection: () => void;
  loading: boolean;
}

export function useSelectedAgent(): UseSelectedAgentReturn {
  const [selectedAgent, setSelectedAgent] = useState<Agent3D | null>(null);
  const [agentDetail, setAgentDetail] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const selectAgent = useCallback(async (agent: Agent3D) => {
    setSelectedAgent(agent);
    setLoading(true);

    // Simulate API call for full agent details
    // In production, this would fetch from backend
    setTimeout(() => {
      const detail: AgentDetail = {
        id: agent.id,
        persona: {
          name: `${agent.persona_type.charAt(0).toUpperCase() + agent.persona_type.slice(1)} ${Math.floor(Math.random() * 1000)}`,
          role: 'Decision Maker',
          pain_points: ['Inefficient workflows', 'High costs'],
          tech_savviness: Math.round(agent.influence_score * 10),
          decision_style: agent.influence_score > 0.5 ? 'Analytical' : 'Impulsive',
        },
        conversion_reasoning: getReasoningForState(agent.state),
        behavioral_traits: {
          price_sensitivity: Math.round(agent.influence_score * 100),
          feature_preference: 'simplicity',
        },
        communication_history: {
          influenced_by: [],
          influenced: [],
        },
        journey: [
          { day: 1, state: 'unaware', action: 'DISCOVER' },
          { day: 3, state: 'aware', action: 'RESEARCH' },
          { day: 7, state: agent.state, action: 'DECIDE' },
        ],
      };

      setAgentDetail(detail);
      setLoading(false);
    }, 100);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAgent(null);
    setAgentDetail(null);
  }, []);

  return {
    selectedAgent,
    agentDetail,
    selectAgent,
    clearSelection,
    loading,
  };
}

function getReasoningForState(state: string): string {
  const templates: Record<string, string> = {
    converted: 'This agent converted because the pricing aligned with their budget approval process.',
    churned: 'This agent churned after realizing the learning curve was steeper than expected.',
    engaged: 'This agent remains highly engaged, actively exploring advanced features.',
    aware: 'This agent is aware of the product but comparing alternatives.',
    unaware: 'This agent has not yet encountered the product.',
    signed_up: 'This agent signed up and is evaluating the product during the trial period.',
    active: 'This agent is actively using the product with regular engagement.',
    advocate: 'This agent has become a product advocate, recommending it to others.',
  };
  return templates[state] || 'Agent behavior under analysis.';
}
