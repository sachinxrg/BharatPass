'use client';

import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownWidgetProps {
  targetDate: string;
  label?: string;
  className?: string;
}

export function CountdownWidget({
  targetDate,
  label = 'SLA Guaranteed Delivery',
  className,
}: CountdownWidgetProps) {
  const { days, hours, minutes, seconds, isOverdue } = useCountdown(targetDate);

  return (
    <div
      className={cn(
        'rounded-2xl p-3.5 border flex items-center justify-between gap-3 shadow-xs',
        isOverdue 
          ? 'border-rose-200 bg-rose-50/70 text-rose-900' 
          : 'border-slate-200/80 bg-slate-50/90 text-slate-800',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {isOverdue ? (
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
        ) : (
          <Clock className="w-4 h-4 text-sky-600" />
        )}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
            {label}
          </span>
          <span className="text-xs text-slate-700 font-semibold">
            {isOverdue ? 'Target Deadline Exceeded' : 'Remaining Resolution Window'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-800">
        <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-center min-w-[34px] shadow-xs">
          <span className={isOverdue ? 'text-rose-600' : 'text-slate-900'}>{days}</span>
          <span className="text-[9px] text-slate-400 block -mt-1 font-sans">d</span>
        </div>
        <span className="text-slate-400">:</span>
        <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-center min-w-[34px] shadow-xs">
          <span className={isOverdue ? 'text-rose-600' : 'text-slate-900'}>
            {hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400 block -mt-1 font-sans">h</span>
        </div>
        <span className="text-slate-400">:</span>
        <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-center min-w-[34px] shadow-xs">
          <span className={isOverdue ? 'text-rose-600' : 'text-slate-900'}>
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400 block -mt-1 font-sans">m</span>
        </div>
        <span className="text-slate-400">:</span>
        <div className="bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-center min-w-[34px] shadow-xs">
          <span className={isOverdue ? 'text-rose-600' : 'text-emerald-600 animate-pulse font-black'}>
            {seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-400 block -mt-1 font-sans">s</span>
        </div>
      </div>
    </div>
  );
}
