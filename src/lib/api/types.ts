// API Types for PM Simulator

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'analyst';
  created_at: string;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface SimulationConfig {
  id?: string;
  product_name: string;
  product_description: string;
  target_market: string;
  pricing_model: 'freemium' | 'subscription' | 'one-time' | 'usage-based';
  price_point: string;
  key_features?: string;
  competitors?: string;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  completed_at?: string;
  metrics?: SimulationMetrics;
  insights?: SimulationInsight[];
  error?: string;
}

export interface SimulationMetrics {
  conversion_rate: number;
  churn_rate: number;
  average_revenue: number;
  user_satisfaction: number;
  projected_arr: number;
  growth_rate: number;
  cac: number;
  ltv: number;
}

export interface SimulationInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'negative' | 'info';
  confidence: number;
}

export interface SimulationListParams {
  page?: number;
  per_page?: number;
  status?: SimulationResult['status'];
  sort_by?: 'created_at' | 'status' | 'product_name';
  sort_order?: 'asc' | 'desc';
}

export interface SimulationListResponse {
  items: SimulationResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  permissions: string[];
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
}

export interface ApiError {
  error: string;
  message: string;
  code: number;
  details?: Record<string, string[]>;
}

export interface StreamingEvent {
  type: 'progress' | 'insight' | 'complete' | 'error';
  data: unknown;
  timestamp: string;
}
