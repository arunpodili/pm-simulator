"use client";

import { useState } from "react";
import { Lightbulb, Users, DollarSign, TrendingUp, Target, FileText, ChevronRight, BarChart3 } from "lucide-react";

interface BriefFormProps {
  onStart: (config: {
    product_name: string;
    product_description: string;
    target_market: string;
    pricing_model: "freemium" | "subscription" | "one-time" | "usage-based";
    price_point: string;
    key_features: string;
    competitors: string;
    persona_count: number;
    simulation_days: number;
  }) => void;
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

const PRICING_MODELS = [
  { id: "freemium", name: "Freemium", description: "Free tier + paid features" },
  { id: "subscription", name: "Subscription", description: "Monthly/annual recurring" },
  { id: "one-time", name: "One-time", description: "Single purchase" },
  { id: "usage-based", name: "Usage-based", description: "Pay per use" },
];

export function BriefForm({ onStart }: BriefFormProps) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    target_market: "",
    pricing_model: "freemium" as const,
    price_point: "",
    key_features: "",
    competitors: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [personaCount, setPersonaCount] = useState<number>(1000);
  const [simulationDays, setSimulationDays] = useState<number>(90);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onStart({
      ...formData,
      persona_count: personaCount,
      simulation_days: simulationDays,
    });
    setIsSubmitting(false);
  };

  const isFormValid =
    formData.product_name.trim() &&
    formData.product_description.trim() &&
    formData.target_market.trim();

  return (
    <div className="max-w-4xl mx-auto">
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
        <p className="text-sm text-gray-500 mt-2">Helps calibrate persona generation</p>
      </div>

      {/* Product Brief Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Product Brief
        </h2>

        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
              placeholder="e.g., TaskFlow Pro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block font-medium mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.product_description}
              onChange={(e) =>
                setFormData({ ...formData, product_description: e.target.value })
              }
              placeholder="Describe what your product does and the problem it solves..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Target Market */}
          <div>
            <label className="block font-medium mb-2">
              Target Market <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.target_market}
              onChange={(e) =>
                setFormData({ ...formData, target_market: e.target.value })
              }
              placeholder="e.g., Small business owners aged 25-45, SaaS companies with 100+ employees"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Pricing Model */}
          <div>
            <label className="block font-medium mb-2">Pricing Model</label>
            <div className="grid md:grid-cols-2 gap-4">
              {PRICING_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() =>
                    setFormData({ ...formData, pricing_model: model.id as any })
                  }
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.pricing_model === model.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Point */}
          <div>
            <label className="block font-medium mb-2">Price Point</label>
            <input
              type="text"
              value={formData.price_point}
              onChange={(e) =>
                setFormData({ ...formData, price_point: e.target.value })
              }
              placeholder="e.g., $29/user/month, $99 one-time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block font-medium mb-2">Key Features</label>
            <textarea
              value={formData.key_features}
              onChange={(e) =>
                setFormData({ ...formData, key_features: e.target.value })
              }
              placeholder="List the key features that differentiate your product..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Competitors */}
          <div>
            <label className="block font-medium mb-2">Competitors</label>
            <input
              type="text"
              value={formData.competitors}
              onChange={(e) =>
                setFormData({ ...formData, competitors: e.target.value })
              }
              placeholder="e.g., Asana, Monday.com, Notion"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Simulation Configuration */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Simulation Configuration
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Persona Count */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Persona Count: {personaCount}
            </label>
            <input
              type="range"
              min={100}
              max={2000}
              step={100}
              value={personaCount}
              onChange={(e) => setPersonaCount(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Virtual users to simulate (100-2000)
            </p>
          </div>

          {/* Simulation Days */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Simulation Days: {simulationDays}
            </label>
            <input
              type="range"
              min={30}
              max={180}
              step={30}
              value={simulationDays}
              onChange={(e) => setSimulationDays(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Days to simulate (30-180)
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total agents: <span className="font-medium">{personaCount}</span>
            </span>
            <span className="text-gray-600">
              Est. duration: <span className="font-medium">~5 min</span>
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
              <BarChart3 className="w-5 h-5 animate-pulse" />
              Running Simulation...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Run Simulation ({personaCount} Personas)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
