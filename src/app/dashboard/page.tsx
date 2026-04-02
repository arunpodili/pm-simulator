'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';
import { simulationsApi } from '@/lib/api/client';
import { SimulationResult } from '@/lib/api/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'completed' | 'running' | 'failed' | 'all'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSimulations();
    }
  }, [isAuthenticated, filter]);

  const loadSimulations = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: 1, per_page: 10 };
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await simulationsApi.list(params);
      setSimulations(response.items);
    } catch (error) {
      console.error('Failed to load simulations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-black text-white';
      case 'running':
        return 'bg-gray-100 text-black animate-pulse';
      case 'failed':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Link href="/simulate">
            <Button>+ New Simulation</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Simulations', value: simulations.length },
            { label: 'Completed', value: simulations.filter((s) => s.status === 'completed').length },
            { label: 'Running', value: simulations.filter((s) => s.status === 'running').length },
            { label: 'Failed', value: simulations.filter((s) => s.status === 'failed').length },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'completed', 'running', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Simulations List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-gray-600">Loading...</div>
            ) : simulations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No simulations yet</p>
                <Link href="/simulate">
                  <Button>Run Your First Simulation</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {simulations.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/simulations/${sim.id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-black transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          sim.status
                        )}`}
                      >
                        {sim.status}
                      </div>
                      <div>
                        <div className="font-medium text-black">{sim.config.product_name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(sim.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {sim.metrics?.conversion_rate && (
                        <div className="text-sm font-medium">
                          {sim.metrics.conversion_rate}% conversion
                        </div>
                      )}
                      {sim.metrics?.projected_arr && (
                        <div className="text-sm text-gray-500">
                          ${(sim.metrics.projected_arr / 1000).toFixed(0)}K ARR
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
