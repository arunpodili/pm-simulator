import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { StepIndicator } from '@/components/ui/Hint';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-200">
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Now with AI-powered insights
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            Simulate Your Product
            <br />
            <span className="text-gray-500">Before You Build</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Validate your product decisions with AI-powered simulations.
            Test market fit, pricing strategies, and user behavior before writing a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/simulate">
              <Button size="lg" fullWidth className="sm:w-auto">
                Start Simulation
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg" fullWidth className="sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required. Free tier includes 5 simulations.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-gray-600">Four simple steps to validate your product idea</p>
          </div>

          <div className="flex justify-center mb-12 overflow-x-auto">
            <StepIndicator
              steps={['Define', 'Configure', 'Simulate', 'Analyze']}
              currentStep={0}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Define',
                description: 'Describe your product idea and target market in plain language.',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              },
              {
                step: '02',
                title: 'Configure',
                description: 'Set pricing, features, and market parameters for your simulation.',
                icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              },
              {
                step: '03',
                title: 'Simulate',
                description: 'AI simulates thousands of virtual users interacting with your product.',
                icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
              },
              {
                step: '04',
                title: 'Analyze',
                description: 'Get detailed insights on conversion, churn, revenue, and user satisfaction.',
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              }
            ].map((item, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-black transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-gray-200 mb-4">{item.step}</div>
                  <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Why PM Simulator?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered',
                description: 'Advanced language models simulate realistic user behavior and market dynamics.',
                stat: '95%',
                statLabel: 'Accuracy'
              },
              {
                title: 'Fast Results',
                description: 'Get comprehensive simulation results in minutes, not months.',
                stat: '<5min',
                statLabel: 'Per Simulation'
              },
              {
                title: 'Data-Driven',
                description: 'Make decisions based on simulated data, not gut feelings.',
                stat: '10K+',
                statLabel: 'Virtual Users'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-black mb-2">{feature.stat}</div>
                <div className="text-sm font-medium text-gray-500 mb-4">{feature.statLabel}</div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
