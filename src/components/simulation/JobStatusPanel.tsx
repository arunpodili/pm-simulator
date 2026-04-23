'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ListTodo,
  MoreHorizontal,
} from 'lucide-react';

interface TaskStatus {
  task_id: string;
  status: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'REVOKED';
  progress: number;
  meta?: {
    day?: number;
    total_days?: number;
    step?: string;
    message?: string;
    metrics?: any;
  };
  result?: any;
  error?: string;
  date_done?: string;
}

interface JobStatusPanelProps {
  taskId: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function JobStatusPanel({ taskId, onComplete, onError }: JobStatusPanelProps) {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`);
      const data = await response.json();
      setStatus(data);

      // Stop polling if complete or failed
      if (data.status === 'SUCCESS' || data.status === 'FAILURE' || data.status === 'REVOKED') {
        setIsPolling(false);

        if (data.status === 'SUCCESS' && onComplete) {
          onComplete(data.result);
        } else if (data.status === 'FAILURE' && onError) {
          onError(data.error || 'Task failed');
        }
      }
    } catch (error) {
      console.error('Failed to fetch task status:', error);
    }
  }, [taskId, onComplete, onError]);

  useEffect(() => {
    if (!taskId) return;

    // Initial fetch
    fetchStatus();

    // Poll every 2 seconds while active
    let interval: NodeJS.Timeout;
    if (isPolling) {
      interval = setInterval(fetchStatus, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [taskId, isPolling, fetchStatus]);

  const handleRetry = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/retry`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsPolling(true);
      }
    } catch (error) {
      console.error('Failed to retry task:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';
      await fetch(`${API_BASE_URL}/api/tasks/${taskId}/revoke`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'PENDING':
        return <ListTodo className="w-5 h-5 text-gray-500" />;
      case 'PROGRESS':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILURE':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'RETRY':
        return <RotateCcw className="w-5 h-5 text-yellow-500" />;
      default:
        return <MoreHorizontal className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (status?.status) {
      case 'PENDING':
        return 'Queued';
      case 'PROGRESS':
        return status.meta?.step || 'Running';
      case 'SUCCESS':
        return 'Completed';
      case 'FAILURE':
        return 'Failed';
      case 'RETRY':
        return 'Retrying';
      case 'REVOKED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-700';
      case 'PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'FAILURE':
        return 'bg-red-100 text-red-700';
      case 'RETRY':
        return 'bg-yellow-100 text-yellow-700';
      case 'REVOKED':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!status) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <div className={`rounded-lg p-4 ${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-semibold">{getStatusLabel()}</div>
              <div className="text-sm opacity-75">
                Task: {taskId.slice(0, 8)}...
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status.status === 'PROGRESS' && (
              <>
                <button
                  onClick={() => setIsPolling(!isPolling)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={isPolling ? 'Pause updates' : 'Resume updates'}
                >
                  {isPolling ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Cancel task"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}

            {status.status === 'FAILURE' && (
              <button
                onClick={handleRetry}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Retry task"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {status.status === 'PROGRESS' && (
          <div className="mt-4">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <div className="mt-1 text-sm text-right">{Math.round(status.progress)}%</div>
          </div>
        )}
      </div>

      {/* Details Toggle */}
      {(status.meta || status.result || status.error) && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </button>

          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              {status.meta?.message && (
                <div className="mb-2">
                  <span className="font-medium">Status: </span>
                  {status.meta.message}
                </div>
              )}

              {status.meta?.day && status.meta?.total_days && (
                <div className="mb-2">
                  <span className="font-medium">Progress: </span>
                  Day {status.meta.day} of {status.meta.total_days}
                </div>
              )}

              {status.error && (
                <div className="mb-2 text-red-600">
                  <span className="font-medium">Error: </span>
                  {status.error}
                </div>
              )}

              {status.date_done && (
                <div className="text-gray-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Completed: {new Date(status.date_done).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Job List Component for viewing multiple jobs
interface JobListProps {
  taskIds: string[];
  onSelect?: (taskId: string) => void;
}

export function JobList({ taskIds, onSelect }: JobListProps) {
  const [jobs, setJobs] = useState<TaskStatus[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:5001';
      const results = await Promise.all(
        taskIds.map(async (id) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/status`);
            return response.json();
          } catch {
            return null;
          }
        })
      );
      setJobs(results.filter(Boolean));
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, [taskIds]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      PENDING: { color: 'bg-gray-100 text-gray-700', label: 'Queued' },
      PROGRESS: { color: 'bg-blue-100 text-blue-700', label: 'Running' },
      SUCCESS: { color: 'bg-green-100 text-green-700', label: 'Done' },
      FAILURE: { color: 'bg-red-100 text-red-700', label: 'Failed' },
      REVOKED: { color: 'bg-gray-100 text-gray-500', label: 'Cancelled' },
    };
    const config = configs[status] || configs.PENDING;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      {jobs.map((job) => (
        <button
          key={job.task_id}
          onClick={() => onSelect?.(job.task_id)}
          className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm text-gray-500">
              {job.task_id.slice(0, 8)}...
            </div>
            {getStatusBadge(job.status)}
          </div>

          <div className="text-sm text-gray-500">
            {job.progress > 0 && `${Math.round(job.progress)}%`}
          </div>
        </button>
      ))}
    </div>
  );
}
