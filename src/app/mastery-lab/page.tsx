"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Brain,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Award,
  FileText,
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  Circle
} from "lucide-react";
import GlobalNav from "@/components/GlobalNav";

// Import all mastery templates
import { productMindsetTemplate } from "@/data/mastery-lab/section1-product-mindset";
import { creativityInnovationTemplate } from "@/data/mastery-lab/section2-creativity-innovation";
import { criticalThinkingTemplate } from "@/data/mastery-lab/section3-critical-thinking";
import { stakeholderManagementTemplate } from "@/data/mastery-lab/section4-stakeholder-management";
import { coreCompetenciesTemplate } from "@/data/mastery-lab/section5-core-competencies";
import { domainVerticalsTemplate } from "@/data/mastery-lab/section6-domain-verticals";
import { communicationStorytellingTemplate } from "@/data/mastery-lab/section7-communication-storytelling";
import { leadershipGrowthTemplate } from "@/data/mastery-lab/section8-leadership-growth";
import { booksResourcesTemplate } from "@/data/mastery-lab/section9-books-resources";
import { practicalApplicationTemplate } from "@/data/mastery-lab/section10-practical-application";

const MASTERY_SECTIONS = [
  {
    template: productMindsetTemplate,
    icon: <Brain className="w-6 h-6" />,
    color: "bg-blue-500",
    description: "Master outcomes over outputs, customer obsession, systems thinking, and mental models",
  },
  {
    template: creativityInnovationTemplate,
    icon: <Lightbulb className="w-6 h-6" />,
    color: "bg-amber-500",
    description: "Master JTBD, Design Thinking, First Principles, and Analogous Thinking",
  },
  {
    template: criticalThinkingTemplate,
    icon: <Target className="w-6 h-6" />,
    color: "bg-purple-500",
    description: "Master decision frameworks, analytics, and prioritization methodologies",
  },
  {
    template: stakeholderManagementTemplate,
    icon: <Users className="w-6 h-6" />,
    color: "bg-green-500",
    description: "Master stakeholder mapping, influence strategies, saying yes/no, and conflict resolution",
  },
  {
    template: coreCompetenciesTemplate,
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-red-500",
    description: "Master discovery, strategy, execution, and measurement",
  },
  {
    template: domainVerticalsTemplate,
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-indigo-500",
    description: "Master domain-specific PM skills across B2B SaaS, Consumer, Marketplace, Fintech, AI/ML, and Healthcare",
  },
  {
    template: communicationStorytellingTemplate,
    icon: <MessageSquare className="w-6 h-6" />,
    color: "bg-pink-500",
    description: "Master PRDs, one-pagers, roadmaps, release notes, presentations, and demo scripts",
  },
  {
    template: leadershipGrowthTemplate,
    icon: <Award className="w-6 h-6" />,
    color: "bg-teal-500",
    description: "Master hiring PMs, team structures, developing PMs, and career ladders",
  },
  {
    template: booksResourcesTemplate,
    icon: <FileText className="w-6 h-6" />,
    color: "bg-orange-500",
    description: "Curated reading lists, podcasts, newsletters, communities, and courses for PMs",
  },
  {
    template: practicalApplicationTemplate,
    icon: <CheckCircle className="w-6 h-6" />,
    color: "bg-cyan-500",
    description: "Action plans, capstone projects, portfolio building, and career development",
  },
];

export default function MasteryLab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const filteredSections = MASTERY_SECTIONS.filter(
    (section) =>
      section.template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completionPercentage = Math.round(
    (completedSections.size / MASTERY_SECTIONS.length) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      <GlobalNav />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">PM Mastery Lab</h1>
              <p className="text-sm text-gray-500">Master all 10 dimensions of product management excellence</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Your Mastery Journey</h2>
                <p className="text-sm text-gray-500">
                  {completedSections.size} of {MASTERY_SECTIONS.length} sections completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">{completionPercentage}%</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Estimated total time: 8-12 hours for all sections</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mastery sections..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Mastery Sections Grid */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-4">
            {filteredSections.map((section, index) => (
              <MasteryCard
                key={section.template.id}
                section={section}
                index={index}
                isCompleted={completedSections.has(section.template.id)}
                onToggleComplete={() => {
                  setCompletedSections((prev) => {
                    const next = new Set(prev);
                    if (next.has(section.template.id)) {
                      next.delete(section.template.id);
                    } else {
                      next.add(section.template.id);
                    }
                    return next;
                  });
                }}
              />
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No sections found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 mt-12">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>Complete all 10 sections to earn your PM Mastery Certificate</p>
        </div>
      </footer>
    </div>
  );
}

interface MasteryCardProps {
  section: typeof MASTERY_SECTIONS[0];
  index: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

function MasteryCard({ section, index, isCompleted, onToggleComplete }: MasteryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/mastery-lab/${section.template.id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        {/* Section Number */}
        <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {index + 1}
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isHovered ? 'bg-gray-100 text-gray-900' : 'bg-gray-50 text-gray-600'
        } transition-colors`}>
          {section.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-lg group-hover:text-gray-700 transition-colors">
            {section.template.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {section.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {section.template.estimatedCompletionTime}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {section.template.sections.length} sections
            </span>
          </div>
        </div>

        {/* Completion Status */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleComplete();
            }}
            className={`p-2 rounded-full transition-colors ${
              isCompleted
                ? 'text-green-600 hover:text-green-700'
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
