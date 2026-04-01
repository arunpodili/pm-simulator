"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Users,
  Clock,
  Building2,
  Target,
  Lightbulb,
  FileText,
  BarChart3,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { SimulationConfig } from "@/app/simulator/user-simulation/page";
import { simulationApi } from "@/lib/simulation-api";

interface SimulationSetupProps {
  onStart: (config: SimulationConfig) => void;
  onViewExisting: (id: string) => void;
}

const INDUSTRIES = [
  { id: "saas", name: "SaaS", icon: "☁️" },
  { id: "fintech", name: "FinTech", icon: "💰" },
  { id: "health", name: "Health", icon: "🏥" },
  { id: "ecommerce", name: "E-commerce", icon: "🛒" },
  { id: "ai_ml", name: "AI/ML", icon: "🤖" },
];

const TEMPLATES = [
  {
    id: "saas_launch",
    name: "SaaS Product Launch",
    description: "Simulate launch of a new SaaS feature",
    defaultPersonas: 1000,
    defaultDays: 90,
  },
  {
    id: "mobile_app",
    name: "Mobile App Release",
    description: "Simulate mobile app user acquisition",
    defaultPersonas: 5000,
    defaultDays: 60,
  },
  {
    id: "enterprise_feature",
    name: "Enterprise Feature Rollout",
    description: "Simulate enterprise feature adoption",
    defaultPersonas: 500,
    defaultDays: 180,
  },
];

export function SimulationSetup({ onStart, onViewExisting }: SimulationSetupProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSimulations, setExistingSimulations] = useState<any[]>([]);
  const [config, setConfig] = useState<SimulationConfig>({
    name: "",
    feature_description: "",
    target_industry: "saas",
    persona_count: 1000,
    simulation_days: 90,
    features: [],
    pain_points_solved: [],
    differentiators: [],
    market_saturation: 0.5,
    competitor_strength: 0.5,
    marketing_spend_level: "medium",
  });

  // Load existing simulations on mount
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const { simulations } = await simulationApi.list();
        setExistingSimulations(simulations);
      } catch (e) {
        console.error("Failed to load simulations:", e);
      }
    };
    loadExisting();
  }, []);

  const handleTemplateSelect = (template: (typeof TEMPLATES)[0]) => {
    setConfig((prev) => ({
      ...prev,
      name: template.name,
      persona_count: template.defaultPersonas,
      simulation_days: template.defaultDays,
    }));
    setStep(2);
  };

  const handleIndustrySelect = (industryId: string) => {
    setConfig((prev) => ({ ...prev, target_industry: industryId }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await onStart(config);
    setIsLoading(false);
  };

  const isStep2Valid =
    config.name.trim() &&
    config.feature_description.trim() &&
    config.feature_description.length >= 50;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {i < 2 && (
              <div
                className={`w-20 h-1 mx-2 ${
                  step > s ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">
              Choose a Starting Point
            </h2>
            <p className="text-gray-600">
              Select a template or start from scratch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {template.defaultPersonas.toLocaleString()} users
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.defaultDays} days
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Existing Simulations */}
          {existingSimulations.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-semibold mb-4">Recent Simulations</h3>
              <div className="space-y-2">
                {existingSimulations.slice(0, 5).map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onViewExisting(sim.id)}
                    className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium">{sim.name}</div>
                        <div className="text-sm text-gray-500">
                          {sim.status} • {new Date(sim.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to templates
          </button>

          <div className="space-y-6">
            {/* Industry Selection */}
            <div>
              <label className="block font-medium mb-3">Target Industry</label>
              <div className="grid grid-cols-5 gap-3">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustrySelect(industry.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      config.target_industry === industry.id
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{industry.icon}</div>
                    <div className="font-medium text-sm">{industry.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Name */}
            <div>
              <label className="block font-medium mb-2">Simulation Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Q4 Feature Launch Simulation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Feature Description */}
            <div>
              <label className="block font-medium mb-2">Feature Description</label>
              <textarea
                value={config.feature_description}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    feature_description: e.target.value,
                  }))
                }
                placeholder="Describe your feature in detail. What problem does it solve? Who is it for? What makes it unique?"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
              <div className="text-sm text-gray-500 mt-1">
                {config.feature_description.length} characters (min 50
                recommended)
              </div>
            </div>

            {/* Features List */}
            <div>
              <label className="block font-medium mb-2">Key Features</label>
              <input
                type="text"
                placeholder="Add features (comma separated)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      setConfig((prev) => ({
                        ...prev,
                        features: [...prev.features, value],
                      }));
                      e.currentTarget.value = "";
                    }
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {config.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                  >
                    {feature}
                    <button
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          features: prev.features.filter((_, idx) => idx !== i),
                        }))
                      }
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Configure Simulation
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Advanced Settings */}
      {step === 3 && (
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to configuration
          </button>

          <div className="space-y-6">
            {/* Persona Count and Days */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">
                  Number of Simulated Users
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={config.persona_count}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        persona_count: parseInt(e.target.value) || 100,
                      }))
                    }
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 1,000 for accuracy
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Simulation Duration (Days)
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={config.simulation_days}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        simulation_days: parseInt(e.target.value) || 30,
                      }))
                    }
                    min={30}
                    max={365}
                    step={30}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Simulates {config.simulation_days} days of real usage
                </p>
              </div>
            </div>

            {/* Market Conditions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Market Conditions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Market Saturation: {(config.market_saturation * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={config.market_saturation}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        market_saturation: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Competitor Strength: {(config.competitor_strength * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={config.competitor_strength}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        competitor_strength: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Marketing Spend Level
                  </label>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            marketing_spend_level: level as any,
                          }))
                        }
                        className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-colors ${
                          config.marketing_spend_level === level
                            ? "bg-black text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Simulation ({config.persona_count.toLocaleString()} Users)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
