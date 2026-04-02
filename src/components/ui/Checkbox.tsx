'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, hint, ...props }, ref) => {
    const id = props.id || props.name || React.useId();

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              'h-5 w-5 border-2 border-gray-300 rounded-sm cursor-pointer',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2',
              'peer-checked:bg-black peer-checked:border-black',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
            )}
          >
            <Check className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
          </label>
        </div>
        {(label || hint) && (
          <div className="space-y-1">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-black cursor-pointer">
                {label}
              </label>
            )}
            {hint && <p className="text-sm text-gray-500">{hint}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
