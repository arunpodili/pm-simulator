'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Play, Users, TrendingUp, Shield, Zap } from 'lucide-react';

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
      title: '10K+ Virtual Users',
      desc: 'Simulate realistic user behavior at scale',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      desc: 'Forecast revenue, churn, and growth',
    },
    {
      icon: Shield,
      title: 'Risk-Free Testing',
      desc: 'Validate ideas before building',
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      desc: 'Get results in minutes, not months',
    },
  ];

  const industries = [
    { name: 'SaaS', count: '15+ Templates' },
    { name: 'FinTech', count: '12+ Templates' },
    { name: 'Health', count: '10+ Templates' },
    { name: 'E-commerce', count: '18+ Templates' },
    { name: 'AI/ML', count: '8+ Templates' },
    { name: 'Consumer', count: '14+ Templates' },
  ];

  // Animation transition config
  const transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
          {/* Badge */}
          <motion.div
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Now with AI-Powered Insights
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6"
          >
            Simulate Before
            <br />
            <span className="text-gray-400">You Build</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Test your product with 10,000+ virtual users before writing a single line of code.
            Validate market fit, pricing strategies, and user behavior with precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/simulate">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 px-8 h-12 text-base rounded-md">
                Start Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 h-12 text-base rounded-md">
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...transition, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: '95%', label: 'Accuracy Rate' },
              { value: '<5min', label: 'Per Simulation' },
              { value: '10K+', label: 'Virtual Users' },
              { value: '50+', label: 'Templates' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} transition={transition} className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Why PM Simulator?
            </motion.h2>
            <motion.p variants={fadeInUp} transition={transition} className="text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need to validate product decisions before investing months of development.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ ...transition, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-100 h-full hover:border-gray-200 hover:shadow-sm transition-all duration-200 rounded-lg">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="text-base font-medium mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Templates Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} transition={transition} className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Industry Templates
            </motion.h2>
            <motion.p variants={fadeInUp} transition={transition} className="text-gray-500 text-lg max-w-2xl mx-auto">
              Pre-built scenarios for every major industry. Customize to your needs.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                transition={{ ...transition, delay: index * 0.1 }}
              >
                <Link href={`/templates?industry=${industry.name.toLowerCase()}`}>
                  <Card className="bg-white border-gray-100 h-full group hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer rounded-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                          {industry.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-sm text-gray-400">{industry.count}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={transition}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Validate Your Product?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of product managers who simulate before they build.
              No credit card required.
            </p>
            <Link href="/simulate">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 h-12 text-base rounded-md">
                Start Free Simulation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
