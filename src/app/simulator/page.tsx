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
import { ChevronRight, Lightbulb } from "lucide-react";
import TemplateWorkspace from "@/components/TemplateWorkspace";

const industryTemplates: Record<string, Template> = {
  'saas': prdSaaSTemplate,
  'fintech': prdFinTechTemplate,
  'health': prdHealthTemplate,
  'ecommerce': prdEcommerceTemplate,
  'ai-ml': prdAITemplate,
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-lg">PM Simulator</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm text-gray-600 hover:text-black">Home</a>
            <a href="/case-studies" className="text-sm text-gray-600 hover:text-black">Case Studies</a>
            <a href="/forum" className="text-sm text-gray-600 hover:text-black">Forum</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Step 1: Template Type Selection */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-serif font-bold mb-4">Choose Template Type</h1>
            <p className="text-lg text-gray-600 mb-12">
              Select a PRD template for your industry or a decision framework for skill-building.
            </p>

            {/* PRD Templates Section */}
            <h2 className="text-2xl font-serif font-semibold mb-6">Industry PRD Templates</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => {
                    setSelectedIndustry(industry.id);
                    setTemplateType('prd');
                    setStep(2);
                  }}
                  className="p-8 bg-white border border-gray-200 rounded-xl hover:border-black transition-all text-left"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: industry.color }}
                  >
                    {industry.name[0]}
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{industry.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{industry.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {industry.keyMetrics.slice(0, 3).map((metric) => (
                      <span
                        key={metric}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {metric.length > 25 ? metric.substring(0, 25) + "..." : metric}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Framework Templates Section */}
            <h2 className="text-2xl font-serif font-semibold mb-6">Decision Frameworks</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {frameworkTemplates.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => {
                    setSelectedFramework(framework);
                    setTemplateType('framework');
                    setStep(3);
                  }}
                  className="p-8 bg-white border border-gray-200 rounded-xl hover:border-black transition-all text-left"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-lg mb-1">{framework.name}</h3>
                      <p className="text-sm text-gray-600">{framework.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱ {framework.estimatedCompletionTime}</span>
                    <span>•</span>
                    <span>{framework.frameworkIds.join(', ')}</span>
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
              className="text-sm text-gray-600 hover:text-black mb-6"
            >
              ← Back to template types
            </button>
            <h1 className="text-4xl font-serif font-bold mb-4">
              Select Scenario
            </h1>
            <p className="text-lg text-gray-600 mb-12">
              What are you working on today?
            </p>
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
                    className="p-8 bg-white border border-gray-200 rounded-xl hover:border-black transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-serif font-semibold text-xl">{scenario.name}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">{scenario.description}</p>
                    <div className="text-sm text-gray-500">
                      ⏱ {scenario.estimatedTime}
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
              className="text-sm text-gray-600 hover:text-black mb-6"
            >
              ← Back to template types
            </button>
            <h1 className="text-4xl font-serif font-bold mb-4">Ready to Begin?</h1>
            <p className="text-lg text-gray-600 mb-12">
              You&apos;re about to start the <strong>{selectedFramework.name}</strong> framework.
            </p>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Open Framework
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 3: Start (for PRD templates after scenario selection) */}
        {step === 3 && selectedScenario && templateType === 'prd' && (
          <div className="max-w-2xl mx-auto text-center">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-gray-600 hover:text-black mb-6"
            >
              ← Back to scenarios
            </button>
            <h1 className="text-4xl font-serif font-bold mb-4">Ready to Begin?</h1>
            <p className="text-lg text-gray-600 mb-12">
              You&apos;re about to start the <strong>{scenarios.find(s => s.id === selectedScenario)?.name}</strong> template.
            </p>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Open Template
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
