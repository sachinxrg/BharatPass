'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  labels,
  className,
}: ProgressBarProps) {
  const progressPercent = Math.min(100, Math.max(0, (currentStep / (totalSteps - 1)) * 100));

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/90 shadow-inner border border-slate-300/60">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {labels && (
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          {labels.map((label, idx) => (
            <span
              key={label}
              className={cn(
                'transition-colors',
                idx <= currentStep ? 'text-sky-700 font-bold' : 'text-slate-400'
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
