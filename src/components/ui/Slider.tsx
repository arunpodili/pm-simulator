'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    { className, label, hint, min = 0, max = 100, step = 1, value, onChange, showValue, ...props },
    ref
  ) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        {(label || (showValue && value !== undefined)) && (
          <div className="flex justify-between items-center mb-2">
            {label && <label className="text-sm font-medium text-black">{label}</label>}
            {showValue && <span className="text-sm text-gray-600">{value}</span>}
          </div>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              'w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-4',
              '[&::-webkit-slider-thumb]:h-4',
              '[&::-webkit-slider-thumb]:bg-black',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-moz-range-thumb]:w-4',
              '[&::-moz-range-thumb]:h-4',
              '[&::-moz-range-thumb]:bg-black',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              className
            )}
            {...props}
          />

          <div
            className="absolute top-1/2 left-0 h-2 bg-black rounded-sm -translate-y-1/2 pointer-events-none"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
