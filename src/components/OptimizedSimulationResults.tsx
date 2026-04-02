"""
Optimized Simulation Results Component

Uses React.memo, useMemo, and lazy loading for performance.
"""

import React, { useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemoizedSimulation } from '@/hooks/useMemoizedSimulation';

// Memoized metric card component
const MetricCard = memo(function MetricCard({
  title,
  value,
  unit,
  trend
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline mt-2">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="ml-1 text-sm text-gray-400">{unit}</span>}
        </div>
        {trend && (
          <span className={`text-sm ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </CardContent>
    </Card>
  );
});

// Memoized chart component
const SimulationChart = memo(function SimulationChart({
  data,
  width = 600,
  height = 300
}: {
  data: { day: number; users: number; revenue: number }[];
  width?: number;
  height?: number;
}) {
  // Memoize path calculations (expensive)
  const paths = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxUsers = Math.max(...data.map(d => d.users));
    const maxRevenue = Math.max(...data.map(d => d.revenue));

    const xScale = width / (data.length - 1);
    const userYScale = height / maxUsers;
    const revenueYScale = height / maxRevenue;

    const usersPath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xScale} ${height - d.users * userYScale}`)
      .join(' ');

    const revenuePath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xScale} ${height - d.revenue * revenueYScale}`)
      .join(' ');

    return { usersPath, revenuePath, maxUsers, maxRevenue };
  }, [data, width, height]);

  if (!paths) return <div>No data</div>;

  return (
    <svg width={width} height={height} className="border rounded">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={`grid-${i}`}
          x1="0"
          y1={i * (height / 4)}
          x2={width}
          y2={i * (height / 4)}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Users line */}
      <path
        d={paths.usersPath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
      />

      {/* Revenue line */}
      <path
        d={paths.revenuePath}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    </svg>
  );
});

// Main component - memoized to prevent unnecessary re-renders
export const OptimizedSimulationResults = memo(function OptimizedSimulationResults({
  simulationId,
  timeline,
  config
}: {
  simulationId: string;
  timeline: { day: number; newUsers: number; activeUsers: number; revenue: number; satisfaction: number }[];
  config: { name: string; simulation_days: number };
}) {
  // Use memoized calculations
  const { metrics, chartData, summary } = useMemoizedSimulation(timeline);

  // Memoize callbacks
  const handleExport = useCallback(() => {
    const data = JSON.stringify({ simulationId, timeline, metrics }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${simulationId}.json`;
    a.click();
  }, [simulationId, timeline, metrics]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  // Memoize trend calculation
  const trend = useMemo(() => {
    if (!timeline || timeline.length < 2) return 'neutral';
    const first = timeline[0].activeUsers;
    const last = timeline[timeline.length - 1].activeUsers;
    if (last > first * 1.1) return 'up';
    if (last < first * 0.9) return 'down';
    return 'neutral';
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{config.name}</h2>
          <p className="text-gray-500">{timeline.length} days simulated</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Share
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          trend={trend}
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate.toFixed(1)}
          unit="%"
        />
        <MetricCard
          title="Churn Rate"
          value={metrics.churnRate.toFixed(1)}
          unit="%"
        />
        <MetricCard
          title="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth & Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <SimulationChart data={chartData} />
        </CardContent>
      </Card>

      {/* Summary */}
      {summary && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Growth Rate</p>
                <p className={`text-lg font-bold ${summary.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.growthRate > 0 ? '+' : ''}{summary.growthRate.toFixed(1)}%
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Peak Day</p>
                <p className="text-lg font-bold">Day {summary.peakDay.day}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Trend</p>
                <p className={`text-lg font-bold ${summary.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.trend === 'up' ? '↗ Growing' : '↘ Declining'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default OptimizedSimulationResults;
