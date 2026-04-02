"use client";

import {
  X,
  User,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Brain,
  Users,
} from "lucide-react";

interface DebateRound {
  round: number;
  argument: string;
  sentiment: string;
}

interface AgentDetail {
  agent_id: string;
  persona: string;
  position: "support" | "oppose" | "neutral";
  confidence: number;
  reasoning: string;
  influencedBy?: string[];
  influenced?: string[];
  debateRounds?: DebateRound[];
}

interface AgentDetailPanelProps {
  agent: AgentDetail | null;
  onClose: () => void;
}

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  if (!agent) return null;

  const getPositionColor = (position: string) => {
    switch (position) {
      case "support":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "oppose":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "support":
        return <TrendingUp className="w-4 h-4" />;
      case "oppose":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {agent.persona}
              </h2>
              <p className="text-sm text-gray-400">{agent.agent_id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Position & Confidence */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getPositionColor(
                agent.position
              )}`}
            >
              {getPositionIcon(agent.position)}
              <span className="font-medium capitalize">{agent.position}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">Confidence</span>
                <span className="text-sm font-medium text-white">
                  {Math.round(agent.confidence * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    agent.position === "support"
                      ? "bg-green-500"
                      : agent.position === "oppose"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                  style={{ width: `${agent.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium text-white">Reasoning</h3>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-300 leading-relaxed">{agent.reasoning}</p>
            </div>
          </div>

          {/* Debate Journey */}
          {agent.debateRounds && agent.debateRounds.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="font-medium text-white">Debate Journey</h3>
              </div>
              <div className="space-y-3">
                {agent.debateRounds.map((round) => (
                  <div
                    key={round.round}
                    className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
                      {round.round}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm">{round.argument}</p>
                      <span
                        className={`text-xs mt-1 inline-block ${getSentimentColor(
                          round.sentiment
                        )}`}
                      >
                        {round.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Influence Network */}
          <div className="grid grid-cols-2 gap-4">
            {/* Influenced By */}
            {agent.influencedBy && agent.influencedBy.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-green-400 rotate-180" />
                  <h3 className="font-medium text-white text-sm">
                    Influenced By
                  </h3>
                </div>
                <div className="space-y-2">
                  {agent.influencedBy.slice(0, 3).map((id) => (
                    <div
                      key={id}
                      className="bg-gray-800/30 rounded-lg px-3 py-2 text-sm text-gray-300"
                    >
                      {id.replace(/_/g, " ")}
                    </div>
                  ))}
                  {agent.influencedBy.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{agent.influencedBy.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Influenced */}
            {agent.influenced && agent.influenced.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                  <h3 className="font-medium text-white text-sm">
                    Influenced
                  </h3>
                </div>
                <div className="space-y-2">
                  {agent.influenced.slice(0, 3).map((id) => (
                    <div
                      key={id}
                      className="bg-gray-800/30 rounded-lg px-3 py-2 text-sm text-gray-300"
                    >
                      {id.replace(/_/g, " ")}
                    </div>
                  ))}
                  {agent.influenced.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{agent.influenced.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
