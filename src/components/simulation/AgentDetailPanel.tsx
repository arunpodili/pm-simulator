'use client';

import {
  X,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  DollarSign,
  Brain,
  Users,
  Activity,
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { GraphNode } from "@/lib/api/types";
import {
  getStateLabel,
  getArchetypeInfo,
  getActionIcon,
} from "@/lib/api/ruleBasedSimulation";

interface AgentDetailPanelProps {
  agent: GraphNode | null;
  onClose: () => void;
}

export function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  if (!agent || !agent.agent) return null;

  const persona = agent.agent;
  const archetypeInfo = getArchetypeInfo(persona.behavioral.archetype);

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      unaware: 'bg-gray-400/10 text-gray-400 border-gray-400/30',
      aware: 'bg-blue-500/10 text-blue-400 border-blue-400/30',
      signed_up: 'bg-violet-500/10 text-violet-400 border-violet-400/30',
      active: 'bg-amber-500/10 text-amber-400 border-amber-400/30',
      engaged: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30',
      premium: 'bg-emerald-600/10 text-emerald-500 border-emerald-500/30',
      churned: 'bg-red-500/10 text-red-400 border-red-400/30',
    };
    return colors[state] || 'bg-gray-400/10 text-gray-400';
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 7) return 'text-emerald-400';
    if (score >= 4) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${archetypeInfo.color}30` }}
            >
              {archetypeInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>ID: {persona.id}</span>
                <span>•</span>
                <span className="capitalize">{persona.demographics.occupation}</span>
              </div>
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Current State */}
            <div className={`p-4 rounded-xl border ${getStateColor(persona.current_state)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-80">Current State</span>
                <Activity className="w-4 h-4 opacity-60" />
              </div>
              <div className="text-2xl font-bold">{getStateLabel(persona.current_state)}</div>
            </div>

            {/* Archetype */}
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: `${archetypeInfo.color}15`,
                borderColor: `${archetypeInfo.color}40`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-80" style={{ color: archetypeInfo.color }}>
                  Archetype
                </span>
                <Star className="w-4 h-4 opacity-60" style={{ color: archetypeInfo.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: archetypeInfo.color }}>
                {archetypeInfo.label}
              </div>
            </div>

            {/* Satisfaction */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Satisfaction</span>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </div>
              <div className={`text-2xl font-bold ${getSatisfactionColor(persona.satisfaction_score)}`}>
                {persona.satisfaction_score.toFixed(1)}
                <span className="text-lg text-gray-500">/10</span>
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    persona.satisfaction_score >= 7
                      ? 'bg-emerald-500'
                      : persona.satisfaction_score >= 4
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${persona.satisfaction_score * 10}%` }}
                />
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Engagement Level</span>
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              <div className={`text-2xl font-bold ${getSatisfactionColor(persona.engagement_level)}`}>
                {persona.engagement_level.toFixed(1)}
                <span className="text-lg text-gray-500">/10</span>
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    persona.engagement_level >= 7
                      ? 'bg-emerald-500'
                      : persona.engagement_level >= 4
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${persona.engagement_level * 10}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Demographics */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-purple-400" />
                <h3 className="font-medium text-white">Demographics</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Age
                  </div>
                  <span className="text-white">{persona.demographics.age} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <span className="text-white">{persona.demographics.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </div>
                  <span className="text-white">{persona.demographics.occupation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </div>
                  <span className="capitalize text-white">{persona.demographics.education.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    Income Level
                  </div>
                  <span className="capitalize text-white">{persona.demographics.income_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Brain className="w-4 h-4" />
                    Tech Savviness
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${persona.demographics.tech_savviness * 10}%` }}
                      />
                    </div>
                    <span className="text-white">{persona.demographics.tech_savviness}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Traits */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-blue-400" />
                <h3 className="font-medium text-white">Behavioral Traits</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Price Sensitivity</span>
                    <span className="text-white">{persona.behavioral.price_sensitivity}/10</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${persona.behavioral.price_sensitivity * 10}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">Pain Tolerance</span>
                    <span className="text-white">{persona.behavioral.pain_tolerance}/10</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${persona.behavioral.pain_tolerance * 10}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Decision Style</span>
                  <span className="capitalize text-white">{persona.behavioral.decision_making_style}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Feature Preference</span>
                  <span className="capitalize text-white">{persona.behavioral.feature_preference}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Decision Power</span>
                  <span className="capitalize text-white">{persona.context.decision_making_power}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Timeline Urgency</span>
                  <span className="capitalize text-white">{persona.context.timeline_urgency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Context */}
          <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-white">Current Context</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Pain Level: </span>
                <span className="text-white">{persona.context.current_pain_level}/10</span>
              </div>
              <div>
                <span className="text-gray-400">Budget: </span>
                <span className="capitalize text-white">
                  {persona.context.budget_constraints || 'Not specified'}
                </span>
              </div>
              <div className="md:col-span-1">
                <span className="text-gray-400">Alternatives Used: </span>
                <span className="text-white">{persona.context.alternatives_used.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Action Timeline */}
          {persona.actions_taken && persona.actions_taken.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h3 className="font-medium text-white">Action Timeline</h3>
              </div>
              <div className="space-y-2">
                {persona.actions_taken.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                      {getActionIcon(action.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{action.action}</span>
                        <span className="text-xs text-gray-500">Day {action.day}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{action.reason}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-gray-500">Satisfaction change:</span>
                        <span
                          className={
                            action.satisfaction_change > 0
                              ? 'text-emerald-400'
                              : action.satisfaction_change < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }
                        >
                          {action.satisfaction_change > 0 ? '+' : ''}
                          {action.satisfaction_change.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
