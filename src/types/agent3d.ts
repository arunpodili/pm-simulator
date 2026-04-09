/**
 * 3D Agent Visualization Types
 *
 * TypeScript interfaces for the 3D agent visualization system.
 * Used by InstancedMesh renderer and detail card components.
 */

/**
 * Agent states matching the simulation journey
 * Represents where an agent is in the product adoption lifecycle
 */
export type AgentState =
  | 'unaware'
  | 'aware'
  | 'signed_up'
  | 'active'
  | 'engaged'
  | 'churned'
  | 'converted'
  | 'advocate';

/**
 * Persona types from simulation engine
 * Classification of user behavior patterns
 */
export type PersonaType =
  | 'enthusiast'
  | 'pragmatist'
  | 'skeptic'
  | 'laggard';

/**
 * Agent3D - Simplified data for initial load
 * Contains positions and basic info for rendering thousands of agents
 */
export interface Agent3D {
  /** Unique identifier (e.g., "agent-1" to "agent-10000") */
  id: string;

  /** 3D position X coordinate (-500 to 500) */
  x: number;

  /** 3D position Y coordinate (-100 to 100) */
  y: number;

  /** 3D position Z coordinate (-500 to 500) */
  z: number;

  /** Current state in the customer journey */
  state: AgentState;

  /** Behavioral persona classification */
  persona_type: PersonaType;

  /** Social influence score (0.0 to 1.0) */
  influence_score: number;
}

/**
 * Agent persona details
 * Rich profile information about the agent
 */
export interface AgentPersona {
  /** Display name of the agent */
  name: string;

  /** Professional role or job title */
  role: string;

  /** List of pain points this persona experiences */
  pain_points: string[];

  /** Technical proficiency score (0.0 to 1.0) */
  tech_savviness: number;

  /** Decision-making approach description */
  decision_style: string;
}

/**
 * Behavioral traits influencing decisions
 */
export interface BehavioralTraits {
  /** Price sensitivity score (0.0 to 1.0) */
  price_sensitivity: number;

  /** Preferred feature category */
  feature_preference: string;
}

/**
 * Communication history between agents
 * Tracks social influence network
 */
export interface CommunicationHistory {
  /** IDs of agents who influenced this agent */
  influenced_by: string[];

  /** IDs of agents this agent influenced */
  influenced: string[];
}

/**
 * Single step in an agent's journey
 */
export interface JourneyStep {
  /** Day number in the simulation timeline */
  day: number;

  /** State at this point in time */
  state: AgentState;

  /** Action taken on this day */
  action: string;
}

/**
 * AgentDetail - Full data loaded when an agent is selected
 * Contains complete profile, history, and journey information
 */
export interface AgentDetail {
  /** Unique identifier matching Agent3D.id */
  id: string;

  /** Complete persona profile */
  persona: AgentPersona;

  /** AI-generated explanation of conversion behavior */
  conversion_reasoning: string;

  /** Behavioral characteristics affecting decisions */
  behavioral_traits: BehavioralTraits;

  /** Social influence network connections */
  communication_history: CommunicationHistory;

  /** Timeline of state changes throughout simulation */
  journey: JourneyStep[];
}

/**
 * Connection between agents representing social influence
 * Used for drawing network lines in 3D visualization
 */
export interface AgentConnection {
  /** Source agent ID */
  source: string;

  /** Target agent ID */
  target: string;

  /** Connection strength (0.0 to 1.0) */
  strength: number;
}

/**
 * Camera state for 3D viewport controls
 * Tracks position, target, and zoom level
 */
export interface CameraState {
  /** Camera position [x, y, z] */
  position: [number, number, number];

  /** Point the camera is looking at [x, y, z] */
  target: [number, number, number];

  /** Zoom level (1.0 = default) */
  zoom: number;
}

/**
 * Visualization configuration options
 */
export interface VisualizationConfig {
  /** Number of agents to render */
  agentCount: number;

  /** Whether to show connection lines */
  showConnections: boolean;

  /** Filter by agent state (null = all) */
  filterByState: AgentState | null;

  /** Filter by persona type (null = all) */
  filterByPersona: PersonaType | null;

  /** Color coding mode */
  colorMode: 'state' | 'persona' | 'influence';
}

/**
 * Selection state for the 3D visualization
 */
export interface SelectionState {
  /** Currently selected agent ID (null if none) */
  selectedAgentId: string | null;

  /** Hovered agent ID for preview (null if none) */
  hoveredAgentId: string | null;

  /** Whether detail panel is open */
  isDetailOpen: boolean;
}
