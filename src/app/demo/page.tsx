'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Hint } from '@/components/ui/Hint';
import { Button } from '@/components/ui/Button';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Live Demo</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how PM Simulator works with a pre-configured example.
            Explore the insights and analytics generated from a real simulation.
          </p>
        </div>

        {/* Demo Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">TaskFlow Pro</h2>
                <p className="text-gray-600 mb-4">
                  A project management tool for small teams with AI-powered task prioritization.
                  Targeting freelancers and agencies aged 25-40.
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Freemium Model</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">$29/month Pro</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">SaaS</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Conversion Rate', value: '14.2%', subtext: 'Free to Paid' },
            { label: 'Churn Rate', value: '3.8%', subtext: 'Monthly' },
            { label: 'Avg. Revenue', value: '$342', subtext: 'Per Customer' },
            { label: 'Satisfaction', value: '4.4/5', subtext: 'User Rating' },
          ].map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-black mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-400">{metric.subtext}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Hint title="Pricing Sweet Spot">
                The $29 price point shows 78% acceptance rate in target demographic.
                Consider A/B testing $34 for 15% revenue increase potential.
              </Hint>
              <Hint title="Feature Demand">
                AI prioritization is the #1 requested feature. Users willing to pay
                40% premium for advanced automation capabilities.
              </Hint>
              <Hint title="Churn Risk">
                Teams larger than 10 show 2.3x higher churn. Consider team-specific
                onboarding flows for better retention.
              </Hint>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { aspect: 'Ease of Use', score: 92, sentiment: 'positive' },
                  { aspect: 'Feature Set', score: 85, sentiment: 'positive' },
                  { aspect: 'Pricing Value', score: 78, sentiment: 'neutral' },
                  { aspect: 'Support', score: 88, sentiment: 'positive' },
                  { aspect: 'Integration', score: 72, sentiment: 'neutral' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.aspect}</span>
                      <span className="text-sm text-gray-600">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-sm">
                      <div
                        className="bg-black h-2 rounded-sm transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Projection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>12-Month Revenue Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[28, 35, 42, 51, 58, 67, 74, 82, 91, 98, 108, 118].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-black transition-all duration-500 hover:bg-gray-700"
                    style={{ height: `${value * 2}px` }}
                  />
                  <span className="text-xs text-gray-500">M{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Projected ARR (Month 12)</div>
                  <div className="text-2xl font-bold">$1.42M</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Growth Rate</div>
                  <div className="text-2xl font-bold text-green-600">+18% MoM</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Hint title="Ready to simulate your own product?" className="mb-6">
            Run your own simulation with your specific product details, pricing, and target market.
            Get personalized insights in under 5 minutes.
          </Hint>
          <Button size="lg">Start Your Simulation</Button>
        </div>
      </div>
    </div>
  );
}
