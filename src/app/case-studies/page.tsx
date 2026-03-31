"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Target,
  Zap,
  BookOpen,
  Brain,
  Building2,
  Award,
  Lightbulb,
  ChevronRight,
  Clock,
  ExternalLink,
  X
} from "lucide-react";
import GlobalNav from "@/components/GlobalNav";
import { caseStudies, getCaseStudiesByCategory, getCaseStudiesByIndustry, searchCaseStudies } from "@/data/case-studies";

const CATEGORIES = ['All', 'Growth', 'Strategy', 'Feature Launch', 'Teardown', 'Problem Solving', 'AI/ML', 'Marketplace', 'Fintech'] as const;
type Category = typeof CATEGORIES[number];

const INDUSTRIES = ['All', 'SaaS', 'Fintech', 'HealthTech', 'E-commerce', 'Social Media', 'AI/ML', 'Marketplace', 'B2B SaaS', 'Consumer', 'Enterprise', 'Wearables', 'Email', 'Payments', 'Travel', 'Marketplace / Transportation', 'EdTech', 'HR Tech', 'Gaming'];

export default function CaseStudiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<typeof caseStudies[0] | null>(null);

  const filteredCaseStudies = useMemo(() => {
    let results = caseStudies;

    if (selectedCategory !== 'All') {
      results = getCaseStudiesByCategory(selectedCategory);
    }

    if (selectedIndustry !== 'All') {
      results = getCaseStudiesByIndustry(selectedIndustry);
    }

    if (searchQuery.trim()) {
      results = searchCaseStudies(searchQuery);
    }

    return results;
  }, [searchQuery, selectedCategory, selectedIndustry]);

  const stats = useMemo(() => ({
    total: caseStudies.length,
    categories: new Set(caseStudies.map(cs => cs.category)).size,
    industries: new Set(caseStudies.map(cs => cs.industry)).size,
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">PM Case Studies Library</h1>
              <p className="text-sm text-gray-500">Learn from real-world product management wins and failures</p>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">{stats.total}</div>
              <div className="text-sm text-gray-500 mt-1">Case Studies</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">{stats.categories}</div>
              <div className="text-sm text-gray-500 mt-1">Categories</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-black">{stats.industries}</div>
              <div className="text-sm text-gray-500 mt-1">Industries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-6 px-6 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies by title, company, or problem..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category)}
                className="appearance-none pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="appearance-none pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all cursor-pointer"
              >
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'All' || selectedIndustry !== 'All' || searchQuery) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedIndustry !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {selectedIndustry}
                  <button onClick={() => setSelectedIndustry('All')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory('All');
                  setSelectedIndustry('All');
                }}
                className="text-sm text-gray-500 hover:text-black underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          {filteredCaseStudies.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No case studies found for your filters</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory('All');
                  setSelectedIndustry('All');
                }}
                className="mt-4 text-black font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaseStudies.map((caseStudy) => (
                <CaseStudyCard
                  key={caseStudy.id}
                  caseStudy={caseStudy}
                  onClick={() => setSelectedCaseStudy(caseStudy)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Study Detail Modal */}
      {selectedCaseStudy && (
        <CaseStudyModal
          caseStudy={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 mt-12">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>Case studies compiled from PM portfolios, LinkedIn posts, Medium articles, and company publications</p>
          <p className="mt-2">Each case study includes source attribution and original author credits</p>
        </div>
      </footer>
    </div>
  );
}

interface CaseStudyCardProps {
  caseStudy: typeof caseStudies[0];
  onClick: () => void;
}

function CaseStudyCard({ caseStudy, onClick }: CaseStudyCardProps) {
  const categoryIcon = {
    'Growth': <TrendingUp className="w-4 h-4" />,
    'Strategy': <Target className="w-4 h-4" />,
    'Feature Launch': <Zap className="w-4 h-4" />,
    'Teardown': <BookOpen className="w-4 h-4" />,
    'Problem Solving': <Brain className="w-4 h-4" />,
    'AI/ML': <Lightbulb className="w-4 h-4" />,
    'Marketplace': <Users className="w-4 h-4" />,
    'Fintech': <Award className="w-4 h-4" />,
  };

  const categoryColor = {
    'Growth': 'bg-green-500',
    'Strategy': 'bg-blue-500',
    'Feature Launch': 'bg-purple-500',
    'Teardown': 'bg-orange-500',
    'Problem Solving': 'bg-red-500',
    'AI/ML': 'bg-cyan-500',
    'Marketplace': 'bg-pink-500',
    'Fintech': 'bg-emerald-500',
  };

  return (
    <button
      onClick={onClick}
      className="group block text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 ${categoryColor[caseStudy.category]} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
          {categoryIcon[caseStudy.category]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-lg group-hover:text-gray-700 transition-colors line-clamp-2">
            {caseStudy.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            by {caseStudy.author}
          </p>
        </div>
      </div>

      {/* Company & Role */}
      {caseStudy.company && (
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
          <Building2 className="w-3 h-3" />
          <span>{caseStudy.company}</span>
          <span>•</span>
          <span>{caseStudy.authorRole}</span>
        </div>
      )}

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {caseStudy.summary}
      </p>

      {/* Key Metrics */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Key Results</div>
        <div className="flex flex-wrap gap-1.5">
          {caseStudy.results.slice(0, 2).map((result, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded line-clamp-1"
            >
              {result}
            </span>
          ))}
          {caseStudy.results.length > 2 && (
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">
              +{caseStudy.results.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {caseStudy.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {caseStudy.frameworks.slice(0, 2).join(', ')}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
      </div>
    </button>
  );
}

interface CaseStudyModalProps {
  caseStudy: typeof caseStudies[0];
  onClose: () => void;
}

function CaseStudyModal({ caseStudy, onClose }: CaseStudyModalProps) {
  const categoryIcon = {
    'Growth': <TrendingUp className="w-5 h-5" />,
    'Strategy': <Target className="w-5 h-5" />,
    'Feature Launch': <Zap className="w-5 h-5" />,
    'Teardown': <BookOpen className="w-5 h-5" />,
    'Problem Solving': <Brain className="w-5 h-5" />,
    'AI/ML': <Lightbulb className="w-5 h-5" />,
    'Marketplace': <Users className="w-5 h-5" />,
    'Fintech': <Award className="w-5 h-5" />,
  };

  const categoryColor = {
    'Growth': 'bg-green-500',
    'Strategy': 'bg-blue-500',
    'Feature Launch': 'bg-purple-500',
    'Teardown': 'bg-orange-500',
    'Problem Solving': 'bg-red-500',
    'AI/ML': 'bg-cyan-500',
    'Marketplace': 'bg-pink-500',
    'Fintech': 'bg-emerald-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start gap-4">
          <div className={`w-12 h-12 ${categoryColor[caseStudy.category]} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
            {categoryIcon[caseStudy.category]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-serif font-bold">{caseStudy.title}</h2>
            <p className="text-gray-500 mt-1">
              by {caseStudy.author} {caseStudy.company && `@ ${caseStudy.company}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {caseStudy.readTime} min read
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BookOpen className="w-4 h-4" />
              {caseStudy.industry}
            </div>
            {caseStudy.sourceUrl && (
              <a
                href={caseStudy.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Original Source
              </a>
            )}
          </div>

          {/* Problem */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" />
              Problem
            </h3>
            <p className="text-gray-700">{caseStudy.problem}</p>
          </section>

          {/* Approach */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              Approach
            </h3>
            <p className="text-gray-700">{caseStudy.approach}</p>
          </section>

          {/* Solution */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-500" />
              Solution
            </h3>
            <p className="text-gray-700">{caseStudy.solution}</p>
          </section>

          {/* Results */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Results
            </h3>
            <ul className="space-y-2">
              {caseStudy.results.map((result, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{result}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Frameworks */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Frameworks Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.frameworks.map((framework, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium"
                >
                  {framework}
                </span>
              ))}
            </div>
          </section>

          {/* Metrics */}
          <section className="mb-6">
            <h3 className="font-serif font-semibold text-lg mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              Key Metrics
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.metrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium"
                >
                  {metric}
                </span>
              ))}
            </div>
          </section>

          {/* Key Learnings */}
          <section>
            <h3 className="font-serif font-semibold text-lg mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Key Learnings
            </h3>
            <ul className="space-y-2">
              {caseStudy.keyLearnings.map((learning, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{learning}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
