'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, AlertCircle, Info, CheckCircle, Sparkles } from 'lucide-react';
import { extractHints, FieldHint, UserBrief } from '@/lib/field-mapping';

interface SmartInputFieldProps {
  label: string;
  name: keyof UserBrief;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function SmartInputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}: SmartInputFieldProps) {
  const [hints, setHints] = useState<FieldHint[]>([]);
  const [showHints, setShowHints] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  // Extract hints when value changes
  useEffect(() => {
    const newHints = extractHints(value, name);
    setHints(newHints);
  }, [value, name]);

  // Debounced hint extraction for performance
  const debouncedExtract = useCallback(
    (text: string, fieldName: keyof UserBrief) => {
      const timeoutId = setTimeout(() => {
        const newHints = extractHints(text, fieldName);
        setHints(newHints);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedExtract(newValue, name);
  };

  const getHintIcon = (type: FieldHint['type']) => {
    switch (type) {
      case 'suggestion':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHintStyles = (type: FieldHint['type']) => {
    switch (type) {
      case 'suggestion':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getQualityIndicator = () => {
    if (value.length === 0) {
      return { color: 'bg-gray-200', label: 'Empty', icon: null };
    }
    if (value.length < 20) {
      return { color: 'bg-red-400', label: 'Too short', icon: <AlertCircle className="w-4 h-4" /> };
    }
    if (value.length < 50) {
      return { color: 'bg-yellow-400', label: 'Brief', icon: <Info className="w-4 h-4" /> };
    }
    return { color: 'bg-green-500', label: 'Good detail', icon: <CheckCircle className="w-4 h-4" /> };
  };

  const quality = getQualityIndicator();

  return (
    <div className="space-y-2">
      {/* Label with quality indicator */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {value.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-16 h-1.5 rounded-full ${quality.color}`} />
            <span className="text-gray-500 flex items-center gap-1">
              {quality.icon}
              {quality.label}
            </span>
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-lg border resize-none transition-all
            ${isFocused ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300'}
            focus:outline-none
          `}
        />

        {/* AI indicator */}
        {isFocused && hints.length > 0 && (
          <div className="absolute top-2 right-2">
            <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Assist
            </div>
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="flex justify-end text-xs text-gray-400">
        {value.length} characters
      </div>

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          {hints.map((hint, index) => (
            <div
              key={index}
              className={`
                flex items-start gap-2 p-3 rounded-lg border text-sm
                ${getHintStyles(hint.type)}
              `}
            >
              <div className="mt-0.5 flex-shrink-0">{getHintIcon(hint.type)}</div>
              <div className="flex-1">
                <p>{hint.text}</p>
                <div className="mt-1 flex items-center gap-2 text-xs opacity-75">
                  <span>Confidence: {Math.round(hint.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SmartInputGroupProps {
  brief: Record<keyof UserBrief, string>;
  onChange: (field: keyof UserBrief, value: string) => void;
}

export function SmartInputGroup({ brief, onChange }: SmartInputGroupProps) {
  return (
    <div className="space-y-6">
      <SmartInputField
        label="What problem does your product solve?"
        name="problem"
        value={brief.problem}
        onChange={(value) => onChange('problem', value)}
        placeholder="e.g., Remote teams waste 10+ hours per week in unproductive meetings..."
        rows={4}
        required
      />

      <SmartInputField
        label="Who is your target user?"
        name="target_user"
        value={brief.target_user}
        onChange={(value) => onChange('target_user', value)}
        placeholder="e.g., Product managers at mid-size tech companies (50-500 employees)..."
        rows={3}
        required
      />

      <SmartInputField
        label="What is your pricing strategy?"
        name="pricing"
        value={brief.pricing}
        onChange={(value) => onChange('pricing', value)}
        placeholder="e.g., $15/user/month with annual discount, freemium tier available..."
        rows={2}
      />

      <SmartInputField
        label="Who are your competitors?"
        name="competitors"
        value={brief.competitors}
        onChange={(value) => onChange('competitors', value)}
        placeholder="e.g., Otter.ai, Fireflies.ai, manual note-taking..."
        rows={2}
      />

      <SmartInputField
        label="What is your success metric?"
        name="success_metric"
        value={brief.success_metric}
        onChange={(value) => onChange('success_metric', value)}
        placeholder="e.g., Reduce meeting time by 30%, improve action item completion by 50%..."
        rows={2}
      />

      <SmartInputField
        label="Additional context (optional)"
        name="additional_context"
        value={brief.additional_context || ''}
        onChange={(value) => onChange('additional_context', value)}
        placeholder="Any other details that might help: integrations, unique features, go-to-market strategy..."
        rows={3}
      />
    </div>
  );
}
