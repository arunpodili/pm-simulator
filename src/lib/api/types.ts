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

// Enhanced Persona Configuration
export interface PersonaDemographics {
  age_range: { min: number; max: number };
  locations: string[];
  income_levels: ('low' | 'medium' | 'high')[];
  education_levels: ('high_school' | 'college' | 'graduate')[];
  occupations: string[];
  tech_savviness_range: { min: number; max: number };
}

export interface PersonaBehavioralTraits {
  price_sensitivity_range: { min: number; max: number };
  pain_tolerance_range: { min: number; max: number };
  decision_styles: ('impulsive' | 'analytical' | 'social' | 'cautious')[];
  feature_preferences: ('simplicity' | 'power' | 'speed' | 'security')[];
}

export interface EnhancedSimulationConfig {
  id?: string;
  product_name: string;
  product_description: string;
  target_industry: 'saas' | 'fintech' | 'health' | 'ecommerce' | 'ai_ml' | 'education' | 'other';

  // Persona Configuration
  persona_count: number; // 100-10000
  demographics: PersonaDemographics;
  behavioral_traits: PersonaBehavioralTraits;

  // Product Configuration
  pricing_model: 'freemium' | 'subscription' | 'one-time' | 'usage-based';
  price_point: string;
  key_features: string[];
  pain_points_solved: string[];
  differentiators: string[];

  // Market Configuration
  competitors: string[];
  marketing_spend_level: 'low' | 'medium' | 'high';
  market_saturation: 'low' | 'medium' | 'high';
  competitor_strength: 'weak' | 'medium' | 'strong';

  // Simulation Settings
  simulation_days: number; // 30-365
  enable_social_influence: boolean;
  random_seed?: number;
}

// Agent/Persona Types for 3D Visualization
export interface AgentPersona {
  id: string;
  name: string;
  demographics: {
    age: number;
    location: string;
    income_level: string;
    education: string;
    occupation: string;
    tech_savviness: number;
    industry: string;
  };
  behavioral: {
    archetype: 'INNOVATOR' | 'EARLY_ADOPTER' | 'EARLY_MAJORITY' | 'LATE_MAJORITY' | 'LAGGARD';
    price_sensitivity: number;
    feature_preference: string;
    decision_making_style: string;
    pain_tolerance: number;
  };
  context: {
    current_pain_level: number;
    alternatives_used: string[];
    budget_constraints: string | null;
    decision_making_power: string;
    timeline_urgency: string;
  };
  current_state: 'unaware' | 'aware' | 'signed_up' | 'active' | 'engaged' | 'premium' | 'churned';
  satisfaction_score: number;
  engagement_level: number;
  actions_taken: AgentAction[];
}

export interface AgentAction {
  day: number;
  action: 'DISCOVER' | 'SIGN_UP' | 'ACTIVATE' | 'ENGAGE' | 'UPGRADE' | 'ADVOCATE' | 'CHURN' | 'COMPLAIN' | 'IGNORE';
  reason: string;
  satisfaction_change: number;
}

export interface SocialConnection {
  source_id: string;
  target_id: string;
  relationship_type: 'friend' | 'colleague' | 'influencer' | 'family';
  influence_strength: number;
  trust_level: number;
}

export interface TimelineEvent {
  day: number;
  events: {
    agent_id: string;
    action: string;
    previous_state: string;
    current_state: string;
    satisfaction: number;
  }[];
  metrics: {
    state_distribution: Record<string, number>;
    avg_satisfaction: number;
    avg_engagement: number;
    total_active: number;
    total_signed_up: number;
    total_churned: number;
  };
}

export interface CohortAnalysis {
  by_archetype: Record<string, {
    count: number;
    avg_satisfaction: number;
    avg_engagement: number;
  }>;
  by_tech_savviness: Record<string, {
    count: number;
    avg_satisfaction: number;
    avg_engagement: number;
  }>;
  by_price_sensitivity: Record<string, {
    count: number;
    avg_satisfaction: number;
    avg_engagement: number;
  }>;
}

export interface EnhancedSimulationResult {
  id: string;
  config: EnhancedSimulationConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  completed_at?: string;

  // Agents Data
  personas: AgentPersona[];
  social_graph: Record<string, SocialConnection[]>;
  timeline: TimelineEvent[];

  // Metrics
  final_metrics: {
    total_personas: number;
    aware_count: number;
    signed_up_count: number;
    activated_count: number;
    engaged_count: number;
    premium_count: number;
    churned_count: number;
    conversion_rate: number;
    activation_rate: number;
    avg_satisfaction: number;
    avg_engagement: number;
    nps: number;
  };

  // Predictions
  predicted_adoption_curve: number[];
  predicted_churn_rate: number;
  predicted_nps: number;
  predicted_clv: number;

  // Analysis
  cohort_analysis: CohortAnalysis;
  insights: SimulationInsight[];
  error?: string;
}

export interface SimulationInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'negative' | 'info';
  confidence: number;
}

// Legacy types for backward compatibility
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
  type: 'progress' | 'insight' | 'agent_activity' | 'complete' | 'error';
  data: unknown;
  timestamp: string;
}

// Persona Builder Types
export interface Persona {
  id: string;
  name: string;
  role: string;
  pain_level: number;
  tech_savviness: number;
  goals?: string;
  description?: string;
  type?: 'ENTHUSIAST' | 'PRAGMATIST' | 'SKEPTIC' | 'LAGGARD';
}

// 3D Agent Network Types
export interface AgentState {
  id: string;
  x: number;
  y: number;
  z?: number;
  state: 'unaware' | 'aware' | 'signed_up' | 'active' | 'engaged' | 'churned' | 'advocate' | 'converted';
  type?: string;
  personaType?: string;
  influence?: number;
}

// 3D Graph Types
export interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  // Agent data
  agent: AgentPersona;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
  color?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
