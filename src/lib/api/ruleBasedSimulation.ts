// Enhanced Rule-Based Simulation API Client
import {
  EnhancedSimulationConfig,
  EnhancedSimulationResult,
  StreamingEvent,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const ruleBasedSimulationApi = {
  // Create a new simulation
  create: async (config: EnhancedSimulationConfig): Promise<EnhancedSimulationResult> => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create simulation');
    }

    return response.json();
  },

  // Run simulation
  run: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${id}/run`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to run simulation');
    }
  },

  // Get simulation results
  getResults: async (id: string): Promise<EnhancedSimulationResult> => {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${id}/results`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get simulation results');
    }

    return response.json();
  },

  // Stream simulation progress
  stream: (
    id: string,
    onEvent: (event: StreamingEvent) => void,
    onError?: (error: Error) => void
  ): { close: () => void } => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/simulation/${id}/stream`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);

        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close();
        }
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      onError?.(new Error('EventSource failed'));
      eventSource.close();
    };

    return {
      close: () => {
        eventSource.close();
      },
    };
  },

  // Get agent journey
  getAgentJourney: async (
    simulationId: string,
    agentId: string
  ): Promise<{ day: number; action: string; reason: string; satisfaction_change: number }[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/simulation/${simulationId}/agent/${agentId}/journey`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get agent journey');
    }

    return response.json();
  },

  // Export results
  exportResults: async (
    id: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<Blob> => {
    const response = await fetch(
      `${API_BASE_URL}/api/simulation/${id}/export?format=${format}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to export results');
    }

    return response.blob();
  },
};

// Transform rule-based data to 3D graph format
export const transformToGraphData = (
  result: EnhancedSimulationResult
): { nodes: any[]; links: any[] } => {
  if (!result.personas || result.personas.length === 0) {
    return { nodes: [], links: [] };
  }

  // Color mapping for states
  const getStateColor = (state: string): string => {
    const colors: Record<string, string> = {
      unaware: '#9CA3AF', // gray
      aware: '#3B82F6', // blue
      signed_up: '#8B5CF6', // purple
      active: '#F59E0B', // amber
      engaged: '#10B981', // green
      premium: '#059669', // emerald
      churned: '#EF4444', // red
    };
    return colors[state] || '#9CA3AF';
  };

  // Create nodes from personas
  const nodes = result.personas.map((persona) => ({
    id: persona.id,
    name: persona.name,
    val: Math.max(2, persona.satisfaction_score / 2), // Size based on satisfaction
    color: getStateColor(persona.current_state),
    // Agent data for detail panel
    agent: persona,
  }));

  // Create links from social graph
  const links: any[] = [];
  if (result.social_graph) {
    Object.entries(result.social_graph).forEach(([sourceId, connections]) => {
      connections.forEach((conn) => {
        links.push({
          source: sourceId,
          target: conn.target_id,
          value: conn.influence_strength,
          color: conn.influence_strength > 0.7 ? '#10B981' : conn.influence_strength > 0.4 ? '#F59E0B' : '#6B7280',
        });
      });
    });
  }

  return { nodes, links };
};

// Get archetype icon/color
export const getArchetypeInfo = (archetype: string): { icon: string; color: string; label: string } => {
  const archetypes: Record<string, { icon: string; color: string; label: string }> = {
    INNOVATOR: { icon: '🚀', color: '#8B5CF6', label: 'Innovator' },
    EARLY_ADOPTER: { icon: '⭐', color: '#3B82F6', label: 'Early Adopter' },
    EARLY_MAJORITY: { icon: '👥', color: '#10B981', label: 'Early Majority' },
    LATE_MAJORITY: { icon: '⏳', color: '#F59E0B', label: 'Late Majority' },
    LAGGARD: { icon: '🐢', color: '#6B7280', label: 'Laggard' },
  };
  return archetypes[archetype] || { icon: '❓', color: '#9CA3AF', label: 'Unknown' };
};

// Get state label
export const getStateLabel = (state: string): string => {
  const states: Record<string, string> = {
    unaware: 'Unaware',
    aware: 'Aware',
    signed_up: 'Signed Up',
    active: 'Active',
    engaged: 'Engaged',
    premium: 'Premium',
    churned: 'Churned',
  };
  return states[state] || state;
};

// Get action icon
export const getActionIcon = (action: string): string => {
  const actions: Record<string, string> = {
    DISCOVER: '🔍',
    SIGN_UP: '📝',
    ACTIVATE: '⚡',
    ENGAGE: '💚',
    UPGRADE: '⬆️',
    ADVOCATE: '📣',
    CHURN: '👋',
    COMPLAIN: '😤',
    IGNORE: '🙈',
  };
  return actions[action] || '❓';
};
