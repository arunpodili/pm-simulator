'use client';

import { CheckCircle, AlertTriangle, XCircle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface ValidationBadgeProps {
  confidence: number;
  status: 'valid' | 'warning' | 'alert' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ValidationBadge({
  confidence,
  status,
  size = 'md',
  showLabel = true,
}: ValidationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const configs = {
    valid: {
      bg: 'bg-green-100',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className={`${iconSizes[size]} text-green-600`} />,
      label: 'Realistic',
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertTriangle className={`${iconSizes[size]} text-yellow-600`} />,
      label: 'Caution',
    },
    alert: {
      bg: 'bg-orange-100',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: <AlertTriangle className={`${iconSizes[size]} text-orange-600`} />,
      label: 'Review',
    },
    critical: {
      bg: 'bg-red-100',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle className={`${iconSizes[size]} text-red-600`} />,
      label: 'Unrealistic',
    },
  };

  const config = configs[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses[size]}
        ${config.bg}
        ${config.border}
        ${config.text}
      `}
    >
      {config.icon}
      {showLabel && <span>{config.label}</span>}
      <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
    </span>
  );
}

interface ValidationPanelProps {
  validation: {
    industry: string;
    overall_status: string;
    overall_confidence: number;
    is_realistic: boolean;
    metrics_validated: number;
    metrics: Array<{
      name: string;
      value: number;
      benchmark: number;
      z_score: number;
      confidence: number;
      status: string;
      interpretation: string;
    }>;
    summary: {
      valid: number;
      warnings: number;
      alerts: number;
      critical: number;
    };
    recommendations: string[];
    sources: string[];
  };
}

export function ValidationPanel({ validation }: ValidationPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getZScoreColor = (z: number) => {
    const abs = Math.abs(z);
    if (abs <= 1) return 'text-green-600';
    if (abs <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Validation Results</h3>
            <p className="text-sm text-gray-500">
              {validation.metrics_validated} metrics validated against {validation.industry} benchmarks
            </p>
          </div>
        </div>
        <ValidationBadge
          confidence={validation.overall_confidence / 100}
          status={validation.overall_status === 'realistic' ? 'valid' : validation.overall_status === 'caution' ? 'warning' : 'alert'}
          size="lg"
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validation.metrics.map((metric) => (
          <div
            key={metric.name}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700 capitalize">
                {metric.name.replace(/_/g, ' ')}
              </span>
              {getStatusIcon(metric.status)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Simulated:</span>
                <span className="font-mono font-medium">
                  {metric.value > 1 ? metric.value.toFixed(2) : `${(metric.value * 100).toFixed(1)}%`}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Benchmark:</span>
                <span className="font-mono">
                  {metric.benchmark > 1 ? metric.benchmark.toFixed(2) : `${(metric.benchmark * 100).toFixed(1)}%`}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Deviation:</span>
                <span className={`font-mono font-medium flex items-center gap-1 ${getZScoreColor(metric.z_score)}`}>
                  {metric.z_score > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(metric.z_score).toFixed(1)}σ
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">{metric.interpretation}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Valid" value={validation.summary.valid} color="green" />
        <SummaryCard label="Warnings" value={validation.summary.warnings} color="yellow" />
        <SummaryCard label="Alerts" value={validation.summary.alerts} color="orange" />
        <SummaryCard label="Critical" value={validation.summary.critical} color="red" />
      </div>

      {/* Recommendations */}
      {validation.recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {validation.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sources */}
      <div className="text-xs text-gray-500">
        <span className="font-medium">Data sources: </span>
        {validation.sources.join(', ')}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'green' | 'yellow' | 'orange' | 'red';
}) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`${colors[color]} rounded-lg p-3 text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}
