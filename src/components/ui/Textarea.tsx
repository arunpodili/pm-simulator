'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, ...props }, ref) => {
    const id = props.id || props.name || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-black mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 bg-white border-2 border-gray-300 text-black text-base rounded-sm',
            'placeholder:text-gray-400 resize-y min-h-[100px]',
            'focus:outline-none focus:border-black focus:ring-0',
            'transition-colors duration-200',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
