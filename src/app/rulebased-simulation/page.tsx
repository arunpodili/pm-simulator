'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, TextArea } from '@/components/ui/Input';
import { Hint, StepIndicator } from '@/components/ui/Hint';
import { Agent3DGraph } from '@/components/simulation/Agent3DGraph';
import { AgentDetailPanel } from '@/components/simulation/AgentDetailPanel';
import {
  ruleBasedSimulationApi,
  transformToGraphData,
  getStateLabel,
  getArchetypeInfo,
} from '@/lib/api/ruleBasedSimulation';
import {
  EnhancedSimulationConfig,
  EnhancedSimulationResult,
  StreamingEvent,
  GraphNode,
  GraphLink,
} from '@/lib/api/types';
import {
  Users,
  Settings,
  BarChart3,
  Play,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Download,
  Eye,
} from 'lucide-react';

const steps = ['Product Definition', 'Persona Configuration', 'Run Simulation', 'Results & 3D View'];

const INDUSTRIES = [
  { value: 'saas', label: 'SaaS / B2B Software' },
  { value: 'fintech', label: 'FinTech / Financial Services' },
  { value: 'health', label: 'HealthTech / Healthcare' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'ai_ml', label: 'AI / Machine Learning' },
  { value: 'education', label: 'EdTech / Education' },
  { value: 'other', label: 'Other' },
] as const;

const PRICING_MODELS = [
  { value: 'freemium', label: 'Freemium', desc: 'Free tier + paid upgrades' },
  { value: 'subscription', label: 'Subscription', desc: 'Monthly/yearly billing' },
  { value: 'one-time', label: 'One-time Purchase', desc: 'Single purchase' },
  { value: 'usage-based', label: 'Usage-based', desc: 'Pay per use' },
] as const;

