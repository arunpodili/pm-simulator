'use client';

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, DollarSign, Heart, X, Pause, Play } from 'lucide-react';
import { useStreamingSimulation, StreamData } from '@/lib/streaming-api';

interface StreamingResultsProps {
  simId: string;
  onComplete?: (results: StreamData['final_metrics']) => void;
  onError?: (error: string) => void;
}

export function StreamingResults({ simId, onComplete, onError }: StreamingResultsProps) {
  const {
    isStreaming,
    progress,
    currentDay,
    totalDays,
    dailyMetrics,
    finalResults,
    error,
    startStreaming,
    stopStreaming,
    disconnect,
  } = useStreamingSimulation();

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (simId) {
      startStreaming(simId);
    }

    return () => {
      disconnect();
    };
  }, [simId, startStreaming, disconnect]);

  useEffect(() => {
    if (finalResults && onComplete) {
      onComplete(finalResults);
    }
  }, [finalResults, onComplete]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleCancel = async () => {
    await stopStreaming(simId);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    // Note: Actual pause logic would require backend support
  };

  if (!isStreaming && !finalResults && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Initializing simulation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Simulation Running</h3>
          <p className="text-sm text-gray-500">
            Day {currentDay} of {totalDays} ({Math.round(progress)}%)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePause}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-red-600 hover:text-red-800 transition-colors"
            title="Cancel simulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Daily Metrics */}
      {dailyMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="New Users"
            value={dailyMetrics.new_users}
            trend="up"
          />
          <MetricCard
            icon={<Activity className="w-5 h-5 text-green-500" />}
            label="Active Users"
            value={dailyMetrics.active_users}
            trend="up"
          />
          <MetricCard
            icon={<DollarSign className="w-5 h-5 text-yellow-500" />}
            label="Daily Revenue"
            value={`$${dailyMetrics.daily_revenue.toFixed(2)}`}
            trend="neutral"
          />
          <MetricCard
            icon={<Heart className="w-5 h-5 text-red-500" />}
            label="Satisfaction"
            value={`${(dailyMetrics.satisfaction * 100).toFixed(0)}%`}
            trend="up"
          />
        </div>
      )}

      {/* Final Results */}
      {finalResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Simulation Complete
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ResultItem label="Total Users" value={finalResults.total_users_acquired} />
            <ResultItem label="Churned" value={finalResults.total_users_churned} />
            <ResultItem label="Net Growth" value={finalResults.net_user_growth} />
            <ResultItem label="Total Revenue" value={`$${finalResults.total_revenue.toLocaleString()}`} />
            <ResultItem label="Satisfaction" value={`${(finalResults.average_satisfaction * 100).toFixed(0)}%`} />
            <ResultItem label="Conversion" value={`${(finalResults.conversion_rate * 100).toFixed(1)}%`} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Simulation Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
}) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${trendColors[trend]}`}>{value}</div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-gray-500 uppercase">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}
