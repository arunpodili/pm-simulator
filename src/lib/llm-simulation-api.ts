/**
 * API client for LLM Simulation service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5001";

export interface LLMConfig {
  brief: string;
  category?: string;
  num_personas: number;
  variants_per_persona: number;
  debate_rounds: number;
  mode: "llm" | "hybrid";
  fast_mode?: boolean;
}

export const llmSimulationApi = {
  async health(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/health`);
    return response.json();
  },

  async create(config: LLMConfig): Promise<{
    success: boolean;
    simulation_id: string;
    status: string;
    config: any;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/llm/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create LLM simulation");
    }

    return response.json();
  },

  async run(simId: string, mode: "llm" | "hybrid" = "llm"): Promise<{
    success: boolean;
    simulation_id: string;
    status: string;
    recommendation?: string;
    confidence?: number;
    summary?: string;
  }> {
    const endpoint = mode === "hybrid"
      ? `${API_BASE_URL}/api/simulation/hybrid/${simId}/run`
      : `${API_BASE_URL}/api/simulation/llm/${simId}/run`;

    const response = await fetch(endpoint, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to run LLM simulation");
    }

    return response.json();
  },

  async getResults(simId: string): Promise<{
    simulation_id: string;
    report: any;
    personas: any[];
    debate_results: any[];
    stats: any;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/llm/results`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get LLM results");
    }

    return response.json();
  },

  async getPersonas(simId: string): Promise<{
    simulation_id: string;
    total_personas: number;
    primary_personas: number;
    personas: any[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/${simId}/llm/personas`);
    return response.json();
  },

  async getAgentTranscript(simId: string, agentId: string): Promise<{
    simulation_id: string;
    agent_id: string;
    transcript: any[];
  }> {
    const response = await fetch(
      `${API_BASE_URL}/api/simulation/${simId}/llm/transcript/${agentId}`
    );
    return response.json();
  },

  async getRecommendations(): Promise<{
    go_no_go?: string;
    confidence?: number;
    summary?: string;
    top_risks?: string[];
    next_actions?: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/simulation/llm/recommendations`);
    return response.json();
  },
};
