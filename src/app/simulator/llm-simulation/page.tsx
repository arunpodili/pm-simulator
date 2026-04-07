"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { BriefForm } from "@/components/simulation/BriefForm";
import { SimulationRunning } from "@/components/simulation/SimulationRunning";
import { LLMSimulationResults } from "@/components/simulation/LLMSimulationResults";
import { simulationsApi } from "@/lib/api/client";

export type SimulationStage = "setup" | "running" | "results" | "error";

export interface RuleBasedConfig {
  product_name: string;
  product_description: string;
  target_market: string;
  pricing_model: "freemium" | "subscription" | "one-time" | "usage-based";
  price_point: string;
  key_features: string;
  competitors: string;
  persona_count: number;
  simulation_days: number;
}

// Transform rule-based data to 3D graph format
const transformTo3DGraphData = (simulationData: any) => {
  if (!simulationData || !simulationData.personas) {
    return { nodes: [], links: [] };
  }

  // Map current_state to position/color
  const getStateColor = (state: string) => {
    switch (state) {
      case "advocate":
      case "engage":
      case "upgrade":
        return "#22c55e"; // green - promoter
      case "churn":
      case "complain":
        return "#ef4444"; // red - detractor
      default:
        return "#6b7280"; // gray - passive/neutral
    }
  };

  const mapStateToPosition = (state: string) => {
    if (["advocate", "engage", "upgrade"].includes(state)) return "support";
    if (["churn", "complain"].includes(state)) return "oppose";
    return "neutral";
  };

  // Create nodes from personas
  const nodes = simulationData.personas.map((persona: any) => ({
    id: persona.id,
    name: persona.name,
    val: Math.max(1, (persona.satisfaction_score + 10) / 2), // Scale -10..10 to 0.5..10
    color: getStateColor(persona.current_state),
    position: mapStateToPosition(persona.current_state),
    confidence: (persona.satisfaction_score + 10) / 20, // Scale to 0..1
    reasoning: `Archetype: ${persona.behavioral?.archetype || "unknown"}. ` +
               `Price sensitivity: ${persona.behavioral?.price_sensitivity}/10. ` +
               `Decision style: ${persona.behavioral?.decision_making_style || "unknown"}.`,
    debateRounds: persona.actions_taken?.map((action: any, idx: number) => ({
      round: idx + 1,
      argument: `${action.action}: Day ${action.day}`,
      sentiment: action.satisfaction > 0 ? "positive" : "negative"
    })) || [],
    influencedBy: [],
    influenced: [],
    ...persona
  }));

  // Create links from social graph
  const links: any[] = [];
  if (simulationData.social_graph) {
    Object.entries(simulationData.social_graph).forEach(([sourceId, connections]: [string, any]) => {
      if (Array.isArray(connections)) {
        connections.forEach((conn: any) => {
          links.push({
            source: sourceId,
            target: conn.target_id || conn,
            value: conn.influence_strength || 0.5
          });
        });
      }
    });
  }

  return { nodes, links };
};