export default function RuleBasedSimulationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EnhancedSimulationResult | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  });
  const [selectedAgent, setSelectedAgent] = useState<GraphNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [config, setConfig] = useState<EnhancedSimulationConfig>({
    product_name: '',
    product_description: '',
    target_industry: 'saas',
    persona_count: 1000,
    demographics: {
      age_range: { min: 25, max: 45 },
      locations: ['United States', 'Europe'],
      income_levels: ['medium', 'high'],
      education_levels: ['college', 'graduate'],
      occupations: [],
      tech_savviness_range: { min: 5, max: 9 },
    },
    behavioral_traits: {
      price_sensitivity_range: { min: 3, max: 8 },
      pain_tolerance_range: { min: 4, max: 9 },
      decision_styles: ['analytical', 'social'],
      feature_preferences: ['simplicity', 'power'],
    },
    pricing_model: 'freemium',
    price_point: '',
    key_features: [],
    pain_points_solved: [],
    differentiators: [],
    competitors: [],
    marketing_spend_level: 'medium',
    market_saturation: 'medium',
    competitor_strength: 'medium',
    simulation_days: 90,
    enable_social_influence: true,
  });

  const updateConfig = <K extends keyof EnhancedSimulationConfig>(
    field: K,
    value: EnhancedSimulationConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const updateDemographics = <K extends keyof EnhancedSimulationConfig['demographics']>(
    field: K,
    value: EnhancedSimulationConfig['demographics'][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      demographics: { ...prev.demographics, [field]: value },
    }));
  };

  const updateBehavioralTraits = <K extends keyof EnhancedSimulationConfig['behavioral_traits']>(
    field: K,
    value: EnhancedSimulationConfig['behavioral_traits'][K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      behavioral_traits: { ...prev.behavioral_traits, [field]: value },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setProgress(0);
    setError(null);

    try {
      // Create simulation
      const sim = await ruleBasedSimulationApi.create(config);
      setSimulationId(sim.id);

      // Run simulation
      await ruleBasedSimulationApi.run(sim.id);

      // Stream progress
      const stream = ruleBasedSimulationApi.stream(
        sim.id,
        (event: StreamingEvent) => {
          if (event.type === 'progress') {
            setProgress((event.data as { progress: number }).progress);
          } else if (event.type === 'complete') {
            const resultData = event.data as EnhancedSimulationResult;
            setResult(resultData);
            setGraphData(transformToGraphData(resultData));
            setCurrentStep(3);
            setIsSimulating(false);
          } else if (event.type === 'error') {
            setError((event.data as { message: string }).message || 'Simulation failed');
            setIsSimulating(false);
          }
        },
        (err) => {
          setError(err.message);
          setIsSimulating(false);
        }
      );

      return () => stream.close();
    } catch (err: any) {
      setError(err.message || 'Failed to start simulation');
      setIsSimulating(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    if (!simulationId) return;
    try {
      const blob = await ruleBasedSimulationApi.exportResults(simulationId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simulation-${simulationId}.${format}`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Hint title="Define Your Product">
              Describe your product idea and target market. This helps us create realistic personas
              that match your intended audience.
            </Hint>

            <div className="space-y-4">
              <Input
                label="Product Name"
                placeholder="e.g., TaskFlow Pro"
                value={config.product_name}
                onChange={(e) => updateConfig('product_name', e.target.value)}
                required
              />

              <TextArea
                label="Product Description"
                placeholder="Describe what your product does and the problem it solves..."
                value={config.product_description}
                onChange={(e) => updateConfig('product_description', e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Target Industry <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.target_industry}
                  onChange={(e) => updateConfig('target_industry', e.target.value as any)}
                  className="w-full p-3 border-2 border-gray-300 rounded-sm focus:border-black focus:outline-none"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <TextArea
                label="Pain Points Solved"
                placeholder="What specific pain points does your product address? (comma-separated)"
                value={config.pain_points_solved.join(', ')}
                onChange={(e) =>
                  updateConfig(
                    'pain_points_solved',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
              />

              <TextArea
                label="Key Differentiators"
                placeholder="What makes your product unique compared to alternatives? (comma-separated)"
                value={config.differentiators.join(', ')}
                onChange={(e) =>
                  updateConfig(
                    'differentiators',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Hint title="Configure Target Personas">
              Define the characteristics of your target users. These settings will generate{' '}
              <strong>{config.persona_count.toLocaleString()}</strong> unique AI agents that behave
              according to these parameters.
            </Hint>

            <div className="space-y-6">
              {/* Persona Count Slider */}
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-sm font-medium text-black mb-2">
                  Number of AI Agents:{' '}
                  <span className="text-lg font-bold">{config.persona_count.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={config.persona_count}
                  onChange={(e) => updateConfig('persona_count', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>

              {/* Demographics */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Age Range: {config.demographics.age_range.min} -{' '}
                      {config.demographics.age_range.max} years
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={config.demographics.age_range.min}
                        onChange={(e) =>
                          updateDemographics('age_range', {
                            ...config.demographics.age_range,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={config.demographics.age_range.max}
                        onChange={(e) =>
                          updateDemographics('age_range', {
                            ...config.demographics.age_range,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Tech Savviness */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Tech Savviness: {config.demographics.tech_savviness_range.min} -{' '}
                      {config.demographics.tech_savviness_range.max} / 10
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={config.demographics.tech_savviness_range.min}
                        onChange={(e) =>
                          updateDemographics('tech_savviness_range', {
                            ...config.demographics.tech_savviness_range,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={config.demographics.tech_savviness_range.max}
                        onChange={(e) =>
                          updateDemographics('tech_savviness_range', {
                            ...config.demographics.tech_savviness_range,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Income Levels */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Income Levels</label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            const current = config.demographics.income_levels;
                            const updated = current.includes(level)
                              ? current.filter((l) => l !== level)
                              : [...current, level];
                            updateDemographics('income_levels', updated);
                          }}
                          className={`px-4 py-2 rounded border capitalize ${
                            config.demographics.income_levels.includes(level)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Market */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Pricing & Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {PRICING_MODELS.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => updateConfig('pricing_model', model.value as any)}
                        className={`p-4 border-2 rounded-sm text-left transition-colors ${
                          config.pricing_model === model.value
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs mt-1 opacity-80">{model.desc}</div>
                      </button>
                    ))}
                  </div>

                  <Input
                    label="Price Point"
                    placeholder="e.g., $29/month"
                    value={config.price_point}
                    onChange={(e) => updateConfig('price_point', e.target.value)}
                  />

                  <TextArea
                    label="Competitors"
                    placeholder="List your main competitors (comma-separated)"
                    value={config.competitors.join(', ')}
                    onChange={(e) =>
                      updateConfig('competitors', e.target.value.split(',').map((s) => s.trim()))
                    }
                  />

                  {/* Marketing Spend */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Marketing Spend Level
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => updateConfig('marketing_spend_level', level)}
                          className={`flex-1 px-4 py-2 rounded border capitalize ${
                            config.marketing_spend_level === level
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simulation Settings */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Simulation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Simulation Duration: {config.simulation_days} days
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="30"
                      value={config.simulation_days}
                      onChange={(e) => updateConfig('simulation_days', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30 days</span>
                      <span>1 year</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="social-influence"
                      checked={config.enable_social_influence}
                      onChange={(e) => updateConfig('enable_social_influence', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="social-influence" className="text-sm">
                      Enable social influence (word-of-mouth effects)
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Hint title="Ready to Simulate">
              We'll create <strong>{config.persona_count.toLocaleString()}</strong> AI agents with
              the characteristics you defined. Each agent will behave independently based on their
              demographics, traits, and social connections.
            </Hint>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Simulation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium">{config.product_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium capitalize">{config.target_industry}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">AI Agents</span>
                    <span className="font-medium">{config.persona_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Age Range</span>
                    <span className="font-medium">
                      {config.demographics.age_range.min}-{config.demographics.age_range.max} years
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Simulation Duration</span>
                    <span className="font-medium">{config.simulation_days} days</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Social Influence</span>
                    <span className="font-medium">
                      {config.enable_social_influence ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Button size="lg" onClick={handleSimulate} disabled={isSimulating}>
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Running Simulation ({progress}%)
                  </span>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </Button>
            </div>

            {isSimulating && (
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        );

      case 3:
        if (!result) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-600">No results available. Run a simulation first.</p>
              <Button onClick={() => setCurrentStep(0)} className="mt-4">
                Start New Simulation
              </Button>
            </div>
          );
        }

        const metrics = result.final_metrics;

        return (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Simulation Complete!</h2>
              <p className="text-gray-600">
                Analyzed {metrics.total_personas.toLocaleString()} AI agents over{' '}
                {config.simulation_days} days
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Conversion Rate', value: `${(metrics.conversion_rate * 100).toFixed(1)}%` },
                { label: 'Total Users', value: metrics.signed_up_count.toLocaleString() },
                { label: 'NPS Score', value: metrics.nps.toFixed(0) },
                { label: 'Avg Satisfaction', value: `${metrics.avg_satisfaction.toFixed(1)}/10` },
              ].map((metric, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-black">{metric.value}</div>
                    <div className="text-sm text-gray-500">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* State Distribution */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Agent State Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(metrics)
                    .filter(([key]) => key.includes('_count'))
                    .map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded border">
                        <div className="text-lg font-bold">{(value as number).toLocaleString()}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {getStateLabel(key.replace('_count', ''))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* 3D Visualization */}
            <Card variant="bordered">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  3D Agent Network
                </CardTitle>
                <div className="text-sm text-gray-500">
                  Click any agent to view details • Drag to rotate
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Agent3DGraph
                    nodes={graphData.nodes}
                    links={graphData.links}
                    width={800}
                    height={600}
                    onAgentSelect={setSelectedAgent}
                    selectedAgentId={selectedAgent?.id}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => handleExport('json')}>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="secondary" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep(0);
                  setResult(null);
                  setSelectedAgent(null);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Run New Simulation
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Rule-Based PM Simulator</h1>
          <p className="text-gray-600">
            Simulate {config.persona_count.toLocaleString()}+ AI agents to test your product idea
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        {!isSimulating && currentStep !== 3 && (
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={currentStep === 2 && !config.product_name}>
              {currentStep === 2 ? 'Review' : 'Continue'}
            </Button>
          </div>
        )}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
