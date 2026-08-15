'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NeuToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function NeuToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: NeuToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 select-none">
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-bold text-slate-800">{label}</span>}
          {description && <span className="text-[11px] text-slate-500">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed p-0.5 border',
          checked ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 border-slate-300'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-md transition duration-200 ease-in-out bg-white',
            checked ? 'translate-x-5 shadow-[0_2px_8px_rgba(2,132,199,0.4)]' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
