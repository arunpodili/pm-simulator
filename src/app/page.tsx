'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Scene3D, Card3D } from '@/components/3d/Scene3D';
import {
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: '10K+ Virtual Users',
      desc: 'Simulate realistic user behavior at scale',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Predictive Analytics',
      desc: 'Forecast revenue, churn, and growth',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Risk-Free Testing',
      desc: 'Validate ideas before building',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-Time Insights',
      desc: 'Get results in minutes, not months',
    },
  ];

  const industries = [
    { name: 'SaaS', color: 'bg-blue-500', count: '15+ Templates' },
    { name: 'FinTech', color: 'bg-green-500', count: '12+ Templates' },
    { name: 'Health', color: 'bg-red-500', count: '10+ Templates' },
    { name: 'E-commerce', color: 'bg-orange-500', count: '18+ Templates' },
    { name: 'AI/ML', color: 'bg-purple-500', count: '8+ Templates' },
    { name: 'Consumer', color: 'bg-pink-500', count: '14+ Templates' },
  ];

  return (
    <div className={`min-h-screen bg-black text-white transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section with 3D */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Scene3D />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 border-white/20 text-white/80">
              🚀 Now with AI-Powered Insights
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
              BEYOND
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">
              THE LIMITS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Simulate your product with 10,000+ virtual users before writing a single line of code.
            Validate market fit, pricing strategies, and user behavior with AI-powered precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/simulate">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8">
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: '95%', label: 'Accuracy Rate' },
              { value: '<5min', label: 'Per Simulation' },
              { value: '10K+', label: 'Virtual Users' },
              { value: '50+', label: 'Templates' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Why PM Simulator?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to validate product decisions before investing months of development.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D>
                  <Card className="bg-gray-900/50 border-gray-800 h-full hover:bg-gray-900 transition-colors">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Templates Section */}
      <section className="py-32 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Industry-Specific Templates
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
              Pre-built scenarios for every major industry. Customize to your needs.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card3D>
                  <Link href={`/templates?industry=${industry.name.toLowerCase()}`}>
                    <Card className="bg-gray-900/50 border-gray-800 h-full group hover:border-gray-700 transition-all cursor-pointer">
                      <CardContent className="p-8">
                        <div className={`w-4 h-4 ${industry.color} rounded-full mb-4`} />
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                          {industry.name}
                        </h3>
                        <p className="text-gray-500">{industry.count}</p>
                        <div className="mt-4 flex items-center text-sm text-gray-400 group-hover:text-white transition-colors">
                          Explore
                          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Validate Your Product?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join thousands of product managers who simulate before they build.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/simulate">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8">
                  Start Free Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
