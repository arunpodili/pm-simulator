'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, hint, ...props }, ref) => {
    const id = props.id || props.name || React.useId();

    return (
      <div className={cn('flex items-center justify-between gap-4', className)}>
        {(label || hint) && (
          <div className="flex-1">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-black">
                {label}
              </label>
            )}
            {hint && <p className="text-sm text-gray-500">{hint}</p>}
          </div>
        )}
        <div className="relative inline-flex items-center">
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
              'h-6 w-11 cursor-pointer rounded-full border-2 border-gray-300 bg-gray-200',
              'transition-colors duration-200 ease-in-out',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2',
              'peer-checked:border-black peer-checked:bg-black',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              'after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4',
              'after:rounded-full after:bg-white after:transition-transform after:duration-200',
              'after:content-[""] peer-checked:after:translate-x-5'
            )}
          />
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';
