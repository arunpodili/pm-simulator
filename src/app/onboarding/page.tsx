"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Lightbulb, ArrowRight, Building, Mail, User, Briefcase, Users } from "lucide-react";

const industries = [
  { id: 'saas', name: 'SaaS', description: 'Software as a Service' },
  { id: 'fintech', name: 'FinTech', description: 'Financial Technology' },
  { id: 'health', name: 'Health Tech', description: 'Healthcare & Life Sciences' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Online Retail & Marketplaces' },
  { id: 'ai-ml', name: 'AI/ML', description: 'Artificial Intelligence & Machine Learning' },
];

const roles = [
  'Product Manager',
  'Senior Product Manager',
  'Group/Principal PM',
  'VP/Director of Product',
  'Founder/CEO',
  'Product Designer',
  'Engineering Manager',
  'Other',
];

const teamSizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-1000',
  '1000+',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    industry: '',
    teamSize: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    completeOnboarding(formData as any);
    router.push('/simulator');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.company && formData.role;
      case 3:
        return formData.industry && formData.teamSize;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-6 h-14 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-base">PM Simulator</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'w-8 bg-black' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-serif font-bold mb-2">Welcome!</h1>
              <p className="text-gray-500 mb-6">Let's start with your basics.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Work Info */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-serif font-bold mb-2">Work Information</h1>
              <p className="text-gray-500 mb-6">Tell us about where you work.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => updateField('role', role)}
                        className={`px-4 py-3 text-sm text-left rounded-lg border transition-all ${
                          formData.role === role
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Industry & Team */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-serif font-bold mb-2">Last Few Questions</h1>
              <p className="text-gray-500 mb-6">This helps us customize your experience.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Industry
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => updateField('industry', ind.id)}
                        className={`px-4 py-3 text-left rounded-lg border transition-all ${
                          formData.industry === ind.id
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{ind.name}</div>
                        <div className="text-xs opacity-70">{ind.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.teamSize}
                      onChange={(e) => updateField('teamSize', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 appearance-none cursor-pointer"
                    >
                      <option value="">Select team size</option>
                      {teamSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
