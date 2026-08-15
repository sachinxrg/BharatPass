'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CountdownWidget } from '@/components/ui/CountdownWidget';
import { NeuButton } from '@/components/ui/NeuButton';
import { PassportApplication, STAGE_LABELS, STAGE_ORDER } from '@/types/application';
import { Shield, Sparkles, CheckCircle2, QrCode, FileDown, ArrowUpRight, Eye, X } from 'lucide-react';
import Link from 'next/link';

interface ApplicationHeroWidgetProps {
  application: PassportApplication;
}

export function ApplicationHeroWidget({ application }: ApplicationHeroWidgetProps) {
  const [showPhysicalMockup, setShowPhysicalMockup] = useState(false);
  const currentStageIndex = STAGE_ORDER.indexOf(application.currentStage);
  const activeIndex = currentStageIndex === -1 ? 5 : currentStageIndex;

  return (
    <GlassCard glow="indigo" className="col-span-12 lg:col-span-8 flex flex-col justify-between relative">
      <div className="space-y-6 relative z-10">
        {/* Header with File Number & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-xs">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Active Application
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                  {application.fileNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {application.category} • {application.applicationType} Passport • RPO Bengaluru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge variant="amber" pulse size="md">
              {STAGE_LABELS[application.currentStage] || application.currentStage}
            </StatusBadge>
          </div>
        </div>

        {/* Live Holographic e-Passport Visualizer with Golden Emblem */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-3xl bg-slate-50/90 border border-slate-200/80 shadow-inner">
          {/* Biometric Passport Mockup */}
          <div className="md:col-span-5 relative group">
            <div className="w-full h-52 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-3.5 border border-amber-400/40 shadow-xl flex flex-col justify-between overflow-hidden relative text-white transition-all duration-300 group-hover:scale-[1.02]">
              {/* Holographic Laser Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity" />

              {/* Passport Header */}
              <div className="flex items-center justify-between border-b border-amber-400/30 pb-1.5">
                <span className="text-[10px] font-serif tracking-widest text-amber-300 uppercase font-bold">
                  REPUBLIC OF INDIA
                </span>
                {/* Contactless e-Passport Chip Logo */}
                <div className="w-5 h-4 rounded-sm border border-amber-300/80 bg-amber-400/20 flex items-center justify-center">
                  <div className="w-2.5 h-1.5 border-t border-b border-amber-300" />
                </div>
              </div>

              {/* Passport Body with Gold Ashoka Emblem */}
              <div className="flex items-center gap-3 my-auto">
                <div className="w-16 h-20 rounded-xl bg-slate-800 border border-white/20 p-1 flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-md">
                  <div className="w-10 h-10 rounded-full bg-slate-700 border border-cyan-400/60 flex items-center justify-center text-xs font-bold text-cyan-300">
                    AS
                  </div>
                  <span className="text-[7px] text-slate-300 mt-1 uppercase font-bold">VERIFIED</span>
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400 animate-pulse top-6" />
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase">Name / Nom</span>
                      <p className="font-bold text-white tracking-wide">SHARMA, AARAV R.</p>
                    </div>
                    {/* Golden National Emblem */}
                    <img
                      src="/images/emblem.png"
                      alt="National Emblem"
                      className="w-5 h-7 object-contain opacity-90 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase">DOB</span>
                      <p className="font-mono text-slate-200">15/08/1996</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] uppercase">Gender</span>
                      <p className="font-mono text-slate-200">M</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase">Passport No (Queued)</span>
                    <p className="font-mono text-cyan-300 font-bold">Z••••••92</p>
                  </div>
                </div>
              </div>

              {/* Machine Readable Zone (MRZ) */}
              <div className="font-mono text-[7px] text-amber-200/80 tracking-widest truncate pt-1 border-t border-amber-400/20">
                P&lt;INDSHARMA&lt;&lt;AARAV&lt;RAJESH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </div>
            </div>

            {/* Quick Preview Physical Passport button */}
            <button
              onClick={() => setShowPhysicalMockup(true)}
              className="mt-2 text-[11px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              View Physical Booklet Cutout
            </button>
          </div>

          {/* Quick Metrics & Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Application Fee</span>
                <span className="font-bold text-emerald-600 text-base">₹{application.feeAmount}</span>
                <span className="text-[9px] text-emerald-600 block font-semibold">✓ Paid Online (Razorpay)</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Biometric Capture</span>
                <span className="font-bold text-sky-600 text-base">Completed</span>
                <span className="text-[9px] text-slate-500 block">Counter A (PSK Lalbagh)</span>
              </div>
            </div>

            <CountdownWidget targetDate={application.slaDeadline} label="Guaranteed SLA Countdown" />
          </div>
        </div>

        {/* Real-Time Lifecycle Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Stage {activeStageNum(application.currentStage)} of 7: {STAGE_LABELS[application.currentStage]}
            </span>
            <span className="font-mono text-sky-600 font-bold">
              {Math.round(((activeStageNum(application.currentStage)) / 7) * 100)}% Complete
            </span>
          </div>
          <ProgressBar
            currentStep={activeStageNum(application.currentStage)}
            totalSteps={7}
            labels={['Apply', 'e-KYC', 'Biometrics', 'mPolice', 'Granting', 'Print', 'Dispatch']}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-4 border-t border-slate-100 relative z-10">
        <div className="flex items-center gap-2">
          <Link href="/track">
            <NeuButton size="sm" variant="secondary" leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Live Stream Tracker
            </NeuButton>
          </Link>
          <Link href="/documents">
            <NeuButton size="sm" variant="ghost" leftIcon={<FileDown className="w-3.5 h-3.5" />}>
              View Annexures &amp; OCR
            </NeuButton>
          </Link>
        </div>

        <Link href="/book-slot">
          <NeuButton size="sm" variant="primary" leftIcon={<QrCode className="w-3.5 h-3.5" />}>
            Appointment Pass
          </NeuButton>
        </Link>
      </div>

      {/* Physical Passport Booklet Modal */}
      {showPhysicalMockup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-black text-slate-900">Physical e-Passport Booklet</h3>
              </div>
              <button
                onClick={() => setShowPhysicalMockup(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2">
              <img
                src="/images/PassportInHand.png"
                alt="Passport In Hand"
                className="max-h-full max-w-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium">
              36-Page ICAO 9303 Standard Biometric Passport issued by India Security Press (Nashik).
            </div>

            <div className="flex justify-end">
              <NeuButton variant="primary" size="sm" onClick={() => setShowPhysicalMockup(false)}>
                Close Preview
              </NeuButton>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function activeStageNum(stage: string): number {
  switch (stage) {
    case 'INITIATED': return 1;
    case 'EKYC_VERIFIED': return 2;
    case 'DOCUMENTS_UPLOADED': return 2;
    case 'APPOINTMENT_BOOKED': return 3;
    case 'PSK_APPOINTMENT_COMPLETED': return 3;
    case 'PVS_DISPATCHED': return 4;
    case 'POLICE_VERIFIED': return 4;
    case 'GRANTED': return 5;
    case 'PRINTING_QUEUED': return 6;
    case 'DISPATCHED_SPEED_POST': return 7;
    case 'DELIVERED': return 7;
    default: return 3;
  }
}
