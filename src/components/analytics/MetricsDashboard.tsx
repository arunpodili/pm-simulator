'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Activity, Users, Zap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricsData {
  overview: {
    total_simulations: number;
    completed_simulations: number;
    completion_rate: number;
    total_users: number;
    total_personas: number;
    total_changes: number;
  };
  activity: {
    recent_simulations: number;
    recent_users: number;
  };
  business: {
    simulations_run: number;
    simulations_completed: number;
    exports_generated: {
      pdf: number;
      docx: number;
      notion: number;
      google_docs: number;
    };
    personas_created: number;
    api_calls: number;
  };
  performance: Record<string, {
    count: number;
    avg_ms: number;
    min_ms: number;
    max_ms: number;
    p95_ms: number;
  }>;
  timestamp: string;
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/v2/analytics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading metrics...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="mr-2" />
        Error: {error}
      </div>
    );
  }

  if (!metrics) return null;

  const { overview, activity, business, performance } = metrics;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{overview.total_simulations}</div>
                <div className="text-sm text-gray-500">{overview.completed_simulations} completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{overview.completion_rate}%</div>
                <div className="text-sm text-gray-500">Success rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{overview.total_users}</div>
                <div className="text-sm text-gray-500">+{activity.recent_users} today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Personas Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{overview.total_personas}</div>
                <div className="text-sm text-gray-500">Target profiles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Business Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{business.simulations_run}</div>
              <div className="text-sm text-gray-500">Simulations Run</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {Object.values(business.exports_generated).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Exports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{business.personas_created}</div>
              <div className="text-sm text-gray-500">Personas Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{business.api_calls}</div>
              <div className="text-sm text-gray-500">API Calls</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Export Breakdown</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">PDF: {business.exports_generated.pdf}</Badge>
              <Badge variant="secondary">Docx: {business.exports_generated.docx}</Badge>
              <Badge variant="secondary">Notion: {business.exports_generated.notion}</Badge>
              <Badge variant="secondary">Google Docs: {business.exports_generated.google_docs}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Operation</th>
                  <th className="text-right py-2">Count</th>
                  <th className="text-right py-2">Avg (ms)</th>
                  <th className="text-right py-2">P95 (ms)</th>
                  <th className="text-right py-2">Max (ms)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(performance).map(([key, stats]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 font-mono text-xs">{key.split(':')[0]}</td>
                    <td className="text-right py-2">{stats.count}</td>
                    <td className="text-right py-2">{stats.avg_ms.toFixed(2)}</td>
                    <td className="text-right py-2">{stats.p95_ms.toFixed(2)}</td>
                    <td className="text-right py-2">{stats.max_ms.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-right">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
