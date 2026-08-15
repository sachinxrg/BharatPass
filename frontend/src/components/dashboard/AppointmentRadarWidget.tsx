'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { Calendar, Radio, MapPin, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function AppointmentRadarWidget() {
  const [selectedPsk, setSelectedPsk] = useState('PSK Lalbagh');

  // Heatmap slot samples
  const slots = [
    { time: '09:00', available: 14, status: 'high' },
    { time: '09:30', available: 4, status: 'medium' },
    { time: '10:00', available: 0, status: 'full' },
    { time: '10:30', available: 18, status: 'high' },
    { time: '11:00', available: 8, status: 'medium' },
    { time: '11:30', available: 2, status: 'low' },
    { time: '12:00', available: 12, status: 'high' },
    { time: '12:30', available: 0, status: 'full' },
  ];

  return (
    <GlassCard glow="cyan" className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4 text-cyan-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Appointment Radar</h3>
              <span className="text-[10px] text-slate-500 font-medium">Real-Time PSK Slot Heatmap</span>
            </div>
          </div>
          <StatusBadge variant="cyan" size="sm" pulse>
            Live Feed
          </StatusBadge>
        </div>

        {/* Selected PSK Info */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="font-bold">{selectedPsk}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-extrabold">58 Slots Open</span>
        </div>

        {/* Slot Grid Heatmap */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
            Morning Window (Tomorrow)
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {slots.map((slot) => {
              const bg =
                slot.status === 'high'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : slot.status === 'medium'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : slot.status === 'low'
                  ? 'bg-orange-50 border-orange-300 text-orange-800'
                  : 'bg-slate-100 border-slate-200 text-slate-400 line-through';

              return (
                <div
                  key={slot.time}
                  className={`p-2 rounded-xl border text-center font-mono text-[10px] transition-all hover:scale-105 cursor-pointer shadow-2xs ${bg}`}
                >
                  <div className="font-bold">{slot.time}</div>
                  <div className="text-[9px] opacity-80">{slot.available > 0 ? `${slot.available} left` : 'FULL'}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concurrency Guard Status */}
        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[10px] flex items-center justify-between text-indigo-900 font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Redisson Distributed Lease Guard Active</span>
          </div>
          <span className="font-mono text-sky-700 font-bold">300s TTL</span>
        </div>
      </div>

      <div className="pt-2">
        <Link href="/book-slot">
          <NeuButton size="sm" variant="secondary" className="w-full justify-between" rightIcon={<ChevronRight className="w-4 h-4" />}>
            Explore All 10 PSKs &amp; Book
          </NeuButton>
        </Link>
      </div>
    </GlassCard>
  );
}
