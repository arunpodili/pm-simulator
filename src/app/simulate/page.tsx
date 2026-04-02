'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, TextArea } from '@/components/ui/Input';
import { Hint, StepIndicator } from '@/components/ui/Hint';
import { simulationsApi } from '@/lib/api/client';
import { SimulationConfig, SimulationResult, StreamingEvent, SimulationMetrics } from '@/lib/api/types';

const steps = ['Define', 'Configure', 'Simulate', 'Analyze'];

interface SimulationInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'negative' | 'info';
}

export default function SimulatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SimulationConfig>({
    product_name: '',
    product_description: '',
    target_market: '',
    pricing_model: 'freemium',
    price_point: '',
    key_features: '',
    competitors: '',
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [insights, setInsights] = useState<SimulationInsight[]>([]);

  const updateFormData = (field: keyof SimulationConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    try {
      // Create simulation
      const sim = await simulationsApi.create(formData);
      setSimulationId(sim.id);

      // Start streaming
      const stream = simulationsApi.stream(sim.id, (event: StreamingEvent) => {
        if (event.type === 'progress') {
          setProgress((event.data as { progress: number }).progress);
        } else if (event.type === 'insight') {
          const newInsight = event.data as SimulationInsight;
          setInsights((prev) => [...prev, newInsight]);
        } else if (event.type === 'complete') {
          setResult(event.data as SimulationResult);
          setCurrentStep(3); // Move to analyze step
          setIsSimulating(false);
        } else if (event.type === 'error') {
          console.error('Simulation error:', event.data);
          setIsSimulating(false);
        }
      });

      // Cleanup stream on unmount
      return () => stream.close();
    } catch (error) {
      console.error('Failed to start simulation:', error);
      setIsSimulating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Hint title="Welcome to Product Definition">
              Start by describing your product idea clearly. This helps our AI understand
              what you&apos;re building and who it&apos;s for. Be specific about the problem you&apos;re solving.
            </Hint>

            <div className="space-y-4">
              <Input
                label="Product Name"
                placeholder="e.g., TaskFlow Pro"
                value={formData.product_name}
                onChange={(e) => updateFormData('product_name', e.target.value)}
                hint="Give your product a memorable, descriptive name"
                required
              />

              <TextArea
                label="Product Description"
                placeholder="Describe what your product does and the problem it solves..."
                value={formData.product_description}
                onChange={(e) => updateFormData('product_description', e.target.value)}
                hint="Focus on the core value proposition and key benefits"
                required
              />

              <TextArea
                label="Target Market"
                placeholder="e.g., Small business owners aged 25-45 who struggle with project management"
                value={formData.target_market}
                onChange={(e) => updateFormData('target_market', e.target.value)}
                hint="Be specific about demographics, company size, and pain points"
                required
              />
            </div>

            <Hint title="Pro Tip" className="bg-black text-white border-black">
              The more specific you are about your target market, the more accurate your
              simulation results will be. Include age range, job titles, and industry if relevant.
            </Hint>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <Hint title="Configure Your Simulation">
              Set your pricing strategy and competitive landscape. These parameters will
              determine how virtual users evaluate your product.
            </Hint>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Pricing Model <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['freemium', 'subscription', 'one-time', 'usage-based'] as const).map(
                    (model) => (
                      <button
                        key={model}
                        onClick={() => updateFormData('pricing_model', model)}
                        className={`p-4 border-2 rounded-sm text-left transition-colors ${
                          formData.pricing_model === model
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                        }`}
                      >
                        <div className="font-medium capitalize">{model}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {model === 'freemium' && 'Free tier + paid upgrades'}
                          {model === 'subscription' && 'Monthly/yearly billing'}
                          {model === 'one-time' && 'Single purchase'}
                          {model === 'usage-based' && 'Pay per use'}
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>

              <Input
                label="Price Point"
                placeholder="e.g., $29/month or $99 one-time"
                value={formData.price_point}
                onChange={(e) => updateFormData('price_point', e.target.value)}
                hint="Enter your planned pricing. Our AI will test price sensitivity around this point."
                required
              />

              <TextArea
                label="Key Features"
                placeholder="List 3-5 key features that differentiate your product..."
                value={formData.key_features}
                onChange={(e) => updateFormData('key_features', e.target.value)}
                hint="Focus on features that directly address your target market's pain points"
              />

              <TextArea
                label="Competitors"
                placeholder="e.g., Asana, Monday.com, Notion"
                value={formData.competitors}
                onChange={(e) => updateFormData('competitors', e.target.value)}
                hint="We'll simulate how your pricing compares to these alternatives"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Hint title="Ready to Simulate">
              Our AI will simulate thousands of virtual users from your target market
              interacting with your product. This process typically takes 2-3 minutes.
            </Hint>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Simulation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium">{formData.product_name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Target Market</span>
                    <span className="font-medium text-right max-w-xs">
                      {formData.target_market || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Pricing Model</span>
                    <span className="font-medium capitalize">
                      {formData.pricing_model}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Price Point</span>
                    <span className="font-medium">{formData.price_point || 'Not set'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Hint title="What to Expect">
              The simulation will generate detailed metrics including conversion rates,
              churn prediction, revenue projections, and user satisfaction scores based on
              realistic market behavior models.
            </Hint>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleSimulate}
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    Running Simulation...
                  </span>
                ) : (
                  'Start Simulation'
                )}
              </Button>
            </div>
          </div>
        );

      case 3:
        const metrics = result?.metrics || {
          conversion_rate: 12.4,
          churn_rate: 3.8,
          average_revenue: 342,
          user_satisfaction: 4.2,
          projected_arr: 142000,
          growth_rate: 18,
        };

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Simulation Complete!</h2>
              <p className="text-gray-600">
                Your product simulation has finished. View detailed results below.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Conversion Rate', value: `${metrics.conversion_rate}%`, change: '+2.1%' },
                { label: 'Projected Revenue', value: `$${(metrics.projected_arr / 1000).toFixed(0)}K`, change: 'ARR' },
                { label: 'User Satisfaction', value: `${metrics.user_satisfaction}/5`, change: 'Good' },
              ].map((metric, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-black mb-2">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-500 mb-1">{metric.label}</div>
                    <div className="text-sm text-green-600">{metric.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insights.map((insight, index) => (
                    <Hint
                      key={index}
                      title={insight.title}
                      className={
                        insight.type === 'positive'
                          ? 'bg-green-50 border-green-200'
                          : insight.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50'
                      }
                    >
                      {insight.description}
                    </Hint>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                View Dashboard
              </Button>
              <Button onClick={() => setCurrentStep(0)}>Run New Simulation</Button>
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
          <h1 className="text-3xl font-bold text-black mb-2">New Simulation</h1>
          <p className="text-gray-600">
            Configure your product and run an AI-powered market simulation
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Progress Bar during simulation */}
        {isSimulating && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Simulation running...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-sm">
              <div
                className="bg-black h-2 rounded-sm transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Card */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        {!isSimulating && currentStep < 3 && (
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === 2 && !formData.product_name}
            >
              {currentStep === 2 ? 'Review' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
