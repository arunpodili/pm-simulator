'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HintProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  delay?: number;
}

export const Hint: React.FC<HintProps> = ({
  children,
  title,
  className,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-gray-50 border border-gray-200 rounded-sm p-4 text-sm',
        'animate-in fade-in slide-in-from-bottom-2 duration-300',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-black">{title}</span>
        </div>
      )}
      <div className="text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-3 py-2 text-sm text-white bg-black rounded-sm whitespace-nowrap',
          positionClasses[position]
        )}>
          {content}
          <div className={cn(
            'absolute w-2 h-2 bg-black rotate-45',
            position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
            position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
            position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
            position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1',
          )} />
        </div>
      )}
    </div>
  );
};

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200',
                isCompleted && 'bg-black text-white',
                isCurrent && 'bg-black text-white ring-2 ring-offset-2 ring-black',
                !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500'
              )}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={cn(
                'ml-2 text-sm font-medium',
                isCurrent ? 'text-black' : 'text-gray-500'
              )}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-12 h-0.5 mx-2',
                isCompleted ? 'bg-black' : 'bg-gray-200'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

interface GuidedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  guidance?: string;
  example?: string;
}

export const GuidedInput: React.FC<GuidedInputProps> = ({
  label,
  guidance,
  example,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Input label={label} {...props} />

      {(guidance || example) && (
        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm">
          {guidance && (
            <p className="text-gray-700 mb-1">
              <span className="font-medium">💡 Tip:</span> {guidance}
            </p>
          )}
          {example && (
            <p className="text-gray-500">
              <span className="font-medium">Example:</span> {example}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Import Input for GuidedInput
import { Input } from './Input';
