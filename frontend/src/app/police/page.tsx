'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  User, 
  Send,
  Building
} from 'lucide-react';

export default function PoliceVerificationPortal() {
  const [activeCase, setActiveCase] = useState({
    pvId: 'pv-ind-9901',
    fileNumber: 'BP-2026-894210',
    applicantName: 'Aarav Rajesh Sharma',
    address: 'Flat 402, Skyline Residency, 100ft Road, Indiranagar, Bengaluru, 560038',
    policeStation: 'Indiranagar Police Station',
    beatId: 'BEAT-IND-04',
    officer: 'SI Rajesh Kumar (Badge #KA-BLR-2145)',
  });

  const [gps, setGps] = useState({
    lat: 12.9716,
    lng: 77.5946,
    accuracy: '4.2 meters',
    locked: true,
  });

  const [checklist, setChecklist] = useState({
    residesAtAddress: true,
    stayDurationOver1Yr: true,
    neighborWitnessesRecorded: true,
    noCriminalRecordCctns: true,
    photoIdPhysicallyVerified: true,
  });

  const [verdict, setVerdict] = useState<'CLEAR' | 'ADVERSE' | 'INCOMPLETE'>('CLEAR');
  const [remarks, setRemarks] = useState('Physical beat visit conducted. Applicant found residing at address. Neighbors verified bona fides. CCTNS clear.');
  const [signature, setSignature] = useState('DIG-SIG-SI-RAJESH-KUMAR-2145-BLR');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitPoliceReport({
        pvId: activeCase.pvId,
        gpsLat: gps.lat,
        gpsLng: gps.lng,
        checklist,
        verdict,
        signature,
        remarks,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
            <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>mPolice Mobile Field Verification Engine</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Beat Officer Inspection Terminal</h1>
            <p className="text-xs text-slate-500 font-medium">
              GPS geo-tagged digital inspection checklists, CCTNS background checks, and instant signoff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs font-mono shadow-xs">
            <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span className="text-slate-700 font-bold">GPS Locked ({gps.accuracy})</span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="max-w-2xl mx-auto">
          <GlassCard glow="emerald" className="text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">mPolice Verification Report Submitted!</h2>
              <p className="text-xs text-slate-600 font-medium">
                The report has been digitally signed and timestamped. Passport lifecycle has advanced to <strong>POLICE_VERIFIED</strong>.
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Verdict:</span>
                <span className="text-emerald-700 font-bold">{verdict}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="text-sky-700 font-bold">{gps.lat}, {gps.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Officer Signature:</span>
                <span className="text-slate-800 font-bold">{signature}</span>
              </div>
            </div>

            <NeuButton
              variant="primary"
              onClick={() => setSubmitted(false)}
            >
              Process Next Assigned Beat Case
            </NeuButton>
          </GlassCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Columns: Assigned Cases Queue */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard glow="emerald" className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">Assigned Beat Queue</h3>
                <span className="font-mono text-xs text-amber-700 font-bold">1 Active</span>
              </div>

              <div className="space-y-2">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-slate-900 space-y-1 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">{activeCase.applicantName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                      TODAY
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-sky-800 font-bold block">{activeCase.fileNumber}</span>
                  <span className="text-[10px] text-slate-600 line-clamp-1 block font-medium">{activeCase.address}</span>
                </div>
              </div>

              {/* Officer Details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Beat Officer</span>
                <p className="font-bold text-slate-900">{activeCase.officer}</p>
                <p className="text-[10px] text-slate-500 font-medium">{activeCase.policeStation} • Beat #{activeCase.beatId}</p>
              </div>
            </GlassCard>
          </div>

          {/* Right 8 Columns: Digital Verification Checklist & Submission */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard glow="cyan" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Active Verification Subject</span>
                  <h2 className="text-xl font-black text-slate-900">{activeCase.applicantName}</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{activeCase.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-right font-mono text-[11px] shadow-2xs">
                    <span className="text-[9px] text-slate-400 block font-sans font-semibold">Geo-Coordinates</span>
                    <span className="text-sky-700 font-bold">{gps.lat} N, {gps.lng} E</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Checklist Items */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  Field Officer Digital Signoff Checklist
                </span>

                <div className="space-y-2">
                  {[
                    { key: 'residesAtAddress', label: '1. Applicant physically confirmed residing at declared address' },
                    { key: 'stayDurationOver1Yr', label: '2. Period of continuous stay verified to be > 1 year' },
                    { key: 'neighborWitnessesRecorded', label: '3. Two independent neighbor witness statements recorded & signed' },
                    { key: 'noCriminalRecordCctns', label: '4. Criminal background query verified clean against CCTNS database' },
                    { key: 'photoIdPhysicallyVerified', label: '5. Physical Aadhaar / Voter ID original inspected and verified' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer select-none transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={checklist[item.key as keyof typeof checklist]}
                        onChange={(e) =>
                          setChecklist({ ...checklist, [item.key]: e.target.checked })
                        }
                        className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                      />
                      <span className="text-xs text-slate-800 font-semibold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Final Verdict Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
                  Verification Verdict
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CLEAR', label: 'Clear Report (Recommended)', color: 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300/40' },
                    { id: 'INCOMPLETE', label: 'Incomplete / Needs Visit', color: 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300/40' },
                    { id: 'ADVERSE', label: 'Adverse Report (Reject)', color: 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-300/40' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVerdict(item.id as any)}
                      className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all ${
                        verdict === item.id ? `${item.color} shadow-xs` : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks & Signature */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
                    Beat Officer Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/90 border border-slate-200 px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Digital Signature Token:</span>
                  <span className="font-mono text-emerald-700 font-bold">{signature}</span>
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <NeuButton
                  variant="emerald"
                  size="md"
                  onClick={handleSubmit}
                  isLoading={submitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Sign &amp; Transmit Verification Report to RPO
                </NeuButton>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
