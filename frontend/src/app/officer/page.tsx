'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  UserCheck, 
  Fingerprint, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  FileText,
  Search,
  ShieldAlert,
  Award
} from 'lucide-react';

export default function PskOfficerPortal() {
  const [selectedApp, setSelectedApp] = useState({
    fileNumber: 'BP-2026-894210',
    applicantName: 'Aarav Rajesh Sharma',
    dob: '1996-08-15',
    category: 'NORMAL',
    slotTime: '09:30 AM',
    counter: 'Counter A (Biometrics & Granting)',
    biometrics: {
      photo: 'Captured (Grade A)',
      iris: 'Left & Right Iris Verified',
      fingerprints: '10 Rolled Prints Captured',
    },
    ocrCrossCheck: {
      nameMatch: '99.4% (UIDAI vs PAN Match)',
      dobMatch: '100% (Birth Certificate Match)',
      addressMatch: 'Exact Match with Electricity Bill',
    },
  });

  const [granted, setGranted] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');

  const handleGrant = () => {
    setGranted(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with National Emblem */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
            <img src="/images/emblem.png" alt="National Emblem of India" className="w-7 h-10 object-contain" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Passport Seva Kendra (Counter A / B / C)</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">PSK Officer Granting Terminal</h1>
            <p className="text-xs text-slate-500 font-medium">
              Biometric verification, AI OCR cross-referencing, and final grant signoff for walk-in appointments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge variant="emerald" pulse size="sm">
            PSK Lalbagh (Bangalore) • Counter A
          </StatusBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Columns: Walk-in Queue */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard glow="cyan" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Today&apos;s Walk-in Queue</h3>
              <span className="font-mono text-xs text-emerald-700 font-bold">12 Pending</span>
            </div>

            <div className="space-y-2">
              {[
                { file: 'BP-2026-894210', name: 'Aarav Rajesh Sharma', time: '09:30 AM', active: true },
                { file: 'BP-2026-104921', name: 'Sneha Patel', time: '10:00 AM', active: false },
                { file: 'BP-2026-302194', name: 'Vikram Aditya Singh', time: '10:30 AM', active: false },
                { file: 'BP-2026-948102', name: 'Meera Nambiar', time: '11:00 AM', active: false },
              ].map((item) => (
                <div
                  key={item.file}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    item.active
                      ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm ring-2 ring-sky-300/40'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    <span className="font-mono text-[10px] text-sky-700 font-bold">{item.time}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5 font-medium">{item.file}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right 8 Columns: Biometric & AI Cross-Reference Evaluation */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard glow="indigo" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Applicant Case File</span>
                <h2 className="text-xl font-black text-slate-900">{selectedApp.applicantName}</h2>
                <span className="font-mono text-xs text-sky-700 font-bold">{selectedApp.fileNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge variant={granted ? 'emerald' : 'amber'} size="md">
                  {granted ? 'Passport Granted' : 'Biometric Review'}
                </StatusBadge>
              </div>
            </div>

            {/* Biometric Verification Box */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                Biometric Capture Verification
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs font-bold">Live Photo</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold block">
                    {selectedApp.biometrics.photo}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-bold">Iris Scanner</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold block">
                    {selectedApp.biometrics.iris}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Fingerprint className="w-4 h-4" />
                    <span className="text-xs font-bold">10 Fingerprints</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold block">
                    {selectedApp.biometrics.fingerprints}
                  </span>
                </div>
              </div>
            </div>

            {/* AI OCR Cross-Reference Comparison */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                AI Cross-Reference Validation
              </span>
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                {Object.entries(selectedApp.ocrCrossCheck).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-700 font-bold capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-emerald-700 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Granting Action */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
                Granting Officer Remarks
              </label>
              <textarea
                rows={2}
                placeholder="All original documents verified against e-KYC. Biometrics captured. Forwarded for police verification."
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full rounded-2xl bg-slate-100/90 border border-slate-200 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:bg-white"
              />

              <div className="flex justify-end gap-3 pt-2">
                <NeuButton variant="danger" size="sm" leftIcon={<XCircle className="w-4 h-4" />}>
                  Put On Hold / Impound
                </NeuButton>
                <NeuButton
                  variant="emerald"
                  size="md"
                  onClick={handleGrant}
                  disabled={granted}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {granted ? 'Passport Successfully Granted' : 'Grant Passport & Dispatch mPolice'}
                </NeuButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
