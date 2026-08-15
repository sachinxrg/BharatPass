'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSSE } from '@/hooks/useSSE';
import { PassportApplication, TimelineEvent, STAGE_ORDER, STAGE_LABELS } from '@/types/application';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CountdownWidget } from '@/components/ui/CountdownWidget';
import { 
  Radio, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  ArrowUpRight,
  Send,
  PackageCheck
} from 'lucide-react';

export default function TrackApplicationPage() {
  const [application, setApplication] = useState<PassportApplication | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time SSE Hook
  const { messages, isConnected } = useSSE(
    application ? `http://localhost:8080/api/v1/events/application/${application.appId}` : null
  );

  useEffect(() => {
    async function loadData() {
      try {
        const app = await api.getApplication('demo-app-1');
        const tl = await api.getTimeline('demo-app-1');
        setApplication(app);
        setTimeline(tl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Event-Driven SSE Status Pipeline</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Live Application Stream Tracker</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time audit log streaming with cryptographic actor verification across all issuance stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant={isConnected ? 'emerald' : 'amber'} pulse size="md">
            {isConnected ? 'SSE Live Connected' : 'Event Stream Synchronized'}
          </StatusBadge>
        </div>
      </div>

      {application && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Live State Machine & Event Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top State Machine Card */}
            <GlassCard glow="indigo" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 block">File Number</span>
                  <h2 className="text-xl font-mono font-black text-sky-700">{application.fileNumber}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Current Milestone</span>
                  <StatusBadge variant="amber" pulse size="md">
                    {STAGE_LABELS[application.currentStage]}
                  </StatusBadge>
                </div>
              </div>

              {/* Multi-Stage Visual Stepper */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  End-to-End Lifecycle Trajectory
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { name: '1. e-KYC Verified', stage: 'EKYC_VERIFIED', done: true },
                    { name: '2. Form & Payment', stage: 'PAYMENT_COMPLETED', done: true },
                    { name: '3. PSK Biometrics', stage: 'PSK_APPOINTMENT_COMPLETED', done: true },
                    { name: '4. mPolice Field Beat', stage: 'PVS_DISPATCHED', done: true, active: true },
                    { name: '5. Passport Granting', stage: 'GRANTED', done: false },
                    { name: '6. Printing Queued', stage: 'PRINTING_QUEUED', done: false },
                    { name: '7. Speed Post Dispatch', stage: 'DISPATCHED_SPEED_POST', done: false },
                    { name: '8. Handover & Delivery', stage: 'DELIVERED', done: false },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs flex flex-col justify-between ${
                        item.active
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs ring-2 ring-amber-200'
                          : item.done
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold">{item.name}</span>
                        {item.done && !item.active && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {item.active && <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
                      </div>
                      <span className="text-[9px] font-semibold opacity-75">
                        {item.active ? 'In Progress' : item.done ? 'Completed' : 'Queued'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Granular Timeline Audit Trail */}
            <GlassCard glow="cyan" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Immutable Event Stream Audit Log</h3>
                <span className="text-[10px] font-mono text-slate-500 font-bold">{timeline.length} Milestones Recorded</span>
              </div>

              <div className="space-y-3.5 relative pl-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {timeline.map((event) => (
                  <div key={event.eventId} className="relative flex items-start gap-3 text-xs">
                    <span className="w-3 h-3 rounded-full mt-1.5 shrink-0 bg-sky-500 shadow-[0_0_8px_rgba(2,132,199,0.5)]" />
                    <div className="flex-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{event.status}</span>
                        <span className="font-mono text-[10px] text-sky-700 font-bold">
                          {new Date(event.createdAt).toLocaleTimeString()} • {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                        <span>Actor Role: <strong className="text-slate-800 font-bold">{event.actorRole}</strong></span>
                        <span>Stage ID: <strong className="text-slate-800 font-bold">{event.stage}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right 4 Columns: SLA Countdown & Physical Passport Delivery Card */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard glow="cyan" className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                SLA Countdown &amp; Logistics
              </h3>

              <CountdownWidget targetDate={application.slaDeadline} label="Guaranteed Delivery SLA" />

              {/* Physical Passport Cutout Preview Card */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">Printed e-Passport</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold font-mono">
                    36 Pages
                  </span>
                </div>

                <div className="w-full h-36 rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2 group cursor-pointer shadow-inner">
                  <img
                    src="/images/PassportInHand.png"
                    alt="Physical Passport Preview"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Speed Post No:</span>
                    <span className="text-slate-900 font-mono font-bold">EM920148921IN</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Address:</span>
                    <span className="text-slate-900 font-bold">Indiranagar, Bangalore 560038</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Expected Handover:</span>
                    <span className="text-emerald-700 font-bold">22 Aug 2026</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
