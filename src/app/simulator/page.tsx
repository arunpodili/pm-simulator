"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { industries } from "@/data/industries";
import { scenarios } from "@/data/scenarios";
import { prdSaaSTemplate } from "@/data/templates/prd-saas";
import { prdFinTechTemplate } from "@/data/templates/prd-fintech";
import { prdHealthTemplate } from "@/data/templates/prd-health";
import { prdEcommerceTemplate } from "@/data/templates/prd-ecommerce";
import { prdAITemplate } from "@/data/templates/prd-ai";
import { criticalThinkingTemplate } from "@/data/templates/framework-critical-thinking";
import { stakeholderManagementTemplate } from "@/data/templates/framework-stakeholder-management";
import { coreCompetenciesTemplate } from "@/data/templates/framework-core-competencies";
import { domainVerticalsTemplate } from "@/data/templates/framework-domain-verticals";
import { IndustryId, ScenarioId, Template, TemplateCategory } from "@/types";
import { ChevronRight, Lightbulb, Brain, Target, Zap, Award, Cpu } from "lucide-react";
import Link from "next/link";
import TemplateWorkspace from "@/components/TemplateWorkspace";
import GlobalNav from "@/components/GlobalNav";

const industryTemplates: Record<string, Template> = {
  'saas': prdSaaSTemplate,
  'fintech': prdFinTechTemplate,
  'health': prdHealthTemplate,
  'ecommerce': prdEcommerceTemplate,
  'ai_ml': prdAITemplate,
};

const frameworkTemplates: Template[] = [
  criticalThinkingTemplate,
  stakeholderManagementTemplate,
  coreCompetenciesTemplate,
  domainVerticalsTemplate,
];

export default function SimulatorPage() {
  const router = useRouter();
  const { isOnboarded } = useUser();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [templateType, setTemplateType] = useState<TemplateCategory | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<Template | null>(null);

  // Redirect to onboarding if not completed
  if (!isOnboarded) {
    router.push('/onboarding');
    return null;
  }

  // Get template based on industry or framework
  const getTemplate = () => {
    if (selectedFramework) return selectedFramework;
    if (!selectedIndustry) return null;
    return industryTemplates[selectedIndustry] || prdSaaSTemplate;
  };

  if (step === 4) {
    const template = getTemplate();
    if (!template) return null;
    return (
      <TemplateWorkspace
        template={template}
        onBack={() => setStep(1)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <GlobalNav />

      <div className="container mx-auto px-6 py-12">
        {/* Step 1: Template Type Selection */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">PM Simulator</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Practice real-world product management scenarios with industry-specific templates and decision frameworks.
                Build your skills through hands-on simulation.
              </p>
            </div>

            {/* Key Differences Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Simulator vs Mastery Lab</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Simulator:</strong> Practice real PM work with industry PRDs and scenarios (feature launches, strategy docs).
                    <br />
                    <strong>Mastery Lab:</strong> Learn PM fundamentals through guided exercises and skill-building templates.
                  </p>
                </div>
              </div>
            </div>

            {/* User Simulation Banner */}
            <Link
              href="/simulator/user-simulation"
              className="block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">User Simulation Playground 🚀</h3>
                    <p className="text-indigo-100">
                      Test your product with 1,000+ simulated users before launch. Powered by MiroFish multi-agent technology.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  Try it now
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* PRD Templates Section */}
            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Industry PRD Templates
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => {
                    setSelectedIndustry(industry.id);
                    setTemplateType('prd');
                    setStep(2);
                  }}
                  className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: industry.color }}
                    >
                      {industry.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-lg">{industry.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{industry.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Key Metrics</div>
                    <div className="flex flex-wrap gap-1.5">
                      {industry.keyMetrics.slice(0, 3).map((metric) => (
                        <span
                          key={metric}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded group-hover:bg-gray-200 transition-colors"
                        >
                          {metric.length > 25 ? metric.substring(0, 25) + "..." : metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Framework Templates Section */}
            <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Decision Frameworks
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {frameworkTemplates.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => {
                    setSelectedFramework(framework);
                    setTemplateType('framework');
                    setStep(3);
                  }}
                  className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-lg">{framework.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{framework.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {framework.estimatedCompletionTime}
                    </span>
                    <span>•</span>
                    <span className="truncate">{framework.frameworkIds.join(', ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Scenario (only for PRD templates) */}
        {step === 2 && selectedIndustry && templateType === 'prd' && (
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to industries
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold mb-2">Select Scenario</h2>
              <p className="text-gray-600">What are you working on today?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {scenarios
                .filter((s) => s.applicableIndustries.includes(selectedIndustry))
                .map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario.id);
                      setStep(3);
                    }}
                    className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif font-semibold text-xl">{scenario.name}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-4">{scenario.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {scenario.estimatedTime}
                      </span>
                      <span>•</span>
                      <span>{scenario.outputTypes.slice(0, 2).join(', ')}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Step 2: Framework Selected - Go directly to confirmation */}
        {step === 2 && selectedFramework && (
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 mx-auto"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to template types
            </button>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Ready to Begin?</h2>
              <p className="text-gray-600 mb-6">
                You&apos;re about to start the <strong>{selectedFramework.name}</strong> framework.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">{selectedFramework.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {selectedFramework.estimatedCompletionTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Open Framework
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Start (for PRD templates after scenario selection) */}
        {step === 3 && selectedScenario && templateType === 'prd' && (
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 mx-auto"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to scenarios
            </button>

            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Ready to Begin?</h2>
              <p className="text-gray-600 mb-6">
                You&apos;re about to start the <strong>{scenarios.find(s => s.id === selectedScenario)?.name}</strong> template.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">{scenarios.find(s => s.id === selectedScenario)?.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {scenarios.find(s => s.id === selectedScenario)?.estimatedTime}
                  </span>
                  <span>•</span>
                  <span>{scenarios.find(s => s.id === selectedScenario)?.outputTypes.join(', ')}</span>
                </div>
              </div>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Open Template
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
