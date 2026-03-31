"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp, Clock, User, Tag, Eye } from "lucide-react";

// Sample case studies data (will be replaced with database)
const sampleCaseStudies = [
  {
    id: "1",
    title: "How We Reduced Churn by 40% with Proactive Onboarding",
    author: "Sarah Chen",
    company: "TechFlow (SaaS)",
    industry: "saas",
    scenario: "Feature Launch",
    summary: "Implemented in-app guidance and milestone tracking to improve activation",
    outcome: "40% churn reduction, 25% faster TTV",
    readTime: 8,
    upvotes: 342,
    views: 12400,
    tags: ["onboarding", "activation", "saas", "b2b"],
    publishedAt: "2025-03-15",
  },
  {
    id: "2",
    title: "Navigating HIPAA Compliance While Building AI Features",
    author: "Michael Rodriguez",
    company: "HealthAI",
    industry: "health",
    scenario: "Product Strategy",
    summary: "Balancing innovation with strict healthcare regulations",
    outcome: "FDA clearance achieved, 6-month faster launch",
    readTime: 12,
    upvotes: 289,
    views: 8900,
    tags: ["hipaa", "ai", "compliance", "healthcare"],
    publishedAt: "2025-03-10",
  },
  {
    id: "3",
    title: "From 2% to 8%: Conversion Rate Optimization Journey",
    author: "Emma Thompson",
    company: "StyleCart",
    industry: "ecommerce",
    scenario: "Feature Launch",
    summary: "Systematic CRO approach using A/B testing and user research",
    outcome: "4x conversion improvement, $2M additional revenue",
    readTime: 10,
    upvotes: 456,
    views: 18200,
    tags: ["cro", "ecommerce", "ab-testing", "conversion"],
    publishedAt: "2025-03-08",
  },
  {
    id: "4",
    title: "Building Trust in AI: Our Explainability Framework",
    author: "David Park",
    company: "FinanceAI",
    industry: "fintech",
    scenario: "Product Strategy",
    summary: "Making ML models interpretable for regulated financial decisions",
    outcome: "Regulatory approval, 90% user trust score",
    readTime: 15,
    upvotes: 198,
    views: 6700,
    tags: ["ai", "explainability", "fintech", "trust"],
    publishedAt: "2025-03-01",
  },
  {
    id: "5",
    title: "Pricing Pivot: How We 3x'd ARR Without Losing Customers",
    author: "Lisa Wang",
    company: "DataMetrics",
    industry: "saas",
    scenario: "Pricing Change",
    summary: "Strategic pricing overhaul with careful customer communication",
    outcome: "3x ARR, 95% retention, improved NPS",
    readTime: 11,
    upvotes: 521,
    views: 22100,
    tags: ["pricing", "saas", "revenue", "strategy"],
    publishedAt: "2025-02-28",
  },
  {
    id: "6",
    title: "LLM Hallucination Problem: Our 3-Layer Solution",
    author: "James Liu",
    company: "ContentGen",
    industry: "ai_ml",
    scenario: "Feature Launch",
    summary: "Combining RAG, fact-checking, and user feedback loops",
    outcome: "92% accuracy, enterprise-ready",
    readTime: 9,
    upvotes: 387,
    views: 15600,
    tags: ["llm", "ai", "accuracy", "enterprise"],
    publishedAt: "2025-02-20",
  },
];

const industries = [
  { id: "all", name: "All Industries", color: "bg-slate-500" },
  { id: "saas", name: "SaaS", color: "bg-blue-500" },
  { id: "fintech", name: "FinTech", color: "bg-green-500" },
  { id: "health", name: "Health", color: "bg-red-500" },
  { id: "ecommerce", name: "E-commerce", color: "bg-amber-500" },
  { id: "ai_ml", name: "AI/ML", color: "bg-purple-500" },
];

const scenarios = [
  "All Scenarios",
  "Feature Launch",
  "Product Strategy",
  "Pricing Change",
  "Go-to-Market",
  "User Research",
  "Roadmap Planning",
];

export default function CaseStudiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedScenario, setSelectedScenario] = useState("All Scenarios");
  const [sortBy, setSortBy] = useState("recent");

  const filteredCaseStudies = sampleCaseStudies.filter((cs) => {
    const matchesSearch =
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = selectedIndustry === "all" || cs.industry === selectedIndustry;
    const matchesScenario = selectedScenario === "All Scenarios" || cs.scenario === selectedScenario;
    return matchesSearch && matchesIndustry && matchesScenario;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">PM Simulator</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/simulator" className="text-sm text-slate-600 hover:text-slate-900">
                Simulator
              </a>
              <a href="/case-studies" className="text-sm text-slate-900 font-medium">
                Case Studies
              </a>
              <a href="/forum" className="text-sm text-slate-600 hover:text-slate-900">
                Forum
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Learn from Real PM Case Studies
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Read detailed accounts of product decisions, challenges, and outcomes from PMs across
            industries. Learn what worked, what didn't, and why.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search case studies, tags, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>

            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="viewed">Most Viewed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaseStudies.map((cs) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </div>

        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No case studies found matching your filters.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto text-center text-sm text-slate-500">
          <p>Share your own case study after completing a simulation.</p>
        </div>
      </footer>
    </div>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: any }) {
  const industryColor =
    industries.find((i) => i.id === caseStudy.industry)?.color || "bg-slate-500";

  return (
    <article className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden">
      <div className={`h-2 ${industryColor}`} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium text-white ${industryColor}`}
          >
            {caseStudy.industry}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {caseStudy.scenario}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{caseStudy.title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{caseStudy.summary}</p>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {caseStudy.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {caseStudy.readTime} min
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {caseStudy.tags.slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {caseStudy.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {(caseStudy.views / 1000).toFixed(1)}k
            </span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Read More →
          </button>
        </div>
      </div>
    </article>
  );
}
