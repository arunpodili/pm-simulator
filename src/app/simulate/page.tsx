'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Users,
  Play,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Target,
  TrendingUp,
  Building2,
  ShoppingCart,
  Briefcase,
  Gamepad2,
  Heart,
  GraduationCap,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PersonaBuilder } from '@/components/simulation-wizard/PersonaBuilder';
import { SimulationRunning } from '@/components/simulation-wizard/SimulationRunning';
import { SimulationResults } from '@/components/simulation-wizard/SimulationResults';
import { simulationsApi } from '@/lib/api/client';
import { SimulationConfig, Persona } from '@/lib/api/types';

// Define types for steps and templates
interface Step {
  id: string;
  label: string;
  icon: typeof Target;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: typeof Zap;
  color: string;
  defaultConfig: {
    product_name: string;
    product_description: string;
    target_market: string;
    pricing_model: 'freemium' | 'subscription' | 'one-time' | 'usage-based';
    price_point: string;
    key_features: string;
    competitors: string;
  };
}

const steps: Step[] = [
  { id: 'templates', label: 'Choose Template', icon: Target },
  { id: 'persona', label: 'AI Personas', icon: Users },
  { id: 'simulate', label: 'Simulate', icon: Play },
  { id: 'results', label: 'Results', icon: BarChart3 },
];

const templates: Template[] = [
  {
    id: 'saas_launch',
    name: 'SaaS Feature Launch',
    description: 'Launch a new feature for your existing SaaS product',
    icon: Zap,
    color: 'from-primary to-accent',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'SMBs and enterprise teams',
      pricing_model: 'subscription' as const,
      price_point: '$49/month',
      key_features: 'AI-powered automation, Team collaboration, Analytics dashboard',
      competitors: 'Zapier, Make, Monday.com',
    },
  },
  {
    id: 'marketplace',
    name: 'Marketplace Launch',
    description: 'Two-sided marketplace for buyers and sellers',
    icon: ShoppingCart,
    color: 'from-gold to-orange-500',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'Local service providers and customers',
      pricing_model: 'usage-based' as const,
      price_point: '10% commission',
      key_features: 'Instant booking, Verified reviews, Secure payments',
      competitors: 'Thumbtack, TaskRabbit, Yelp',
    },
  },
  {
    id: 'b2b_platform',
    name: 'B2B Platform',
    description: 'Enterprise workflow and collaboration tool',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'Mid to large enterprises',
      pricing_model: 'subscription' as const,
      price_point: '$299/month',
      key_features: 'SSO integration, Audit logs, Custom workflows, API access',
      competitors: 'Salesforce, ServiceNow, Workday',
    },
  },
  {
    id: 'mobile_app',
    name: 'Mobile App Launch',
    description: 'Consumer mobile application',
    icon: Gamepad2,
    color: 'from-cyan-500 to-blue-500',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'Gen Z and millennials',
      pricing_model: 'freemium' as const,
      price_point: '$9.99/month premium',
      key_features: 'Social features, Push notifications, Offline mode',
      competitors: 'Instagram, TikTok, Snapchat',
    },
  },
  {
    id: 'healthcare',
    name: 'Healthcare Platform',
    description: 'Telehealth or health tech solution',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'Patients and healthcare providers',
      pricing_model: 'subscription' as const,
      price_point: '$199/month per provider',
      key_features: 'HIPAA compliant, Video consultations, EHR integration',
      competitors: 'Teladoc, Amwell, MDLive',
    },
  },
  {
    id: 'edtech',
    name: 'EdTech Product',
    description: 'Educational technology platform',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-500',
    defaultConfig: {
      product_name: '',
      product_description: '',
      target_market: 'Students and lifelong learners',
      pricing_model: 'freemium' as const,
      price_point: '$29/month pro',
      key_features: 'Interactive lessons, Progress tracking, Certificates',
      competitors: 'Coursera, Udemy, Khan Academy',
    },
  },
];

