"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
  Shield,
  Network,
  Copy,
  Check,
} from "lucide-react";
import { AgentGraph } from "./AgentGraph";
import { Agent3DGraph } from "./Agent3DGraph";
import { AgentDetailPanel } from "./AgentDetailPanel";
import { Cube } from "lucide-react";

interface LLMSimulationResultsProps {
  data: any;
  onNewSimulation: () => void;
}

export function LLMSimulationResults({ data, onNewSimulation }: LLMSimulationResultsProps) {
  const [activeTab, setActiveTab] = useState<"report" | "personas" | "debates" | "graph" | "3d-network">("report");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getReportAsText = () => {
    let text = `LLM SIMULATION REPORT\n${"=".repeat(50)}\n\n`;
    text += `Recommendation: ${report.go_no_go_recommendation || "N/A"}\n`;
    text += `Confidence: ${report.confidence_level ? Math.round(report.confidence_level * 100) : "N/A"}%\n\n`;
    text += `EXECUTIVE SUMMARY:\n${report.executive_summary || "N/A"}\n\n`;
    text += `KEY INSIGHTS:\n${report.key_insights?.map((i: string) => `- ${i}`).join("\n") || "N/A"}\n\n`;
    text += `TOP RISKS:\n${report.top_risks?.map((r: string) => `- ${r}`).join("\n") || "N/A"}\n\n`;
    text += `OPPORTUNITIES:\n${report.biggest_opportunities?.map((o: string) => `- ${o}`).join("\n") || "N/A"}\n\n`;
    text += `RECOMMENDED ACTIONS:\n${report.recommended_actions?.map((a: string) => `- ${a}`).join("\n") || "N/A"}`;
    return text;
  };

  const report = data?.report || {};
  const personas = data?.personas || [];
  const debateResults = data?.debate_results || [];
  const stats = data?.stats || {};

  const getRecommendationColor = (rec: string) => {
    if (rec === "GO") return "text-green-600 bg-green-50 border-green-200";
    if (rec === "NO-GO") return "text-red-600 bg-red-50 border-red-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getRecommendationIcon = (rec: string) => {
    if (rec === "GO") return CheckCircle;
    if (rec === "NO-GO") return XCircle;
    return AlertCircle;
  };

  const primaryPersonas = personas.filter((p: any) => !p.is_variant);
  const variantPersonas = personas.filter((p: any) => p.is_variant);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">LLM Simulation Complete</span>
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              {report.go_no_go_recommendation ? (
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getRecommendationColor(report.go_no_go_recommendation)}`}>
                  {(() => {
                    const Icon = getRecommendationIcon(report.go_no_go_recommendation);
                    return <Icon className="w-5 h-5" />;
                  })()}
                  {report.go_no_go_recommendation} Recommendation
                </span>
              ) : (
                "Analysis Complete"
              )}
            </h1>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Confidence Level</div>
            <div className="text-4xl font-bold">
              {report.confidence_level ? Math.round(report.confidence_level * 100) : "N/A"}%
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-lg">{report.executive_summary || "No summary available"}</p>
        </div>

        <div className="flex items-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{stats.total_agents || 0} agents simulated</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{stats.total_debate_rounds || 0} debate rounds</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{primaryPersonas.length} primary personas</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onNewSimulation}
          className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Simulation
        </button>
        <button
          onClick={() => {/* TODO: Export */}}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Tabs with Copy Button */}
      <div className="border-b border-gray-200 mb-6 flex items-center justify-between">
        <div className="flex gap-8 flex-1">
          <button
            onClick={() => setActiveTab("report")}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === "report"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Executive Report
            {activeTab === "report" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("personas")}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === "personas"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Personas ({primaryPersonas.length})
            {activeTab === "personas" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("debates")}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === "debates"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Debate Transcripts
            {activeTab === "debates" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === "graph"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Network Graph
            {activeTab === "graph" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("3d-network")}
            className={`pb-4 font-medium transition-colors relative ${
              activeTab === "3d-network"
                ? "text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <Cube className="w-4 h-4" />
              3D Network
            </div>
            {activeTab === "3d-network" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>
        {activeTab === "report" && (
          <button
            onClick={() => copyToClipboard(getReportAsText(), "report")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            {copiedSection === "report" ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Report
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "report" && (
        <div className="space-y-6">
          {/* Key Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Key Insights
              </h2>
              <button
                onClick={() => copyToClipboard(report.key_insights?.join("\n") || "", "insights")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {copiedSection === "insights" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <ul className="space-y-3">
              {report.key_insights?.map((insight: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              )) || <p className="text-gray-500">No insights available</p>}
            </ul>
          </div>

          {/* Risks and Opportunities Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Risks */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Top Risks
                </h2>
                <button
                  onClick={() => copyToClipboard(report.top_risks?.join("\n") || "", "risks")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {copiedSection === "risks" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <ul className="space-y-3">
                {report.top_risks?.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{risk}</span>
                  </li>
                )) || <p className="text-gray-500">No risks identified</p>}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Biggest Opportunities
                </h2>
                <button
                  onClick={() => copyToClipboard(report.biggest_opportunities?.join("\n") || "", "opportunities")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {copiedSection === "opportunities" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <ul className="space-y-3">
                {report.biggest_opportunities?.map((opp: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{opp}</span>
                  </li>
                )) || <p className="text-gray-500">No opportunities identified</p>}
              </ul>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Recommended Next Actions
              </h2>
              <button
                onClick={() => copyToClipboard(report.recommended_actions?.join("\n") || "", "actions")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {copiedSection === "actions" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="space-y-3">
              {report.recommended_actions?.map((action: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-gray-700">{action}</span>
                </div>
              )) || <p className="text-gray-500">No recommendations available</p>}
            </div>
          </div>

          {/* Persona Breakdown */}
          {report.persona_breakdown && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Persona Breakdown</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">Supporters</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {report.persona_breakdown.supporters?.map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600 font-medium mb-1">Opposers</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {report.persona_breakdown.opposers?.map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium mb-1">Swing Voters</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {report.persona_breakdown.swing_voters?.map((s: string, i: number) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "personas" && (
        <div className="space-y-4">
          {/* Primary Personas */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Primary Personas ({primaryPersonas.length})</h2>
            <div className="grid gap-4">
              {primaryPersonas.map((persona: any, i: number) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{persona.name}</h3>
                      <p className="text-sm text-gray-500">
                        {persona.count || 10} agents • {persona.core_motivation}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedPersona(expandedPersona === persona.name ? null : persona.name)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      {expandedPersona === persona.name ? "Show Less" : "Show Details"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Key Pain Point</div>
                      <p className="text-gray-700">{persona.key_pain_point}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Likely Objection</div>
                      <p className="text-gray-700">{persona.likely_objection}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Decision Criteria</div>
                      <p className="text-gray-700">{persona.decision_criteria}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Behavioral Trigger</div>
                      <p className="text-gray-700">{persona.behavioral_trigger}</p>
                    </div>
                  </div>

                  {expandedPersona === persona.name && persona.variants && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium mb-3">
                        Variants ({persona.variants.length})
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {persona.variants.map((variant: any, j: number) => (
                          <div
                            key={j}
                            className="p-3 bg-gray-50 rounded-lg text-sm"
                          >
                            <div className="font-medium mb-1">{variant.name || `Variant ${j + 1}`}</div>
                            <div className="text-gray-600">{variant.context || variant.industry}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "debates" && (
        <div className="space-y-6">
          {debateResults.map((debate: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">{debate.topic}</h3>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="text-gray-600">
                  Consensus: <span className="font-medium">{Math.round((debate.consensus_level || 0) * 100)}%</span>
                </span>
              </div>
              {debate.key_arguments && debate.key_arguments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Key Arguments</h4>
                  <div className="space-y-2">
                    {debate.key_arguments.slice(0, 5).map((arg: any, j: number) => (
                      <div
                        key={j}
                        className={`p-3 rounded-lg text-sm ${
                          arg.side === "support"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <span className={`font-medium ${arg.side === "support" ? "text-green-700" : "text-red-700"}`}>
                          [{arg.side === "support" ? "Support" : "Oppose"}]
                        </span>{" "}
                        {arg.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {debateResults.length === 0 && (
            <p className="text-gray-500 text-center py-12">No debate transcripts available</p>
          )}
        </div>
      )}

      {activeTab === "graph" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-600" />
              Agent Influence Network
            </h2>
            <p className="text-gray-600 mb-4">
              Visual representation of agent positions and social connections.
              Click on nodes to see details.
            </p>
            <AgentGraph
              personas={personas}
              debateResults={debateResults}
              width={800}
              height={500}
            />
          </div>
        </div>
      )}

      {activeTab === "3d-network" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Cube className="w-5 h-5 text-purple-600" />
                  3D Agent Network
                </h2>
                <p className="text-gray-600 mt-1">
                  Explore how {data?.agent_reasoning?.length || 0} AI agents formed their opinions in 3D space.
                  Rotate, zoom, and click agents to understand their reasoning.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Transparent AI
                </span>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200">
              <Agent3DGraph
                agentReasoning={data?.agent_reasoning || []}
                width={800}
                height={550}
                onAgentSelect={setSelectedAgent}
              />
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Why this builds trust:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Each sphere represents an AI agent with unique reasoning</li>
                <li>Green = Supporting, Red = Opposing, Gray = Neutral</li>
                <li>Animated particles show information flow between agents</li>
                <li>Click any agent to see their complete thought process</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
