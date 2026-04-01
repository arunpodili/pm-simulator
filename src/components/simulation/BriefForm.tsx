"use client";

import { useState } from "react";
import { Lightbulb, Users, DollarSign, TrendingUp, Target, FileText, ChevronRight, Sparkles } from "lucide-react";
import { PMBrief, LLMConfig } from "@/app/simulator/llm-simulation/page";

interface BriefFormProps {
  onStart: (config: LLMConfig) => void;
}

const CATEGORIES = [
  { id: "productivity", name: "Productivity", icon: "⚡" },
  { id: "developer_tool", name: "Developer Tool", icon: "💻" },
  { id: "ai_ml", name: "AI/ML", icon: "🤖" },
  { id: "security", name: "Security", icon: "🔒" },
  { id: "fintech", name: "FinTech", icon: "💰" },
  { id: "health", name: "Health", icon: "🏥" },
  { id: "ecommerce", name: "E-commerce", icon: "🛒" },
  { id: "communication", name: "Communication", icon: "💬" },
];

const MODES = [
  {
    id: "llm",
    name: "Deep Dive",
    description: "50 agents, 15 min, qualitative insights",
    agents: "~50",
    time: "~15 min",
    output: "Debate transcripts, specific feedback"
  },
  {
    id: "hybrid",
    name: "Complete Analysis",
    description: "Rule-based + LLM, 20 min, both metrics & insights",
    agents: "1000 + ~50",
    time: "~20 min",
    output: "Metrics + qualitative insights"
  },
];

export function BriefForm({ onStart }: BriefFormProps) {
  const [brief, setBrief] = useState<PMBrief>({
    problem: "",
    target_user: "",
    pricing: "",
    competitors: "",
    success_metric: "",
    additional_context: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<string>("llm");
  const [numPersonas, setNumPersonas] = useState<number>(5);
  const [variantsPerPersona, setVariantsPerPersona] = useState<number>(5);
  const [debateRounds, setDebateRounds] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Build full brief text
    const fullBrief = `
Problem: ${brief.problem}
Target Users: ${brief.target_user}
Pricing: ${brief.pricing}
Competitors: ${brief.competitors}
Success Metric: ${brief.success_metric}
${brief.additional_context ? `Additional Context: ${brief.additional_context}` : ""}
    `.trim();

    const config: LLMConfig = {
      brief: fullBrief,
      category: selectedCategory || undefined,
      num_personas: numPersonas,
      variants_per_persona: variantsPerPersona,
      debate_rounds: debateRounds,
      mode: selectedMode as "llm" | "hybrid",
    };

    setIsSubmitting(true);
    await onStart(config);
    setIsSubmitting(false);
  };

  const isFormValid = brief.problem.trim() && brief.target_user.trim();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Simulation Mode</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                selectedMode === mode.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {mode.id === "hybrid" ? (
                  <Sparkles className="w-6 h-6 text-purple-600" />
                ) : (
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                )}
                <span className="font-semibold text-lg">{mode.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{mode.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Agents: {mode.agents}</span>
                <span>Time: {mode.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Output: {mode.output}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Category (Optional)</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedCategory === category.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium">{category.name}</div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">Leave empty for auto-detection</p>
      </div>

      {/* Brief Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Product Brief
        </h2>

        <div className="space-y-6">
          {/* Problem */}
          <div>
            <label className="block font-medium mb-2">
              What problem does this solve? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={brief.problem}
              onChange={(e) => setBrief({ ...brief, problem: e.target.value })}
              placeholder="e.g., Product managers spend too much time in meetings and not enough time on strategic thinking"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Target Users */}
          <div>
            <label className="block font-medium mb-2">
              Who is the primary target user? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={brief.target_user}
              onChange={(e) => setBrief({ ...brief, target_user: e.target.value })}
              placeholder="e.g., Senior PMs at B2B SaaS companies with 100+ employees"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Pricing */}
          <div>
            <label className="block font-medium mb-2">
              Pricing hypothesis
            </label>
            <input
              type="text"
              value={brief.pricing}
              onChange={(e) => setBrief({ ...brief, pricing: e.target.value })}
              placeholder="e.g., $29/user/month, freemium with paid tiers, usage-based"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Competitors */}
          <div>
            <label className="block font-medium mb-2">
              Top competitors or alternatives
            </label>
            <input
              type="text"
              value={brief.competitors}
              onChange={(e) => setBrief({ ...brief, competitors: e.target.value })}
              placeholder="e.g., Manual note-taking, Otter.ai, Fireflies.ai"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Success Metric */}
          <div>
            <label className="block font-medium mb-2">
              What does success look like in 6 months?
            </label>
            <input
              type="text"
              value={brief.success_metric}
              onChange={(e) => setBrief({ ...brief, success_metric: e.target.value })}
              placeholder="e.g., 1000 paying teams, <5% monthly churn, NPS of 50+"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Additional Context */}
          <div>
            <label className="block font-medium mb-2">
              Additional context (optional)
            </label>
            <textarea
              value={brief.additional_context}
              onChange={(e) => setBrief({ ...brief, additional_context: e.target.value })}
              placeholder="Any other relevant details about the market, timing, constraints, etc."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Agent Configuration
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Primary Personas */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Personas: {numPersonas}
            </label>
            <input
              type="range"
              min={3}
              max={8}
              step={1}
              value={numPersonas}
              onChange={(e) => setNumPersonas(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Distinct behavioral archetypes</p>
          </div>

          {/* Variants per Persona */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Variants per Persona: {variantsPerPersona}
            </label>
            <input
              type="range"
              min={3}
              max={10}
              step={1}
              value={variantsPerPersona}
              onChange={(e) => setVariantsPerPersona(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Context variations per archetype</p>
          </div>

          {/* Debate Rounds */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Debate Rounds: {debateRounds}
            </label>
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={debateRounds}
              onChange={(e) => setDebateRounds(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">More rounds = deeper analysis</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total agents: <span className="font-medium">{numPersonas * variantsPerPersona}</span>
            </span>
            <span className="text-gray-600">
              Est. duration: <span className="font-medium">~{debateRounds * 1.5} min</span>
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Starting Simulation...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Run LLM Simulation ({numPersonas * variantsPerPersona} Agents)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
