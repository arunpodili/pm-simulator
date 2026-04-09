'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Activity,
  Download,
  FileText,
  Table,
  ExternalLink,
  RotateCcw,
  Share2,
  ChevronRight,
  Brain,
  Zap,
  MessageSquare,
  BarChart3,
  PieChart,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimulationConfig, Persona } from '@/lib/api/types';
import { AgentNetwork3D } from '@/components/3d-visualization';
import { useAgentData } from '@/components/3d-visualization/hooks/useAgentData';

interface SimulationResultsProps {
  results: any;
  config: SimulationConfig | null;
  personas: Persona[];
  onNewSimulation: () => void;
}

export function SimulationResults({
  results,
  config,
  personas,
  onNewSimulation,
}: SimulationResultsProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<string | null>(null);

  // Mock metrics - replace with actual results
  const defaultMetrics = {
    conversion_rate: 12.4,
    churn_rate: 3.8,
    average_revenue: 342,
    user_satisfaction: 4.2,
    projected_arr: 142000,
    growth_rate: 18,
    nps_score: 42,
    total_signups: 2450,
    paying_customers: 304,
  };
  const metrics = { ...defaultMetrics, ...(results?.metrics || {}) };

  // Load 3D agent data
  const { agents, loading: agentsLoading } = useAgentData(
    results?.id || 'mock-sim',
    metrics.total_signups || 10000
  );

  const insights = results?.insights || [
    {
      title: 'Strong Product-Market Fit',
      description: 'High conversion rates indicate strong resonance with target personas',
      type: 'positive',
    },
    {
      title: 'Pricing Optimization Needed',
      description: 'Consider testing lower price points to improve conversion',
      type: 'warning',
    },
    {
      title: 'Churn Risk Detected',
      description: 'Skeptic personas show higher churn - add onboarding improvements',
      type: 'negative',
    },
  ];

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional PDF with charts and insights',
      icon: FileText,
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'excel',
      name: 'Excel Data',
      description: 'Raw data in spreadsheet format',
      icon: Table,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'notion',
      name: 'Notion Page',
      description: 'Export directly to Notion workspace',
      icon: ExternalLink,
      color: 'from-slate-500 to-slate-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gradient mb-2">Simulation Complete!</h2>
        <p className="text-gray-400">
          Your product has been tested with {personas.length} persona types across 10,000+ AI agents
        </p>
      </motion.div>

      {/* Bento Grid Dashboard */}
      <div className="bento-grid">
        {/* Main Metrics Card - Large */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bento-item-large glass-elevated rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Key Metrics
            </h3>
            <div className="badge badge-primary">Live</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Conversion Rate"
              value={`${metrics.conversion_rate}%`}
              change="+2.4%"
              trend="up"
              icon={Target}
            />
            <MetricCard
              label="Projected ARR"
              value={`$${(metrics.projected_arr / 1000).toFixed(0)}K`}
              change="+18%"
              trend="up"
              icon={DollarSign}
            />
            <MetricCard
              label="User Satisfaction"
              value={`${metrics.user_satisfaction}/5`}
              change="+0.3"
              trend="up"
              icon={Activity}
            />
            <MetricCard
              label="NPS Score"
              value={metrics.nps_score.toString()}
              change="+8"
              trend="up"
              icon={Users}
            />
          </div>
        </motion.div>

        {/* 3D Agent Network - Large */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bento-item-large glass-elevated rounded-2xl p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Agent Network
            </h3>
            <div className="flex gap-2">
              {['Active', 'Converted', 'Churned'].map((label, i) => (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-accent' : i === 1 ? 'bg-primary' : 'bg-danger'
                    }`}
                  />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[400px] rounded-xl overflow-hidden bg-surface-muted">
            {agentsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="glass rounded-xl p-6 text-center">
                  <div className="text-xl font-bold mb-2">Loading Agent Network...</div>
                  <div className="text-gray-400">Generating {metrics.total_signups?.toLocaleString() || '10,000'} agents</div>
                </div>
              </div>
            ) : (
              <AgentNetwork3D
                agents={agents}
                agentCount={metrics.total_signups || 10000}
                height={400}
              />
            )}
          </div>
        </motion.div>

        {/* Persona Performance - Wide */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bento-item-wide glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Persona Performance
          </h3>

          <div className="space-y-3">
            {personas.slice(0, 4).map((persona, index) => (
              <div key={persona.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-xs font-bold">{persona.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{persona.name}</span>
                    <span className="text-sm text-accent">
                      {Math.round(85 - index * 10)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${85 - index * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Forecast - Wide */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bento-item-wide glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold" />
            Revenue Forecast
          </h3>

          <div className="h-32 flex items-end gap-2">
            {[
              { month: 'M1', value: 12, projected: 15 },
              { month: 'M2', value: 28, projected: 32 },
              { month: 'M3', value: 45, projected: 52 },
              { month: 'M4', value: 62, projected: 71 },
              { month: 'M5', value: 78, projected: 91 },
              { month: 'M6', value: 95, projected: 115 },
            ].map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 h-24 items-end">
                  <div
                    className="flex-1 bg-accent/60 rounded-t"
                    style={{ height: `${data.value}%` }}
                  />
                  <div
                    className="flex-1 bg-primary/40 rounded-t"
                    style={{ height: `${data.projected}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent/60 rounded" />
              <span className="text-gray-400">Actual</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary/40 rounded" />
              <span className="text-gray-400">Projected</span>
            </div>
          </div>
        </motion.div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold" />
            AI Insights
          </h3>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  insight.type === 'positive'
                    ? 'border-accent/30 bg-accent/5'
                    : insight.type === 'warning'
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-danger/30 bg-danger/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      insight.type === 'positive'
                        ? 'bg-accent'
                        : insight.type === 'warning'
                        ? 'bg-gold'
                        : 'bg-danger'
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm">{insight.title}</div>
                    <div className="text-xs text-gray-400">{insight.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Export Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Export Report
          </h3>

          <div className="space-y-2">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedExportFormat(format.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg glass-muted hover:border-primary/30 transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${format.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{format.name}</div>
                    <div className="text-xs text-gray-400">{format.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8"
      >
        <Button onClick={onNewSimulation} variant="ghost" className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          New Simulation
        </Button>
        <Button
          onClick={() => setShowExportModal(true)}
          className="btn-gold flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Full Report
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </motion.div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-danger' : 'text-gray-400'
          }`}
        >
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