export default function SimulatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSimulationConfig({
        ...template.defaultConfig,
        product_name: '',
        product_description: '',
      });
    }
  };

  const handleConfigUpdate = (field: string, value: string) => {
    setSimulationConfig((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handlePersonasComplete = (selectedPersonas: Persona[]) => {
    setPersonas(selectedPersonas);
    setCurrentStep(2);
  };

  const handleSimulationStart = async () => {
    if (!simulationConfig) return;

    try {
      const sim = await simulationsApi.create({
        ...simulationConfig,
        personas: personas.map((p) => p.id),
      });
      setSimulationId(sim.id);
    } catch (error) {
      console.error('Failed to start simulation:', error);
    }
  };

  const handleSimulationComplete = (results: any) => {
    setSimulationResults(results);
    setCurrentStep(3);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0 && selectedTemplate) {
        setCurrentStep(1);
      } else if (currentStep === 2) {
        handleSimulationStart();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedTemplate !== null && simulationConfig?.product_name && simulationConfig?.product_description;
      case 1:
        return personas.length > 0;
      case 2:
        return simulationId !== null;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TemplateStep
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateSelect}
            config={simulationConfig}
            onConfigUpdate={handleConfigUpdate}
          />
        );
      case 1:
        return (
          <PersonaBuilder
            onComplete={handlePersonasComplete}
            onBack={() => setCurrentStep(0)}
            initialPersonas={personas}
          />
        );
      case 2:
        return (
          <SimulationRunning
            simulationId={simulationId!}
            onComplete={handleSimulationComplete}
          />
        );
      case 3:
        return (
          <SimulationResults
            results={simulationResults}
            config={simulationConfig}
            personas={personas}
            onNewSimulation={() => {
              setCurrentStep(0);
              setSelectedTemplate(null);
              setSimulationConfig(null);
              setPersonas([]);
              setSimulationId(null);
              setSimulationResults(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-muted mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary-light" />
            <span className="text-sm text-gray-300">New Simulation</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gradient mb-2"
          >
            Simulate Your Product Launch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Test your product idea with 10,000+ AI agents before going live
          </motion.p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep !== 1 && currentStep !== 3 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-gold flex items-center gap-2"
            >
              {currentStep === steps.length - 2 ? 'Run Simulation' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'glass-elevated border border-primary/30'
                    : isCompleted
                    ? 'glass-muted'
                    : 'opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-surface-muted text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">Step {index + 1}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 transition-colors ${
                    isCompleted ? 'bg-gradient-to-r from-accent to-primary' : 'bg-surface-muted'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function TemplateStep({
  templates,
  selectedTemplate,
  onSelect,
  config,
  onConfigUpdate,
}: {
  templates: Template[];
  selectedTemplate: string | null;
  onSelect: (id: string) => void;
  config: SimulationConfig | null;
  onConfigUpdate: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Template Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Choose a Template
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <motion.button
                key={template.id}
                onClick={() => onSelect(template.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-2xl text-left transition-all duration-300 ${
                  isSelected
                    ? 'glass-elevated border-2 border-primary shadow-glow'
                    : 'glass hover:border-border-hover'
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${template.color} opacity-0 transition-opacity ${
                    isSelected ? 'opacity-10' : ''
                  }`}
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Configuration Form */}
      {selectedTemplate && config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-elevated rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Product Configuration
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Product Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={config.product_name}
                onChange={(e) => onConfigUpdate('product_name', e.target.value)}
                placeholder="e.g., TaskFlow Pro"
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Target Market</label>
              <input
                type="text"
                value={config.target_market}
                onChange={(e) => onConfigUpdate('target_market', e.target.value)}
                placeholder="e.g., SMBs and enterprise teams"
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Product Description <span className="text-danger">*</span>
              </label>
              <textarea
                value={config.product_description}
                onChange={(e) => onConfigUpdate('product_description', e.target.value)}
                placeholder="Describe what your product does and the problem it solves..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Pricing Model</label>
              <select
                value={config.pricing_model}
                onChange={(e) => onConfigUpdate('pricing_model', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="freemium">Freemium</option>
                <option value="subscription">Subscription</option>
                <option value="one-time">One-time Purchase</option>
                <option value="usage-based">Usage-based</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Price Point</label>
              <input
                type="text"
                value={config.price_point}
                onChange={(e) => onConfigUpdate('price_point', e.target.value)}
                placeholder="e.g., $49/month"
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-300">Key Features</label>
              <textarea
                value={config.key_features}
                onChange={(e) => onConfigUpdate('key_features', e.target.value)}
                placeholder="List your key features..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-300">Competitors</label>
              <input
                type="text"
                value={config.competitors}
                onChange={(e) => onConfigUpdate('competitors', e.target.value)}
                placeholder="e.g., Asana, Monday.com, Notion"
                className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
