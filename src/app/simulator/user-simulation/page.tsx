"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalNav from "@/components/GlobalNav";
import { SimulationSetup } from "@/components/simulation/SimulationSetup";
import { SimulationRunning } from "@/components/simulation/SimulationRunning";
import { SimulationResults } from "@/components/simulation/SimulationResults";
import { simulationApi } from "@/lib/simulation-api";

export type SimulationStage = "setup" | "running" | "results" | "error";

export interface SimulationConfig {
  name: string;
  feature_description: string;
  target_industry: string;
  persona_count: number;
  simulation_days: number;
  features: string[];
  pain_points_solved: string[];
  differentiators: string[];
  market_saturation: number;
  competitor_strength: number;
  marketing_spend_level: "low" | "medium" | "high";
}

export default function UserSimulationPage() {
  const router = useRouter();
  const [stage, setStage] = useState<SimulationStage>("setup");
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = async (config: SimulationConfig) => {
    try {
      setStage("running");

      // Create simulation
      const createResponse = await simulationApi.create(config);
      const simId = createResponse.simulation_id;
      setSimulationId(simId);

      // Start simulation (this may take a while)
      const runResponse = await simulationApi.run(simId);

      if (runResponse.success) {
        // Fetch results
        const results = await simulationApi.getResults(simId);
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

  const handleViewResults = async (id: string) => {
    try {
      setStage("running");
      const results = await simulationApi.getResults(id);
      setSimulationData(results);
      setSimulationId(id);
      setStage("results");
    } catch (err) {
      setError("Failed to load simulation results");
      setStage("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GlobalNav />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              MiroFish Integration
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            User Simulation Playground
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Test your product with 1,000+ simulated users before writing a single
            line of code. Inspired by MiroFish&apos;s parallel digital world concept.
          </p>
        </div>

        {/* Stage Content */}
        {stage === "setup" && (
          <SimulationSetup
            onStart={handleStartSimulation}
            onViewExisting={handleViewResults}
          />
        )}

        {stage === "running" && (
          <SimulationRunning
            simulationId={simulationId}
            onComplete={() => {}}
          />
        )}

        {stage === "results" && simulationData && (
          <SimulationResults
            data={simulationData}
            onNewSimulation={() => setStage("setup")}
            onExport={() => simulationApi.export(simulationId!)}
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
