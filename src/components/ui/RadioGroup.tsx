'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const RadioGroupContext = createContext<{
  value: string;
  onChange: (value: string) => void;
}> | null>(null);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => (
  <RadioGroupContext.Provider value={{ value, onChange: onValueChange }}>
    <div className={cn('space-y-2', className)} role="radiogroup">{children}</div>
  </RadioGroupContext.Provider>
);

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  label?: string;
  hint?: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, hint, className, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

    const { value: selectedValue, onChange } = context;
    const isSelected = selectedValue === value;
    const id = props.id || `radio-${value}`;

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            type="radio"
            value={value}
            checked={isSelected}
            onChange={() => onChange(value)}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              'h-5 w-5 rounded-full border-2 border-gray-300 cursor-pointer',
              'flex items-center justify-center',
              'transition-colors duration-200',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2',
              'peer-checked:border-black peer-checked:bg-black',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
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

RadioGroupItem.displayName = 'RadioGroupItem';
