'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'none';
  variant?: 'default' | 'interactive' | 'neu' | 'flat';
  noPadding?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = 'none',
  variant = 'default',
  noPadding = false,
  ...props
}: GlassCardProps) {
  const auraClasses = {
    indigo: 'aura-indigo border-indigo-100 hover:border-indigo-200',
    cyan: 'aura-cyan border-cyan-100 hover:border-cyan-200',
    emerald: 'aura-emerald border-emerald-100 hover:border-emerald-200',
    amber: 'aura-amber border-amber-100 hover:border-amber-200',
    rose: 'aura-rose border-rose-100 hover:border-rose-200',
    none: 'border-slate-200/80',
  };

  const variantClasses = {
    default: 'glass-panel rounded-3xl relative overflow-hidden backdrop-blur-xl bg-white/80 border shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]',
    interactive: 'glass-panel-interactive rounded-3xl relative overflow-hidden backdrop-blur-xl bg-white/80 border shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] cursor-pointer',
    neu: 'neu-extruded rounded-3xl relative overflow-hidden',
    flat: 'bg-white rounded-3xl border border-slate-200 relative overflow-hidden shadow-xs',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        auraClasses[glow],
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {/* Subtle top inner light reflection */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-white/90 to-transparent blur-md rounded-full" />
      {children}
    </div>
  );
}
