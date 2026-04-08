/**
 * useAgentSimulation hook
 * Manages agent simulation state and SSE streaming
 */
import { useState, useCallback, useEffect, useRef } from 'react';

interface AgentState {
  id: string;
  x: number;
  y: number;
  z: number;
  state: 'unaware' | 'aware' | 'signed_up' | 'active' | 'engaged' | 'churned' | 'advocate';
  personaType: string;
  influence: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

interface SimulationEvent {
  type: 'day_complete' | 'agent_state_change' | 'influence_propagated';
  day: number;
  agentId?: string;
  fromState?: string;
  toState?: string;
  sourceId?: string;
  targetId?: string;
}

export function useAgentSimulation(simulationId: string) {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [totalDays, setTotalDays] = useState(90);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize agents from simulation data
  const initializeAgents = useCallback((personas: any[]) => {
    const newAgents: AgentState[] = [];
    const newConnections: Connection[] = [];

    personas.forEach((persona, index) => {
      // Generate positions in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 100;

      newAgents.push({
        id: persona.id || `agent-${index}`,
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        state: 'unaware',
        personaType: persona.role || 'unknown',
        influence: (persona.tech_savviness || 5) / 10,
      });
    });

    // Create connections based on proximity
    newAgents.forEach((agent1, i) => {
      newAgents.slice(i + 1).forEach((agent2) => {
        const distance = Math.sqrt(
          Math.pow(agent1.x - agent2.x, 2) +
            Math.pow(agent1.y - agent2.y, 2) +
            Math.pow(agent1.z - agent2.z, 2)
        );
        if (distance < 200) {
          newConnections.push({
            source: agent1.id,
            target: agent2.id,
            strength: 1 - distance / 200,
          });
        }
      });
    });

    setAgents(newAgents);
    setConnections(newConnections);
  }, []);

  // Connect to SSE stream
  const connect = useCallback(() => {
    if (eventSourceRef.current) return;

    const eventSource = new EventSource(
      `/api/v2/simulations/${simulationId}/stream`
    );

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SimulationEvent = JSON.parse(event.data);
        handleEvent(data);
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setError('Connection lost');
      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;
  }, [simulationId]);

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Handle simulation events
  const handleEvent = useCallback((event: SimulationEvent) => {
    switch (event.type) {
      case 'day_complete':
        setCurrentDay(event.day);
        break;

      case 'agent_state_change':
        if (event.agentId && event.toState) {
          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === event.agentId
                ? { ...agent, state: event.toState as AgentState['state'] }
                : agent
            )
          );
        }
        break;

      case 'influence_propagated':
        // Could animate connection lines here
        break;
    }
  }, []);

  // Toggle playback
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle day change from scrubber
  const handleDayChange = useCallback((day: number) => {
    setCurrentDay(day);
    // In a real implementation, this would fetch agent states for that day
  }, []);

  // Playback effect
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= totalDays) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, totalDays]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    agents,
    connections,
    currentDay,
    totalDays,
    isPlaying,
    isConnected,
    error,
    initializeAgents,
    connect,
    disconnect,
    togglePlay,
    handleDayChange,
  };
}
