'use client';

import { useState } from 'react';
import { Lightbulb, Info, AlertTriangle, BookOpen, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface InlineHintProps {
  type: 'example' | 'best-practice' | 'warning' | 'framework';
  content: string;
  source?: string;
  onDismiss?: () => void;
}

const hintConfig = {
  example: {
    icon: Lightbulb,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    label: 'Example',
  },
  'best-practice': {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    label: 'Best Practice',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    label: 'Warning',
  },
  framework: {
    icon: BookOpen,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    label: 'Framework',
  },
};

export function InlineHint({ type, content, source, onDismiss }: InlineHintProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = hintConfig[type];
  const Icon = config.icon;

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <Icon className="h-4 w-4" />
        <span>Show {config.label}</span>
      </button>
    );
  }

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Icon className={`h-4 w-4 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${config.iconColor}`}>
                {config.label}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm mt-1 text-gray-700">{content}</p>
            {source && (
              <p className="text-xs text-gray-500 mt-1 italic">— {source}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
