/**
 * Streaming API Client - Real-time Simulation Progress
 *
 * Uses Server-Sent Events (SSE) to receive live simulation updates.
 */

export interface StreamData {
  type: 'init' | 'progress' | 'complete' | 'error' | 'cancelled';
  simulation_id?: string;
  day?: number;
  total_days?: number;
  progress?: number;
  metrics?: {
    new_users: number;
    active_users: number;
    daily_revenue: number;
    satisfaction: number;
  };
  final_metrics?: {
    total_users_acquired: number;
    total_users_churned: number;
    net_user_growth: number;
    total_revenue: number;
    average_satisfaction: number;
    conversion_rate: number;
  };
  error?: string;
  timestamp?: string;
}

export interface StreamCallbacks {
  onInit?: (data: StreamData) => void;
  onProgress?: (data: StreamData) => void;
  onComplete?: (data: StreamData) => void;
  onError?: (data: StreamData) => void;
  onCancelled?: (data: StreamData) => void;
}

export class StreamingClient {
  private eventSource: EventSource | null = null;
  private callbacks: StreamCallbacks;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor(callbacks: StreamCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to simulation stream
   */
  connect(simId: string): void {
    const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';

    // Close existing connection
    this.disconnect();

    // Create new EventSource
    this.eventSource = new EventSource(`${API_BASE_URL}/api/simulation/${simId}/stream`);

    this.eventSource.onopen = () => {
      console.log(`[Streaming] Connected to simulation ${simId}`);
      this.reconnectAttempts = 0;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data: StreamData = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('[Streaming] Failed to parse message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('[Streaming] Connection error:', error);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[Streaming] Reconnecting... (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
          this.connect(simId);
        }, this.reconnectDelay * this.reconnectAttempts);
      } else {
        console.error('[Streaming] Max reconnection attempts reached');
        this.callbacks.onError?.({
          type: 'error',
          error: 'Connection lost. Please refresh the page.',
        });
      }
    };
  }

  /**
   * Disconnect from stream
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('[Streaming] Disconnected');
    }
  }

  /**
   * Cancel running simulation
   */
  async cancel(simId: string): Promise<boolean> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';

    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/cancel`, {
        method: 'POST',
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('[Streaming] Failed to cancel:', error);
      return false;
    }
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: StreamData): void {
    switch (data.type) {
      case 'init':
        this.callbacks.onInit?.(data);
        break;
      case 'progress':
        this.callbacks.onProgress?.(data);
        break;
      case 'complete':
        this.callbacks.onComplete?.(data);
        this.disconnect(); // Auto-disconnect on completion
        break;
      case 'error':
        this.callbacks.onError?.(data);
        this.disconnect();
        break;
      case 'cancelled':
        this.callbacks.onCancelled?.(data);
        this.disconnect();
        break;
    }
  }
}

/**
 * Hook for using streaming in React components
 */
import { useState, useCallback, useRef } from 'react';

export function useStreamingSimulation() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [dailyMetrics, setDailyMetrics] = useState<StreamData['metrics'] | null>(null);
  const [finalResults, setFinalResults] = useState<StreamData['final_metrics'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<StreamingClient | null>(null);

  const startStreaming = useCallback((simId: string) => {
    setIsStreaming(true);
    setProgress(0);
    setCurrentDay(0);
    setError(null);

    clientRef.current = new StreamingClient({
      onInit: (data) => {
        setTotalDays(data.total_days || 0);
      },
      onProgress: (data) => {
        setProgress(data.progress || 0);
        setCurrentDay(data.day || 0);
        setDailyMetrics(data.metrics || null);
      },
      onComplete: (data) => {
        setIsStreaming(false);
        setProgress(100);
        setFinalResults(data.final_metrics || null);
      },
      onError: (data) => {
        setIsStreaming(false);
        setError(data.error || 'Unknown error');
      },
      onCancelled: () => {
        setIsStreaming(false);
        setError('Simulation cancelled');
      },
    });

    clientRef.current.connect(simId);
  }, []);

  const stopStreaming = useCallback(async (simId: string) => {
    if (clientRef.current) {
      await clientRef.current.cancel(simId);
      clientRef.current.disconnect();
    }
    setIsStreaming(false);
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }
    setIsStreaming(false);
  }, []);

  return {
    isStreaming,
    progress,
    currentDay,
    totalDays,
    dailyMetrics,
    finalResults,
    error,
    startStreaming,
    stopStreaming,
    disconnect,
  };
}
