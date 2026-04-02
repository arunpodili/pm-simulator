'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              setIsOpen,
            })
          : child
      )}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<{
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}> = ({ children, className, isOpen, setIsOpen }) => (
  <button
    type="button"
    onClick={() => setIsOpen?.(!isOpen)}
    className={cn(
      'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium',
      'bg-white border border-gray-300 rounded-sm hover:bg-gray-50',
      'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
      className
    )}
  >
    {children}
    <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
  </button>
);

export const DropdownMenuContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}> = ({ children, className, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 w-56 rounded-sm bg-white shadow-lg border border-gray-200',
        'py-1 focus:outline-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => (
  <button
    type="button"
    className={cn(
      'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
      'focus:outline-none focus:bg-gray-100',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({
  className,
}) => <div className={cn('h-px bg-gray-200 my-1', className)} />;
