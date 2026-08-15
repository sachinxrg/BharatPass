'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'emerald' | 'amber' | 'cyan' | 'indigo' | 'rose' | 'slate';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  children,
  variant = 'cyan',
  pulse = false,
  size = 'md',
  icon,
  className,
}: StatusBadgeProps) {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 glow-emerald',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80 glow-amber',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 glow-cyan',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 glow-indigo',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const pulseColors = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    cyan: 'bg-cyan-500',
    indigo: 'bg-indigo-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-lg gap-1 font-bold',
    md: 'text-xs px-3 py-1 rounded-xl gap-1.5 font-bold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border backdrop-blur-md transition-all select-none shadow-2xs',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              pulseColors[variant]
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-2 w-2', pulseColors[variant])}
          />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
}
