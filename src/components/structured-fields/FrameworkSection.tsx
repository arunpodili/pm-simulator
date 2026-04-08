'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StructuredField } from './StructuredField';
import { CompletionIndicator } from './CompletionIndicator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FrameworkField {
  id: string;
  label: string;
  prompt: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  hints?: Array<{
    type: 'example' | 'best-practice' | 'warning' | 'framework';
    content: string;
    source?: string;
  }>;
}

interface FrameworkSectionProps {
  title: string;
  description?: string;
  fields: FrameworkField[];
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  collapsible?: boolean;
}

export function FrameworkSection({
  title,
  description,
  fields,
  values,
  onChange,
  collapsible = true,
}: FrameworkSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fieldStatus = fields.reduce(
    (acc, field) => {
      const value = values[field.id] || '';
      const minLength = field.minLength || (field.required ? 10 : 0);
      acc[field.id] = value.length >= minLength;
      return acc;
    },
    {} as Record<string, boolean>
  );

  const completedCount = Object.values(fieldStatus).filter(Boolean).length;
  const totalCount = fields.length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-4">
            <CompletionIndicator
              completedFields={completedCount}
              totalFields={totalCount}
              fieldStatus={fieldStatus}
            />
          </div>
        )}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-6">
          {fields.map((field) => (
            <StructuredField
              key={field.id}
              id={field.id}
              label={field.label}
              prompt={field.prompt}
              value={values[field.id] || ''}
              onChange={(value) => onChange(field.id, value)}
              minLength={field.minLength}
              maxLength={field.maxLength}
              required={field.required}
              placeholder={field.placeholder}
              hints={field.hints}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
