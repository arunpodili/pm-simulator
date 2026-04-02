'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  circle,
  ...props
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        circle && 'rounded-full',
        !circle && 'rounded-sm',
        className
      )}
      style={style}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3', className)}>
    <Skeleton height={20} width="60%" />
    <Skeleton height={16} />
    <Skeleton height={16} width="80%" />
    <Skeleton height={40} className="mt-4" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    <div className="flex gap-2">
      <Skeleton height={40} className="flex-1" />
      <Skeleton height={40} className="flex-1" />
      <Skeleton height={40} className="flex-1" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-2">
        <Skeleton height={48} className="flex-1" />
        <Skeleton height={48} className="flex-1" />
        <Skeleton height={48} className="flex-1" />
      </div>
    ))}
  </div>
);