export default function RuleBasedSimulationPage() {
  const router = useRouter();
  const { isOnboarded } = useUser();
  const [stage, setStage] = useState<SimulationStage>("setup");
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = async (config: RuleBasedConfig) => {
    try {
      setStage("running");

      // Create rule-based simulation using the standard API
      const createResponse = await simulationsApi.create({
        product_name: config.product_name,
        product_description: config.product_description,
        target_market: config.target_market,
        pricing_model: config.pricing_model,
        price_point: config.price_point,
        key_features: config.key_features,
        competitors: config.competitors,
      });

      const simId = createResponse.id || createResponse.simulation_id;
      setSimulationId(simId);

      // For demo purposes, create mock results with 3D graph data
      // In production, this would call the actual backend
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock results that match rule-based structure
      const mockResults = generateMockRuleBasedResults(config);
      setSimulationData(mockResults);
      setStage("results");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStage("error");
    }
  };

  const handleRetry = () => {
    setError(null);
    setStage("setup");
  };

  // Generate mock results with proper structure for 3D visualization
  const generateMockRuleBasedResults = (config: RuleBasedConfig) => {
    const personas = [];
    const socialGraph: any = {};

    // Generate 150 personas (reduced from 1000 for 3D performance)
    const archetypes = ["innovator", "early_adopter", "early_majority", "late_majority", "laggard"];
    const states = ["advocate", "engage", "activate", "signup", "discover", "churn"];

    for (let i = 0; i < 150; i++) {
      const id = `persona_${i}`;
      const archetype = archetypes[i % 5];
      const state = states[Math.floor(Math.random() * states.length)];
      const satisfaction = Math.random() * 20 - 10; // -10 to 10

      personas.push({
        id,
        name: `User ${i + 1}`,
        demographics: {
          age: 25 + Math.floor(Math.random() * 35),
          location: ["US", "EU", "Asia"][i % 3],
          income_level: ["low", "medium", "high"][i % 3],
          education: "Bachelor's",
          occupation: "Professional",
          tech_savviness: Math.floor(Math.random() * 10) + 1,
          industry: "tech"
        },
        behavioral: {
          archetype,
          price_sensitivity: Math.floor(Math.random() * 10) + 1,
          feature_preference: ["simplicity", "power", "speed"][i % 3],
          switching_cost_tolerance: ["low", "medium", "high"][i % 3],
          decision_making_style: ["impulsive", "analytical", "social"][i % 3],
          pain_tolerance: Math.floor(Math.random() * 10) + 1,
          support_expectation: "self-service"
        },
        context: {
          current_pain_level: Math.floor(Math.random() * 10) + 1,
          alternatives_used: ["Competitor A", "Competitor B"],
          budget_constraints: null,
          decision_making_power: "individual",
          timeline_urgency: "short-term"
        },
        current_state: state,
        satisfaction_score: satisfaction,
        engagement_level: Math.random(),
        days_since_discovery: Math.floor(Math.random() * 90),
        actions_taken: [
          { action: "discover", day: 1, satisfaction: 2 },
          { action: state, day: Math.floor(Math.random() * 30) + 2, satisfaction }
        ]
      });

      // Create social connections
      const connections = [];
      const numConnections = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numConnections; j++) {
        const targetId = `persona_${Math.floor(Math.random() * 150)}`;
        if (targetId !== id) {
          connections.push({
            target_id: targetId,
            relationship_type: ["friend", "colleague", "influencer"][j % 3],
            influence_strength: Math.random(),
            trust_level: Math.random() * 0.6 + 0.3
          });
        }
      }
      socialGraph[id] = connections;
    }

    return {
      simulation_id: `sim_${Date.now()}`,
      config: {
        name: config.product_name,
        product_description: config.product_description,
        target_industry: "saas",
        persona_count: personas.length,
        simulation_days: config.simulation_days || 90
      },
      personas,
      social_graph: socialGraph,
      timeline: [],
      final_metrics: {
        conversion_rate: 12.4 + Math.random() * 5,
        nps: Math.floor(Math.random() * 60) - 10,
        satisfaction: 4.2 + Math.random(),
        total_users: personas.length,
        active_users: Math.floor(personas.length * 0.7),
        paying_users: Math.floor(personas.length * 0.15),
        churned_users: Math.floor(personas.length * 0.1),
        advocates: Math.floor(personas.length * 0.2)
      },
      agent_reasoning: personas.slice(0, 50).map(p => ({
        id: p.id,
        name: p.name,
        position: p.current_state === "advocate" ? "support" :
                 p.current_state === "churn" ? "oppose" : "neutral",
        confidence: (p.satisfaction_score + 10) / 20,
        reasoning: `Archetype: ${p.behavioral.archetype}. ` +
                   `Satisfaction: ${p.satisfaction_score.toFixed(1)}. ` +
                   `Decision style: ${p.behavioral.decision_making_style}.`,
        debateRounds: p.actions_taken.map((a, idx) => ({
          round: idx + 1,
          argument: `${a.action} on day ${a.day}`,
          sentiment: a.satisfaction > 0 ? "positive" : "negative"
        })),
        influencedBy: socialGraph[p.id]?.slice(0, 2).map((c: any) => c.target_id) || [],
        influenced: []
      })),
      influence_network: {
        nodes: personas.map(p => ({ id: p.id, name: p.name, type: p.behavioral.archetype })),
        links: Object.entries(socialGraph).flatMap(([source, targets]: [string, any]) =>
          targets.map((t: any) => ({ source, target: t.target_id, strength: t.influence_strength }))
        )
      }
    };
  };

  // Skip onboarding check for demo - just show the form
  // In production, uncomment below:
  // if (!isOnboarded) {
  //   router.push("/onboarding");
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Statistical Simulation
            </span>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              3D Network View
            </span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">
            Rule-Based Simulation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Analyze market fit with 1000+ virtual personas. View adoption patterns
            in 3D with social influence networks.
          </p>
        </div>

        {/* Stage Content */}
        {stage === "setup" && (
          <BriefForm onStart={handleStartSimulation} />
        )}

        {stage === "running" && (
          <SimulationRunning
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
