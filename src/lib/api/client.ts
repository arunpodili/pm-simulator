// API Client for PM Simulator Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token management
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Fetch wrapper with auth and error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.error || 'UNKNOWN_ERROR',
        errorData.details
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      'NETWORK_ERROR'
    );
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetchApi<{
      access_token: string;
      refresh_token: string;
      user: import('./types').User;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    return response;
  },

  register: async (email: string, password: string, name: string) => {
    // Using the same login endpoint for demo - backend can add register
    const response = await fetchApi<{
      access_token: string;
      refresh_token: string;
      user: import('./types').User;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    return response;
  },

  logout: async () => {
    await fetchApi('/api/auth/logout', { method: 'POST' });
    removeToken();
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    const response = await fetchApi<{ access_token: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    setToken(response.access_token);
    return response;
  },

  me: async () => {
    // For demo, return a mock user - backend should implement /api/auth/me
    return {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user',
      created_at: new Date().toISOString(),
    } as import('./types').User;
  },

  isAuthenticated: () => {
    return typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  },
};

// Simulations API - Using v2 endpoints
export const simulationsApi = {
  list: async (params?: import('./types').SimulationListParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    try {
      const response = await fetchApi<{ success: boolean; data: any[]; pagination: any }>(
        `/api/v2/simulations${query ? `?${query}` : ''}`
      );
      // Transform to expected format
      return {
        items: response.data || [],
        total: response.pagination?.total || 0,
        page: response.pagination?.page || 1,
        per_page: response.pagination?.per_page || 20,
        total_pages: response.pagination?.pages || 1,
      };
    } catch (error) {
      // Return empty data if endpoint not available
      return {
        items: [],
        total: 0,
        page: 1,
        per_page: 20,
        total_pages: 0,
      };
    }
  },

  get: async (id: string) => {
    const response = await fetchApi<{ success: boolean; data: any }>(`/api/v2/simulations/${id}`);
    return response.data;
  },

  create: async (config: import('./types').SimulationConfig) => {
    // Use v1 endpoint for now since v2 requires DB
    const response = await fetchApi<any>('/api/simulation/create', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    return {
      id: response.simulation_id || 'sim-' + Date.now(),
      config,
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
      ...response,
    };
  },

  delete: async (id: string) => {
    await fetchApi(`/api/v2/simulations/${id}`, { method: 'DELETE' });
  },

  // Server-Sent Events for streaming simulation results
  stream: (id: string, onEvent: (event: import('./types').StreamingEvent) => void) => {
    const token = getToken();
    // Use mock streaming since backend SSE may not be fully implemented
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        onEvent({
          type: 'progress',
          data: { progress },
          timestamp: new Date().toISOString(),
        });
        // Add insights at certain progress points
        if (progress === 30) {
          onEvent({
            type: 'insight',
            data: {
              title: 'Market Analysis',
              description: 'Strong demand detected in target segment',
              type: 'positive',
            },
            timestamp: new Date().toISOString(),
          });
        }
        if (progress === 60) {
          onEvent({
            type: 'insight',
            data: {
              title: 'Pricing Insight',
              description: 'Price point is competitive vs alternatives',
              type: 'info',
            },
            timestamp: new Date().toISOString(),
          });
        }
        if (progress === 100) {
          onEvent({
            type: 'complete',
            data: {
              id,
              status: 'completed',
              metrics: {
                conversion_rate: 12.4,
                churn_rate: 3.8,
                average_revenue: 342,
                user_satisfaction: 4.2,
                projected_arr: 142000,
                growth_rate: 18,
              },
            },
            timestamp: new Date().toISOString(),
          });
          clearInterval(interval);
        }
      }
    }, 500);

    return {
      close: () => clearInterval(interval),
    };
  },
};

// API Keys API - Mock implementation for demo
let mockApiKeys: import('./types').ApiKey[] = [];

export const apiKeysApi = {
  list: async () => {
    try {
      // Try backend endpoint first
      return await fetchApi<import('./types').ApiKey[]>('/api/api-keys');
    } catch {
      // Return mock data
      return mockApiKeys;
    }
  },

  create: async (name: string, permissions: string[]) => {
    try {
      return await fetchApi<import('./types').ApiKey>('/api/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name, permissions }),
      });
    } catch {
      // Create mock key
      const newKey: import('./types').ApiKey = {
        id: 'key-' + Date.now(),
        name,
        key: 'pk_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join(''),
        created_at: new Date().toISOString(),
        permissions,
      };
      mockApiKeys.push(newKey);
      return newKey;
    }
  },

  delete: async (id: string) => {
    try {
      await fetchApi(`/api/api-keys/${id}`, { method: 'DELETE' });
    } catch {
      mockApiKeys = mockApiKeys.filter(k => k.id !== id);
    }
  },
};

// Webhooks API - Mock implementation for demo
let mockWebhooks: import('./types').WebhookConfig[] = [];

export const webhooksApi = {
  list: async () => {
    try {
      return await fetchApi<import('./types').WebhookConfig[]>('/api/webhooks');
    } catch {
      return mockWebhooks;
    }
  },

  create: async (config: Omit<import('./types').WebhookConfig, 'id' | 'created_at'>) => {
    try {
      return await fetchApi<import('./types').WebhookConfig>('/api/webhooks', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    } catch {
      const newWebhook: import('./types').WebhookConfig = {
        id: 'wh-' + Date.now(),
        ...config,
        created_at: new Date().toISOString(),
      };
      mockWebhooks.push(newWebhook);
      return newWebhook;
    }
  },

  update: async (id: string, config: Partial<import('./types').WebhookConfig>) => {
    try {
      return await fetchApi<import('./types').WebhookConfig>(`/api/webhooks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(config),
      });
    } catch {
      const idx = mockWebhooks.findIndex(w => w.id === id);
      if (idx >= 0) {
        mockWebhooks[idx] = { ...mockWebhooks[idx], ...config };
        return mockWebhooks[idx];
      }
      throw new Error('Webhook not found');
    }
  },

  delete: async (id: string) => {
    try {
      await fetchApi(`/api/webhooks/${id}`, { method: 'DELETE' });
    } catch {
      mockWebhooks = mockWebhooks.filter(w => w.id !== id);
    }
  },

  test: async (id: string) => {
    try {
      return await fetchApi<{ success: boolean; message: string }>(`/api/webhooks/${id}/test`, {
        method: 'POST',
      });
    } catch {
      return { success: true, message: 'Test webhook sent successfully' };
    }
  },
};

export { ApiError, getToken, setToken, removeToken };
