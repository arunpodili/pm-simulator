'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
  Brain,
  Activity,
  Target,
  ChevronRight,
} from 'lucide-react';

// Fade in from bottom animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Stagger children animation
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Users,
      title: '10K+ AI Agents',
      desc: 'Simulate realistic user behavior with AI personas that think, decide, and interact like real users',
      color: 'from-primary to-accent',
    },
    {
      icon: Brain,
      title: 'Predictive Analytics',
      desc: 'Forecast revenue, churn, NPS, and growth with 95%+ accuracy using our proprietary models',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Risk-Free Testing',
      desc: 'Validate ideas before building. Test pricing, features, and positioning without real-world costs',
      color: 'from-gold to-orange-500',
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      desc: 'Get comprehensive results in minutes, not months. Watch AI agents debate and decide in real-time',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Template',
      desc: 'Start with 50+ industry templates or create from scratch',
    },
    {
      number: '02',
      title: 'Define Personas',
      desc: 'Configure 1-5 AI personas representing your target market segments',
    },
    {
      number: '03',
      title: 'Run Simulation',
      desc: '10,000+ AI agents simulate realistic market behavior',
    },
    {
      number: '04',
      title: 'Get Results',
      desc: 'View metrics, 3D agent network, and actionable insights',
    },
  ];

  const stats = [
    { value: '95%', label: 'Accuracy Rate', icon: Target },
    { value: '<5min', label: 'Per Simulation', icon: Activity },
    { value: '10K+', label: 'AI Agents', icon: Users },
    { value: '50+', label: 'Templates', icon: Sparkles },
  ];

  // Animation transition config
  const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl pt-20">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-muted mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-300">Now with 3D Agent Visualization</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Simulate Before
            <br />
            <span className="text-gradient">You Build</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Test your product with 10,000+ AI agents before writing a single line of code.
            Validate market fit, pricing strategies, and user behavior with precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/simulate">
              <Button size="lg" className="btn-gold px-8 h-12 text-base">
                Start Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="px-8 h-12 text-base">
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              transition={transition}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How It
              <span className="text-gradient"> Works</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              transition={transition}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Four simple steps to validate your product idea with AI-powered precision
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeInUp}
                transition={{ ...transition, delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl p-6 h-full relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="absolute -top-4 -right-4 text-8xl font-bold text-surface-elevated/50 select-none">
                    {step.number}
                  </div>
                  <div className="relative">
                    <div className="text-primary font-mono text-sm mb-3">Step {step.number}</div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent" />

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              transition={transition}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why Choose
              <span className="text-gradient"> PM Simulator?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              transition={transition}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Everything you need to validate product decisions before investing months of development.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeInUp}
                  transition={{ ...transition, delay: index * 0.1 }}
                >
                  <div className="glass-elevated rounded-2xl p-8 h-full group hover:border-primary/30 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            transition={transition}
            className="glass-elevated rounded-3xl p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Validate Your
                <span className="text-gradient"> Product?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of product managers who simulate before they build.
                No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/simulate">
                  <Button size="lg" className="btn-gold px-8 h-12 text-base">
                    Start Free Simulation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="secondary" className="px-8 h-12 text-base">
                    Browse Templates
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
