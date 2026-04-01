"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalNav from "@/components/GlobalNav";
import { BriefForm } from "@/components/simulation/BriefForm";
import { LLMSimulationRunning } from "@/components/simulation/LLMSimulationRunning";
import { LLMSimulationResults } from "@/components/simulation/LLMSimulationResults";
import { simulationApi } from "@/lib/simulation-api";
import { llmSimulationApi } from "@/lib/llm-simulation-api";

export type LLMStage = "setup" | "running" | "results" | "error";

export interface PMBrief {
  problem: string;
  target_user: string;
  pricing: string;
  competitors: string;
  success_metric: string;
  additional_context?: string;
}

export interface LLMConfig {
  brief: string;
  category?: string;
  num_personas: number;
  variants_per_persona: number;
  debate_rounds: number;
  mode: "llm" | "hybrid";
}

export default function LLMSimulationPage() {
  const router = useRouter();
  const [stage, setStage] = useState<LLMStage>("setup");
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = async (config: LLMConfig) => {
    try {
      setStage("running");

      // Create LLM simulation
      const createResponse = await llmSimulationApi.create(config);
      const simId = createResponse.simulation_id;
      setSimulationId(simId);

      // Start simulation
      const runResponse = await llmSimulationApi.run(simId, config.mode);

      if (runResponse.success) {
        // Fetch results
        const results = await llmSimulationApi.getResults(simId);
        setSimulationData(results);
        setStage("results");
      } else {
        throw new Error("Simulation failed to run");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStage("error");
    }
  };

  const handleRetry = () => {
    setError(null);
    setStage("setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GlobalNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              AI-Powered
            </span>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Multi-Agent Debate
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            LLM Agent Simulation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Stress-test your product idea with 30-50 AI agents that think like humans.
            Get qualitative insights from focused debates, not just statistical metrics.
          </p>
        </div>

        {/* Stage Content */}
        {stage === "setup" && (
          <BriefForm onStart={handleStartSimulation} />
        )}

        {stage === "running" && (
          <LLMSimulationRunning
            simulationId={simulationId}
            onComplete={() => {}}
          />
        )}

        {stage === "results" && simulationData && (
          <LLMSimulationResults
            data={simulationData}
            onNewSimulation={() => setStage("setup")}
          />
        )}

        {stage === "error" && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">
              Simulation Failed
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
