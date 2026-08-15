'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { FileCheck, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, Camera } from 'lucide-react';
import Link from 'next/link';

export function DocumentHealthWidget() {
  const readinessScore = 94;

  const checks = [
    { label: 'Passport Photo Biometric Spec', passed: true, score: '98%' },
    { label: 'Aadhaar e-KYC Offline XML', passed: true, score: '100%' },
    { label: 'PAN Card OCR Bounding Match', passed: true, score: '92%' },
    { label: 'Non-ECR School Certificate', passed: true, score: '86%' },
  ];

  return (
    <GlassCard glow="emerald" className="col-span-12 lg:col-span-4 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">AI Document Health</h3>
              <span className="text-[10px] text-slate-500 font-medium">Tesseract + Tika Pre-Validation</span>
            </div>
          </div>
          <StatusBadge variant="emerald" size="sm">
            Ready for PSK
          </StatusBadge>
        </div>

        {/* Big Score Gauge Meter */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-xs font-black text-slate-900">{readinessScore}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 block">Biometric Grade A</span>
              <span className="text-[10px] text-slate-500 font-medium">0 Rejection Risk at PSK</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Pre-Check SLA</span>
            <span className="font-mono text-xs font-bold text-sky-700">1.8s Speed</span>
          </div>
        </div>

        {/* Checklist breakdown */}
        <div className="space-y-1.5 text-[11px]">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-800 font-semibold">{c.label}</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-bold">{c.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Link href="/documents">
          <NeuButton size="sm" variant="secondary" className="w-full justify-between" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
            Upload Additional Annexures
          </NeuButton>
        </Link>
      </div>
    </GlassCard>
  );
}
