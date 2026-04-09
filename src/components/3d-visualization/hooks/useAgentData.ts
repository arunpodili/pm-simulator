'use client';

import { useState, useEffect } from 'react';
import { Agent3D, AgentState, PersonaType } from '@/types/agent3d';

interface UseAgentDataReturn {
  agents: Agent3D[];
  loading: boolean;
  error: string | null;
}

export function useAgentData(
  simulationId: string,
  agentCount: number
): UseAgentDataReturn {
  const [agents, setAgents] = useState<Agent3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateMockAgents = (): Agent3D[] => {
      const states: AgentState[] = [
        'unaware', 'aware', 'converted', 'active', 'engaged', 'churned', 'advocate'
      ];
      const personas: PersonaType[] = ['enthusiast', 'pragmatist', 'skeptic', 'laggard'];

      // Distribution: more unaware/aware at start, fewer converted/churned
      const weightedStates: AgentState[] = [
        ...Array(30).fill('unaware'),
        ...Array(25).fill('aware'),
        ...Array(15).fill('converted'),
        ...Array(12).fill('active'),
        ...Array(8).fill('engaged'),
        ...Array(5).fill('churned'),
        ...Array(5).fill('advocate'),
      ];

      return Array.from({ length: agentCount }, (_, i) => {
        const angle = (i / agentCount) * Math.PI * 2;

        // Select state from weighted distribution
        const state = weightedStates[i % weightedStates.length];

        // Radius based on state (converted/advocate closer to center)
        let baseRadius = 200;
        if (state === 'converted' || state === 'advocate') baseRadius = 80;
        else if (state === 'active' || state === 'engaged') baseRadius = 150;
        else if (state === 'churned') baseRadius = 120;

        const radius = baseRadius + (Math.random() * 50);

        return {
          id: `agent-${i}`,
          x: Math.cos(angle) * radius,
          y: (Math.random() - 0.5) * 40, // Varying heights
          z: Math.sin(angle) * radius,
          state,
          persona_type: personas[Math.floor(Math.random() * personas.length)],
          influence_score: Math.random(),
        };
      });
    };

    setLoading(true);

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      try {
        const data = generateMockAgents();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load agent data');
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [simulationId, agentCount]);

  return { agents, loading, error };
}
