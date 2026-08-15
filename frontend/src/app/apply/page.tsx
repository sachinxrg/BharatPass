'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuInput } from '@/components/ui/NeuInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  FileText, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ApplyPassportPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<'FRESH' | 'RENEWAL' | 'REISSUE' | 'DIPLOMATIC'>('FRESH');
  const [category, setCategory] = useState<'NORMAL' | 'TATKAAL' | 'SUPER_TATKAAL'>('NORMAL');
  const [bookletSize, setBookletSize] = useState<'36' | '60'>('36');

  // Form Fields (Demographic fields locked from e-KYC)
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Aarav Rajesh Sharma',
    dob: '1996-08-15',
    gender: 'MALE',
    placeOfBirth: 'Bengaluru',
    stateOfBirth: 'Karnataka',
    maritalStatus: 'SINGLE',
    employmentType: 'PRIVATE',
    panNumber: 'ABCPS1234K',
    voterId: '',
    presentAddress: 'Flat 402, Skyline Residency, 100ft Road, Indiranagar, Bengaluru, 560038',
    policeStation: 'Indiranagar Police Station',
    emergencyName: 'Rajesh Sharma',
    emergencyPhone: '+91 98765 43210',
    declarationAgreed: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState<{ appId: string; fileNumber: string } | null>(null);

  const feeAmount = (category === 'TATKAAL' ? 3500 : category === 'SUPER_TATKAAL' ? 5000 : 1500) + (bookletSize === '60' ? 500 : 0);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createApplication({
        applicationType: appType,
        category: category,
        formData: formData,
      });
      setCreatedResult({ appId: res.appId, fileNumber: res.fileNumber });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdResult) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <GlassCard glow="emerald" className="text-center space-y-6 p-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Application Successfully Initiated!</h1>
            <p className="text-sm text-slate-600 font-medium">
              Your application has been registered in the Passport Seva National Ledger.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-left">
            <div className="flex justify-between text-xs text-slate-500">
              <span>File Number:</span>
              <span className="text-sky-600 font-bold text-sm">{createdResult.fileNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Category:</span>
              <span className="text-slate-800 font-bold">{category} ({appType})</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Fee Calculated:</span>
              <span className="text-emerald-600 font-bold">₹{feeAmount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <NeuButton
              variant="primary"
              onClick={() => router.push('/documents')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Upload Supporting Documents &amp; AI Check
            </NeuButton>
            <NeuButton
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Go to Command Center
            </NeuButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Dynamic Schema Engine v2.0</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">New Passport Application</h1>
        <p className="text-sm text-slate-600 font-medium">
          Demographic fields auto-populated from Aadhaar e-KYC payload with cryptographic integrity lock.
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentStep={step - 1}
        totalSteps={4}
        labels={['Type & Category', 'Demographics (Locked)', 'Address & Police Beat', 'Declaration & Submit']}
      />

      {/* Form Container */}
      <GlassCard glow="indigo" className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: Application Category & Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">1. Select Application Category &amp; Booklet</h2>
              <p className="text-xs text-slate-500 font-medium">Choose processing speed and booklet specifications</p>
            </div>

            {/* Application Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                Application Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'FRESH', label: 'Fresh Passport', desc: 'First time applicant' },
                  { id: 'RENEWAL', label: 'Re-issue / Renewal', desc: 'Expired or expiring' },
                  { id: 'REISSUE', label: 'Lost / Damaged', desc: 'Replacement issue' },
                  { id: 'DIPLOMATIC', label: 'Official / Diplomatic', desc: 'Govt deputation' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAppType(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      appType === item.id
                        ? 'bg-sky-50 border-sky-400 shadow-sm text-sky-900 ring-2 ring-sky-300/40'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs block text-slate-900">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Tatkaal */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                Scheme / Urgency
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'NORMAL', label: 'Normal Scheme', time: '15-30 Days SLA', fee: '₹1,500' },
                  { id: 'TATKAAL', label: 'Tatkaal Scheme', time: '3-7 Days SLA', fee: '₹3,500' },
                  { id: 'SUPER_TATKAAL', label: 'Super-Tatkaal (Emergencies)', time: '24-48 Hours SLA', fee: '₹5,000' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      category === item.id
                        ? 'bg-cyan-50 border-cyan-400 shadow-sm text-cyan-900 ring-2 ring-cyan-300/40'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-900">{item.label}</span>
                      <span className="font-mono text-xs text-emerald-600 font-bold">{item.fee}</span>
                    </div>
                    <span className="text-[10px] text-cyan-700 font-bold block mt-1">{item.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Booklet Pages */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                Type of Passport Booklet
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: '36', label: '36 Pages (Standard Traveler)', fee: 'Included' },
                  { id: '60', label: '60 Pages (Frequent Flyer)', fee: '+₹500 surcharge' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBookletSize(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      bookletSize === item.id
                        ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-300/40'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block">{item.fee}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Demographic Details (e-KYC Locked) */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">2. Applicant Demographics</h2>
                <p className="text-xs text-slate-500 font-medium">e-KYC verified fields are locked to prevent identity tampering</p>
              </div>
              <StatusBadge variant="emerald" size="sm" icon={<Lock className="w-3 h-3 mr-1" />}>
                UIDAI Locked
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeuInput
                label="Full Name (as in Aadhaar)"
                value={formData.fullName}
                readOnly
                rightIcon={<Lock className="w-4 h-4 text-emerald-600" />}
                className="bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
              />

              <NeuInput
                label="Date of Birth"
                value={formData.dob}
                readOnly
                rightIcon={<Lock className="w-4 h-4 text-emerald-600" />}
                className="bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
              />

              <NeuInput
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                required
              />

              <NeuInput
                label="State / UT"
                value={formData.stateOfBirth}
                onChange={(e) => setFormData({ ...formData, stateOfBirth: e.target.value })}
                required
              />

              <NeuInput
                label="PAN Number (Optional/Non-ECR)"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              />

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full rounded-2xl bg-slate-100/90 border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:bg-white"
                >
                  <option value="PRIVATE">Private Sector</option>
                  <option value="GOVT">Government / PSU</option>
                  <option value="SELF">Self Employed / Business</option>
                  <option value="STUDENT">Student</option>
                  <option value="HOMEMAKER">Homemaker</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Present Residential Address & Police Jurisdiction */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">3. Address &amp; Police Station Jurisdiction</h2>
              <p className="text-xs text-slate-500 font-medium">Required for field officer mPolice verification dispatch</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  Present Residential Address
                </label>
                <textarea
                  rows={3}
                  value={formData.presentAddress}
                  onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                  className="w-full rounded-2xl bg-slate-100/90 border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NeuInput
                  label="Police Station Jurisdiction"
                  value={formData.policeStation}
                  onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                  helperText="Nearest beat station handling your area"
                  required
                />

                <NeuInput
                  label="Emergency Contact Name"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  required
                />

                <NeuInput
                  label="Emergency Contact Mobile"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Self-Declaration & Fee Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">4. Final Declaration &amp; Submission</h2>
              <p className="text-xs text-slate-500 font-medium">Review total calculated fees and legal declarations</p>
            </div>

            {/* Summary Box */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Applicant:</span>
                <span className="text-slate-900 font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Application Type:</span>
                <span className="text-sky-700 font-bold">{appType} ({category})</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Police Beat Station:</span>
                <span className="text-slate-900 font-mono font-bold">{formData.policeStation}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base font-extrabold text-slate-900">Total Online Fee:</span>
                <span className="font-mono text-xl font-black text-emerald-600">₹{feeAmount}</span>
              </div>
            </div>

            {/* Legal Declaration Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer select-none shadow-xs">
              <input
                type="checkbox"
                checked={formData.declarationAgreed}
                onChange={(e) => setFormData({ ...formData, declarationAgreed: e.target.checked })}
                className="w-4 h-4 rounded mt-0.5 accent-sky-500 cursor-pointer"
                required
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                I hereby declare that I am a citizen of India by birth/descent/registration. I have not acquired citizenship of any other country, and no criminal proceedings are pending against me in any court of law under Passports Act, 1967.
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          {step > 1 ? (
            <NeuButton
              type="button"
              variant="secondary"
              onClick={handlePrev}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Step
            </NeuButton>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <NeuButton
              type="button"
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </NeuButton>
          ) : (
            <NeuButton
              type="button"
              variant="emerald"
              onClick={handleSubmit}
              disabled={!formData.declarationAgreed}
              isLoading={submitting}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit &amp; Generate File Number
            </NeuButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
