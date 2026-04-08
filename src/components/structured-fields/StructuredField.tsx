'use client';

import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { InlineHint } from './InlineHint';
import { Lightbulb, Info, AlertTriangle, BookOpen } from 'lucide-react';

interface Hint {
  type: 'example' | 'best-practice' | 'warning' | 'framework';
  content: string;
  source?: string;
}

interface StructuredFieldProps {
  id: string;
  label: string;
  prompt: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  hints?: Hint[];
  placeholder?: string;
  validate?: (value: string) => string | null;
}

export function StructuredField({
  id,
  label,
  prompt,
  value,
  onChange,
  minLength = 10,
  maxLength = 2000,
  required = false,
  hints = [],
  placeholder,
  validate,
}: StructuredFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);

  const validateField = useCallback(
    (val: string) => {
      if (required && !val.trim()) {
        return 'This field is required';
      }
      if (val.length < minLength) {
        return `Minimum ${minLength} characters required`;
      }
      if (validate) {
        return validate(val);
      }
      return null;
    },
    [required, minLength, validate]
  );

  const handleBlur = () => {
    setIsFocused(false);
    setError(validateField(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
      if (error) {
        setError(validateField(newValue));
      }
    }
  };

  const isValid = !error && (!required || value.length >= minLength);
  const charCount = value.length;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <Label htmlFor={id} className="text-base font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <p className="text-sm text-gray-500 mt-0.5">{prompt}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>
            {charCount}/{maxLength}
          </span>
          {isValid && <span className="text-green-500">✓</span>}
        </div>
      </div>

      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`min-h-[100px] ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isFocused && showHints && hints.length > 0 && (
        <div className="space-y-2 pt-2">
          {hints.map((hint, index) => (
            <InlineHint
              key={index}
              type={hint.type}
              content={hint.content}
              source={hint.source}
            />
          ))}
        </div>
      )}
    </div>
  );
}
