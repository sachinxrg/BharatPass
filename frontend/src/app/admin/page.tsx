'use client';

import React, { useState } from 'react';
import { PSK_CENTERS } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Sliders, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  Building, 
  ShieldCheck,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [pskCapacities, setPskCapacities] = useState(
    PSK_CENTERS.map((p) => ({ ...p, capacity: p.dailySlots }))
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCapacityChange = (id: string, delta: number) => {
    setPskCapacities((prev) =>
      prev.map((p) => (p.id === id ? { ...p, capacity: Math.max(50, p.capacity + delta) } : p))
    );
  };

  const handleSaveQuotas = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>Regional Passport Officer (RPO) Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">National Passport Pipeline Analytics</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time throughput monitoring, distributed slot capacity adjustments, and SLA breach radars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="emerald" pulse size="sm">
            All 36 RPO Clusters Active
          </StatusBadge>
        </div>
      </div>

      {/* Real-time Aggregate Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total In-Flight', value: '48,920', change: '+12% vs last week', color: 'text-slate-900' },
          { label: 'e-KYC Verified', value: '46,110', change: '94.2% automated', color: 'text-sky-700' },
          { label: 'mPolice Queue', value: '8,412', change: 'Avg 3.2 days SLA', color: 'text-amber-700' },
          { label: 'Printing Queued', value: '3,890', change: 'India Security Press', color: 'text-indigo-700' },
          { label: 'Delivered (Speed Post)', value: '32,105', change: '99.4% on-time', color: 'text-emerald-700' },
          { label: 'SLA At Risk', value: '14', change: 'Requires escalation', color: 'text-rose-700' },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block">{stat.label}</span>
            <span className={`font-mono text-xl font-black ${stat.color} block`}>{stat.value}</span>
            <span className="text-[9px] text-slate-500 font-medium block">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Main Grid: PSK Capacity Allocation & SLA Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: PSK Slot Capacity Allocator */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard glow="cyan" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">PSK Daily Slot Capacity Allocation</h3>
                <p className="text-xs text-slate-500 font-medium">Dynamically update Redis slot inventory pools across kendras</p>
              </div>
              <NeuButton
                variant="primary"
                size="sm"
                onClick={handleSaveQuotas}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                {saveSuccess ? 'Quotas Synchronized!' : 'Push Quotas to Redis'}
              </NeuButton>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {pskCapacities.map((psk) => (
                <div
                  key={psk.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{psk.name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-sky-700 font-bold shadow-2xs">
                        {psk.code}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                      {psk.city}, {psk.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCapacityChange(psk.id, -25)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-black text-sky-800 min-w-[45px] text-center">
                      {psk.capacity}
                    </span>
                    <button
                      onClick={() => handleCapacityChange(psk.id, +25)}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right 5 Columns: SLA Radar & Escalation Feed */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard glow="amber" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">SLA Breach Radar</h3>
                <p className="text-[10px] text-slate-500 font-medium">Applications approaching 30-day Tatkaal limit</p>
              </div>
              <StatusBadge variant="rose" size="sm">
                2 Critical
              </StatusBadge>
            </div>

            <div className="space-y-2.5">
              {[
                { file: 'BP-2026-192014', applicant: 'Kavita Menon', psk: 'PSK Chennai', daysLeft: '1 day left', stage: 'Police Verification Pending' },
                { file: 'BP-2026-881920', applicant: 'Tanmay Roy', psk: 'PSK Kolkata', daysLeft: '2 days left', stage: 'Counter B Document Review' },
              ].map((item) => (
                <div key={item.file} className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{item.applicant}</span>
                    <span className="font-mono text-[10px] text-rose-700 font-extrabold">{item.daysLeft}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{item.file}</span>
                    <span className="text-slate-800 font-bold">{item.stage}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Override Button */}
            <div className="pt-2 border-t border-slate-100">
              <NeuButton variant="secondary" size="sm" className="w-full">
                Trigger National SLA Escalation Workflow
              </NeuButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
