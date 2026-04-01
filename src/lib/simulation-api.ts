/**
 * API client for the User Simulation service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5001";

export interface SimulationConfig {
  name: string;
  feature_description: string;
  target_industry: string;
  persona_count: number;
  simulation_days: number;
  features?: string[];
  pain_points_solved?: string[];
  differentiators?: string[];
  market_saturation?: number;
  competitor_strength?: number;
  marketing_spend_level?: "low" | "medium" | "high";
}

export const simulationApi = {
  async health(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/health`);
    return response.json();
  },

  async create(config: SimulationConfig): Promise<{
    success: boolean;
    simulation_id: string;
    status: string;
    config: any;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create simulation");
    }

    return response.json();
  },

  async run(simId: string): Promise<{ success: boolean; simulation_id: string; status: string; summary: any }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/run`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to run simulation");
    }

    return response.json();
  },

  async getStatus(simId: string): Promise<{
    simulation_id: string;
    status: string;
    progress: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/status`);
    return response.json();
  },

  async getResults(simId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/results`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get results");
    }

    return response.json();
  },

  async getAgents(simId: string): Promise<{
    simulation_id: string;
    total_agents: number;
    returned_agents: number;
    agents: any[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/agents`);
    return response.json();
  },

  async getAgentJourney(simId: string, agentId: string): Promise<{
    simulation_id: string;
    agent_id: string;
    journey: any[];
  }> {
    const response = await fetch(
      `${API_BASE_URL}/api/simulation/${simId}/agent/${agentId}/journey`
    );
    return response.json();
  },

  async list(): Promise<{ simulations: any[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/list`);
    return response.json();
  },

  async getTemplates(): Promise<{ templates: any[] }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/templates`);
    return response.json();
  },

  async export(simId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/results`);
    const data = await response.json();

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulation-${simId}-results.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
