"use client";

import Link from "next/link";
import { ArrowRight, FileText, Lightbulb, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-lg">PM Simulator</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/simulator" className="text-sm text-gray-600 hover:text-black">
              Simulator
            </Link>
            <Link href="/case-studies" className="text-sm text-gray-600 hover:text-black">
              Case Studies
            </Link>
            <Link href="/forum" className="text-sm text-gray-600 hover:text-black">
              Forum
            </Link>
            <Link
              href="/simulator"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
            <Zap className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">v2.0 Now Live</span>
          </div>

          <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight">
            Master Product Management<br />
            <span className="text-gray-400">Through Simulation</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Practice real PM scenarios with industry-specific templates, embedded learning guides,
            and AI-powered feedback.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
            >
              Start Simulating
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-medium rounded-lg border border-gray-200 hover:border-gray-300"
            >
              Browse Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Everything You Need to Practice PM
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Comprehensive Templates"
              description="24-section PRD templates with every detail covered."
            />
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8" />}
              title="Embedded Learning"
              description="Mini-guides from 30+ years of PM experience."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Community"
              description="Share work, learn from real projects, get answers."
            />
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Industry-Specific Guidance
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <IndustryCard letter="S" name="SaaS" metrics="MRR · LTV:CAC" />
            <IndustryCard letter="F" name="FinTech" metrics="TPV · Fraud" />
            <IndustryCard letter="H" name="Health" metrics="HIPAA · FDA" />
            <IndustryCard letter="E" name="E-commerce" metrics="AOV · CLV" />
            <IndustryCard letter="A" name="AI/ML" metrics="Accuracy · Drift" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Built for product managers, by product managers.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-xl">
      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function IndustryCard({ letter, name, metrics }: { letter: string; name: string; metrics: string }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl text-center">
      <div className="w-14 h-14 bg-black rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
        {letter}
      </div>
      <h3 className="font-serif font-semibold mb-2">{name}</h3>
      <p className="text-xs text-gray-500">{metrics}</p>
    </div>
  );
}
