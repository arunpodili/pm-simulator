'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card3D } from '@/components/3d/Scene3D';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  User,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  BarChart3,
  Rocket,
  Layers,
  CheckCircle,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Business Sector Templates
const businessTemplates = [
  {
    id: 'saas-feature-launch',
    category: 'SaaS',
    title: 'Feature Launch Strategy',
    description: 'Comprehensive template for launching new features in SaaS products',
    icon: <Rocket className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-500',
    tags: ['MRR Impact', 'User Adoption', 'Churn Analysis'],
    difficulty: 'Intermediate',
    time: '30 min',
  },
  {
    id: 'saas-pricing-optimization',
    category: 'SaaS',
    title: 'Pricing Strategy Simulator',
    description: 'Test different pricing models and their impact on revenue',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'from-blue-600 to-blue-400',
    tags: ['LTV:CAC', 'Price Elasticity', 'Tier Analysis'],
    difficulty: 'Advanced',
    time: '45 min',
  },
  {
    id: 'fintech-compliance',
    category: 'FinTech',
    title: 'Compliance Product Launch',
    description: 'Navigate regulatory requirements while launching fintech products',
    icon: <CheckCircle className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500',
    tags: ['PCI-DSS', 'KYC/AML', 'Risk Assessment'],
    difficulty: 'Advanced',
    time: '60 min',
  },
  {
    id: 'fintech-trading-platform',
    category: 'FinTech',
    title: 'Trading Platform Strategy',
    description: 'Simulate user acquisition for trading and investment platforms',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'from-green-600 to-green-400',
    tags: ['User Acquisition', 'Trading Volume', 'Retention'],
    difficulty: 'Intermediate',
    time: '40 min',
  },
  {
    id: 'health-patient-platform',
    category: 'Health',
    title: 'Patient Engagement Platform',
    description: 'Design patient-centric healthcare products with HIPAA compliance',
    icon: <Users className="h-6 w-6" />,
    color: 'from-red-500 to-rose-500',
    tags: ['HIPAA', 'Patient Outcomes', 'EHR Integration'],
    difficulty: 'Advanced',
    time: '50 min',
  },
  {
    id: 'health-telemedicine',
    category: 'Health',
    title: 'Telemedicine Go-to-Market',
    description: 'Launch virtual care solutions with provider adoption focus',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'from-red-600 to-red-400',
    tags: ['Provider Adoption', 'Patient Acquisition', 'Reimbursement'],
    difficulty: 'Intermediate',
    time: '45 min',
  },
  {
    id: 'ecommerce-marketplace',
    category: 'E-commerce',
    title: 'Marketplace Growth Strategy',
    description: 'Balance supply and demand in two-sided marketplaces',
    icon: <Layers className="h-6 w-6" />,
    color: 'from-orange-500 to-amber-500',
    tags: ['GMV Growth', 'Seller Acquisition', 'Buyer Retention'],
    difficulty: 'Intermediate',
    time: '35 min',
  },
  {
    id: 'ecommerce-d2c-brand',
    category: 'E-commerce',
    title: 'D2C Brand Launch',
    description: 'Launch direct-to-consumer brands with viral marketing',
    icon: <Target className="h-6 w-6" />,
    color: 'from-orange-600 to-orange-400',
    tags: ['CAC Optimization', 'AOV Growth', 'Brand Awareness'],
    difficulty: 'Beginner',
    time: '30 min',
  },
  {
    id: 'aiml-model-product',
    category: 'AI/ML',
    title: 'ML-Powered Feature Strategy',
    description: 'Integrate machine learning into existing products',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-500',
    tags: ['Model Accuracy', 'User Trust', 'Latency'],
    difficulty: 'Advanced',
    time: '55 min',
  },
  {
    id: 'aiml-ai-platform',
    category: 'AI/ML',
    title: 'AI Platform Market Entry',
    description: 'Launch AI-as-a-Service platforms with enterprise focus',
    icon: <Rocket className="h-6 w-6" />,
    color: 'from-purple-600 to-purple-400',
    tags: ['API Adoption', 'Usage-Based Pricing', 'Enterprise Sales'],
    difficulty: 'Advanced',
    time: '60 min',
  },
];

// Personal Development Templates
const personalTemplates = [
  {
    id: 'personal-productivity',
    category: 'Personal Development',
    title: 'Productivity App Launch',
    description: 'Build and launch personal productivity tools',
    icon: <Target className="h-6 w-6" />,
    color: 'from-pink-500 to-rose-500',
    tags: ['Habit Formation', 'Daily Active Users', 'Retention'],
    difficulty: 'Beginner',
    time: '25 min',
  },
  {
    id: 'personal-fitness',
    category: 'Personal Development',
    title: 'Fitness App Strategy',
    description: 'Launch fitness and wellness applications',
    icon: <Users className="h-6 w-6" />,
    color: 'from-pink-600 to-pink-400',
    tags: ['Engagement', 'Subscription Conversion', 'Social Features'],
    difficulty: 'Beginner',
    time: '30 min',
  },
  {
    id: 'personal-learning',
    category: 'Personal Development',
    title: 'EdTech Course Platform',
    description: 'Create and monetize online learning experiences',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'from-indigo-500 to-blue-500',
    tags: ['Course Completion', 'Revenue Per User', 'Community'],
    difficulty: 'Intermediate',
    time: '35 min',
  },
  {
    id: 'personal-finance',
    category: 'Personal Development',
    title: 'Personal Finance App',
    description: 'Help users manage budgets and investments',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'from-indigo-600 to-indigo-400',
    tags: ['Bank Integration', 'Savings Goals', 'Premium Conversion'],
    difficulty: 'Intermediate',
    time: '40 min',
  },
];

const categories = ['All', 'SaaS', 'FinTech', 'Health', 'E-commerce', 'AI/ML', 'Personal Development'];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'business' | 'personal'>('business');

  const templates = activeTab === 'business' ? businessTemplates : personalTemplates;

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-white/20">
              50+ Templates Available
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Simulation Templates
            </h1>
            <p className="text-gray-400 text-lg">
              Pre-built scenarios for every industry. Start with a template, customize to your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs & Search */}
      <section className="py-8 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Tabs */}
            <div className="flex bg-gray-900 rounded-lg p-1">
              {(['business', 'personal'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'business' ? (
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Business
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <<div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card3D>
                    <Link href={`/simulate?template=${template.id}`}>
                      <Card className="bg-gray-900/50 border-gray-800 h-full group hover:border-gray-700 transition-all cursor-pointer overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${template.color}`} />
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                              <div className="text-white">{template.icon}</div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {template.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2 group-hover:text-gray-300 transition-colors">
                            {template.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 line-clamp-2">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {template.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>⏱️ {template.time}</span>
                            <span className="flex items-center text-white group-hover:translate-x-1 transition-transform">
                              Use Template
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </Card3D>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No templates found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Template?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Request a custom template for your specific industry or use case.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Request Template
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
