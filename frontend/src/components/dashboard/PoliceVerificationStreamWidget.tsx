'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { ShieldCheck, MapPin, User, Navigation, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';
import Link from 'next/link';

export function PoliceVerificationStreamWidget() {
  const steps = [
    { title: 'Case Dispatched to SP Office', status: 'done', time: '14 Aug, 10:30 AM' },
    { title: 'Assigned to SI Rajesh Kumar (Indiranagar PS)', status: 'done', time: '14 Aug, 02:15 PM' },
    { title: 'Physical Beat Visit & Neighbor Signoff', status: 'current', time: 'Today, 11:30 AM Expected' },
    { title: 'Final Digital Signoff & RPO Sync', status: 'pending', time: 'Pending' },
  ];

  return (
    <GlassCard glow="emerald" className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">mPolice Stream</h3>
              <span className="text-[10px] text-slate-500 font-medium">GPS-Tagged Beat Verification</span>
            </div>
          </div>
          <StatusBadge variant="amber" size="sm" pulse>
            Field Active
          </StatusBadge>
        </div>

        {/* Assigned Officer Badge */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[11px] font-bold text-emerald-800">
              RK
            </div>
            <div>
              <span className="font-bold text-slate-900 block">SI Rajesh Kumar</span>
              <span className="text-[10px] text-slate-500 font-medium">Badge #KA-BLR-2145 • Indiranagar PS</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold font-mono">
            <Navigation className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>GPS Locked</span>
          </div>
        </div>

        {/* Mini Step Tracker */}
        <div className="space-y-2.5 relative pl-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-2.5 text-xs">
              <span
                className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 flex items-center justify-center ${
                  step.status === 'done'
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : step.status === 'current'
                    ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
              <div className="flex-1">
                <p className={`font-bold ${step.status === 'current' ? 'text-amber-800' : step.status === 'done' ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.title}
                </p>
                <span className="text-[10px] text-slate-500 block font-medium">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Link href="/police">
          <NeuButton size="sm" variant="secondary" className="w-full justify-between" rightIcon={<ChevronRight className="w-4 h-4" />}>
            Open mPolice Officer Portal
          </NeuButton>
        </Link>
      </div>
    </GlassCard>
  );
}
