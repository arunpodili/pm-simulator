'use client';

import { Progress } from '@/components/ui/Progress';
import { CheckCircle2, Circle } from 'lucide-react';

interface CompletionIndicatorProps {
  completedFields: number;
  totalFields: number;
  fieldStatus: Record<string, boolean>;
}

export function CompletionIndicator({ completedFields, totalFields, fieldStatus }: CompletionIndicatorProps) {
  const percentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Completion</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex flex-wrap gap-2 pt-2">
        {Object.entries(fieldStatus).map(([field, isComplete]) => (
          <div
            key={field}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isComplete
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isComplete ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
            <span className="capitalize">{field.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
