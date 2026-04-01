"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Play,
  ChevronDown,
  ChevronUp,
  Activity,
  Target,
  DollarSign,
  Award,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SimulationResultsProps {
  data: any;
  onNewSimulation: () => void;
  onExport: () => void;
}

const COLORS = {
  promoter: "#22c55e",
  passive: "#3b82f6",
  neutral: "#f59e0b",
  detractor: "#ef4444",
};

const ARCHETYPE_COLORS = {
  innovator: "#8b5cf6",
  early_adopter: "#06b6d4",
  early_majority: "#22c55e",
  late_majority: "#f59e0b",
  laggard: "#ef4444",
};

export function SimulationResults({
  data,
  onNewSimulation,
  onExport,
}: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "adoption" | "cohorts" | "agents"
  >("overview");
  const [expandedCohort, setExpandedCohort] = useState<string | null>(null);

  const { final_metrics, predictions, adoption_curve, cohort_analysis } = data;

  // Format adoption curve for chart
  const chartData = adoption_curve.map((value: number, index: number) => ({
    day: index,
    users: value,
  }));

  // NPS gauge color
  const getNPSColor = (nps: number) => {
    if (nps >= 50) return "text-green-600";
    if (nps >= 0) return "text-blue-600";
    return "text-red-600";
  };

  // Satisfaction emoji
  const getSatisfactionEmoji = (score: number) => {
    if (score >= 7) return <Smile className="w-6 h-6 text-green-500" />;
    if (score >= 4) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-500" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold">{data.config.name}</h2>
          <p className="text-gray-600">
            {data.config.target_industry} • {data.config.persona_count.toLocaleString()} personas •{" "}
            {data.config.simulation_days} days
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onNewSimulation}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            New Simulation
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Predicted NPS"
          value={predictions.nps.toFixed(1)}
          subtitle={predictions.nps >= 50 ? "Excellent" : predictions.nps >= 0 ? "Good" : "Needs Work"}
          icon={<Award className="w-5 h-5" />}
          trend={predictions.nps >= 50 ? "up" : "neutral"}
          color={getNPSColor(predictions.nps)}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(final_metrics.conversion_rate * 100).toFixed(1)}%`}
          subtitle={`${final_metrics.total_signed_up.toLocaleString()} signups`}
          icon={<Users className="w-5 h-5" />}
          trend="up"
        />
        <MetricCard
          title="Churn Rate"
          value={`${(predictions.churn_rate * 100).toFixed(1)}%`}
          subtitle={`${final_metrics.churned_count} churned`}
          icon={<TrendingDown className="w-5 h-5" />}
          trend={predictions.churn_rate < 0.1 ? "up" : "down"}
        />
        <MetricCard
          title="Predicted CLV"
          value={`$${predictions.clv.toFixed(0)}`}
          subtitle="Customer Lifetime Value"
          icon={<DollarSign className="w-5 h-5" />}
          trend="up"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "adoption", label: "Adoption Curve", icon: TrendingUp },
            { id: "cohorts", label: "Cohort Analysis", icon: Target },
            { id: "agents", label: "Agent Explorer", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* State Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold mb-4">User State Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Aware", value: final_metrics.aware_count, color: "#e5e7eb" },
                          { name: "Signed Up", value: final_metrics.signed_up_count, color: "#3b82f6" },
                          { name: "Active", value: final_metrics.activated_count, color: "#22c55e" },
                          { name: "Engaged", value: final_metrics.engaged_count, color: "#8b5cf6" },
                          { name: "Churned", value: final_metrics.churned_count, color: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: "Aware", value: final_metrics.aware_count, color: "#e5e7eb" },
                          { name: "Signed Up", value: final_metrics.signed_up_count, color: "#3b82f6" },
                          { name: "Active", value: final_metrics.activated_count, color: "#22c55e" },
                          { name: "Engaged", value: final_metrics.engaged_count, color: "#8b5cf6" },
                          { name: "Churned", value: final_metrics.churned_count, color: "#ef4444" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[
                    { label: "Signed Up", value: final_metrics.signed_up_count, color: "bg-blue-500" },
                    { label: "Active", value: final_metrics.activated_count, color: "bg-green-500" },
                    { label: "Engaged", value: final_metrics.engaged_count, color: "bg-purple-500" },
                    { label: "Churned", value: final_metrics.churned_count, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-600">
                        {item.label}: {item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Satisfaction Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Satisfaction Breakdown</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Promoters (9-10)",
                      percentage: Math.max(0, (predictions.nps + 100) / 2 - 20),
                      color: "bg-green-500",
                    },
                    {
                      label: "Passives (7-8)",
                      percentage: 20,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Neutrals (5-6)",
                      percentage: 15,
                      color: "bg-yellow-500",
                    },
                    {
                      label: "Detractors (0-4)",
                      percentage: Math.max(0, 100 - (predictions.nps + 100) / 2 - 35),
                      color: "bg-red-500",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {predictions.nps >= 50
                        ? "🎉"
                        : predictions.nps >= 0
                        ? "👍"
                        : "⚠️"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {predictions.nps >= 50
                          ? "Excellent product-market fit predicted"
                          : predictions.nps >= 0
                          ? "Good reception expected"
                          : "Address pain points before launch"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Based on {data.config.persona_count.toLocaleString()} simulated interactions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Adoption Curve Tab */}
        {activeTab === "adoption" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Predicted Adoption Curve</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Users", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString()} users`,
                      "Adoption",
                    ]}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#000"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Day 30 Projection</div>
                <div className="text-2xl font-bold">
                  {adoption_curve[29]?.toLocaleString() || "N/A"} users
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Day 60 Projection</div>
                <div className="text-2xl font-bold">
                  {adoption_curve[59]?.toLocaleString() || "N/A"} users
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Final Day Projection</div>
                <div className="text-2xl font-bold">
                  {adoption_curve[adoption_curve.length - 1]?.toLocaleString() || "N/A"} users
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cohorts Tab */}
        {activeTab === "cohorts" && cohort_analysis && (
          <div className="space-y-6">
            {/* By Archetype */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Performance by Adoption Archetype</h3>
              <div className="space-y-3">
                {Object.entries(cohort_analysis.by_archetype || {}).map(
                  ([archetype, data]: [string, any]) => (
                    <div
                      key={archetype}
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() =>
                        setExpandedCohort(
                          expandedCohort === archetype ? null : archetype
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor:
                                ARCHETYPE_COLORS[archetype as keyof typeof ARCHETYPE_COLORS] ||
                                "#999",
                            }}
                          />
                          <span className="font-medium capitalize">
                            {archetype.replace("_", " ")}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({data.count} users)
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Satisfaction</div>
                            <div className="font-medium">
                              {data.avg_satisfaction?.toFixed(1) || "N/A"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Engagement</div>
                            <div className="font-medium">
                              {((data.avg_engagement || 0) * 100).toFixed(0)}%
                            </div>
                          </div>
                          {expandedCohort === archetype ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedCohort === archetype && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            {getArchetypeInsight(archetype, data)}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* By Tech Savviness */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Performance by Tech Savviness</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(cohort_analysis.by_tech_savviness || {}).map(
                      ([level, data]: [string, any]) => ({
                        level: level.charAt(0).toUpperCase() + level.slice(1),
                        satisfaction: data.avg_satisfaction || 0,
                        engagement: (data.avg_engagement || 0) * 10,
                        count: data.count,
                      })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="satisfaction" fill="#3b82f6" name="Satisfaction" />
                    <Bar dataKey="engagement" fill="#22c55e" name="Engagement (×10)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Agent Explorer</h3>
            <p className="text-gray-600 mb-6">
              Explore individual simulated users. See their journey, decisions, and feedback.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  name: "Sarah Chen",
                  archetype: "Early Adopter",
                  state: "engaged",
                  satisfaction: 8.5,
                  insight: "Loves the new features but wants better onboarding",
                },
                {
                  name: "Marcus Johnson",
                  archetype: "Late Majority",
                  state: "active",
                  satisfaction: 6.2,
                  insight: "Needs more hand-holding during setup",
                },
                {
                  name: "Emma Rodriguez",
                  archetype: "Innovator",
                  state: "advocate",
                  satisfaction: 9.1,
                  insight: "Already referred 3 colleagues",
                },
              ].map((agent, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-black transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-medium">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-xs text-gray-500">{agent.archetype}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        agent.state === "advocate"
                          ? "bg-green-100 text-green-700"
                          : agent.state === "engaged"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {agent.state}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      {getSatisfactionEmoji(agent.satisfaction)}
                      <span className="font-medium">{agent.satisfaction.toFixed(1)}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{agent.insight}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Explore Full Dataset</div>
                  <p className="text-sm text-blue-700 mt-1">
                    View all {final_metrics.total_personas.toLocaleString()} simulated agents and their
                    detailed journeys by exporting the results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  color?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        {trend === "up" && (
          <TrendingUp className="w-5 h-5 text-green-500" />
        )}
        {trend === "down" && (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
      </div>
      <div className={`text-3xl font-bold mb-1 ${color || ""}`}>{value}</div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </div>
  );
}

function getArchetypeInsight(archetype: string, data: any): string {
  const insights: Record<string, string> = {
    innovator:
      "Innovators love trying new things but move on quickly. Focus on cutting-edge features to retain them.",
    early_adopter:
      "Early adopters are your champions. They'll pay premium prices and refer others if delighted.",
    early_majority:
      "The early majority needs social proof. Case studies and testimonials are key to converting them.",
    late_majority:
      "Late majority users want simplicity and reliability. Avoid complexity in your UX.",
    laggard:
      "Laggards resist change. You may need to sunset support for old workflows to move them.",
  };

  return (
    insights[archetype] ||
    `${archetype} users showed average satisfaction of ${data.avg_satisfaction?.toFixed(1)}.`
  );
}
