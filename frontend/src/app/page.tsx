'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuInput } from '@/components/ui/NeuInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  ShieldCheck, 
  Fingerprint, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Lock, 
  UploadCloud, 
  CheckCircle2, 
  KeyRound, 
  FileText,
  Calendar,
  Radio,
  Sliders,
  ChevronRight,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();

  const [authMode, setAuthMode] = useState<'otp' | 'ekyc'>('otp');
  const [aadhaarNumber, setAadhaarNumber] = useState('999988889012');
  const [txnId, setTxnId] = useState<string | null>(null);
  const [otp, setOtp] = useState('123456');
  const [shareCode, setShareCode] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'enter_aadhaar' | 'enter_otp'>('enter_aadhaar');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await api.generateOtp(aadhaarNumber);
      setTxnId(res.txnId);
      setStep('enter_otp');
      setStatusMsg(res.message);
    } catch {
      setStatusMsg('Failed to send OTP. Try mock OTP 123456');
      setStep('enter_otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await api.verifyOtp(txnId || 'mock-txn', otp);
      login(res);
      router.push('/dashboard');
    } catch {
      setStatusMsg('Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEkycUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg('Decrypting XML with share code ' + shareCode + ' & verifying digital signature...');
    setTimeout(() => {
      quickDemoLogin('ROLE_CITIZEN');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Floating e-Passports Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left 7 Columns: Hero Typography & CTA */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-700 text-xs font-bold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Modernizing Indian Passport Seva Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Passport Issuance,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 bg-clip-text text-transparent">
              Re-engineered
            </span>{' '}
            for Scale.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-medium">
            Passwordless Aadhaar e-KYC, zero double-booking distributed slot reservations, AI
            document pre-validation, and live mPolice verification tracking in one unified portal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#auth-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 cursor-pointer"
            >
              Authenticate with Aadhaar
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs transition-all hover:-translate-y-0.5"
            >
              Explore Citizen Command Center
            </Link>
          </div>
        </div>

        {/* Right 5 Columns: 3D Floating Passports Showcase Widget */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Ambient Glow Backdrop */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-sky-400/20 via-indigo-500/15 to-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative group cursor-pointer">
            {/* Animated Piled Passports Image */}
            <div className="relative w-80 sm:w-96 h-72 sm:h-80 flex items-center justify-center animate-float transition-transform duration-500 group-hover:scale-105">
              <img
                src="/images/piledpassports.png"
                alt="Republic of India e-Passports"
                className="max-w-full max-h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)]"
              />
            </div>

            {/* Floating Glass Badges around the passports */}
            <div className="absolute -top-2 -left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-fast">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-900">Biometric ICAO 9303</span>
                <span className="text-[10px] text-emerald-600 font-bold">Contactless Chip Compliant</span>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-2 p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-lg flex items-center gap-2.5 animate-float-fast" style={{ animationDelay: '1.5s' }}>
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-900">50M+ e-Passports</span>
                <span className="text-[10px] text-slate-500 font-bold">ISP Nashik Integrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Stat Cards with Glowing Aura Leaks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Peak Concurrency */}
        <div className="aura-cyan p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] text-center space-y-1 transition-all hover:-translate-y-1 duration-200">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
            PEAK CONCURRENCY
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 block">
            50,000+
          </span>
          <span className="text-[10px] text-slate-400 block font-semibold">Req / sec</span>
        </div>

        {/* Card 2: Slot Booking SLA */}
        <div className="aura-emerald p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] text-center space-y-1 transition-all hover:-translate-y-1 duration-200">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
            SLOT BOOKING SLA
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-600 block">
            &lt;500ms
          </span>
          <span className="text-[10px] text-slate-400 block font-semibold">P99 Redisson Lock</span>
        </div>

        {/* Card 3: Aadhaar Data Vault */}
        <div className="aura-amber p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] text-center space-y-1 transition-all hover:-translate-y-1 duration-200">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
            AADHAAR DATA VAULT
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 block">
            AES-256
          </span>
          <span className="text-[10px] text-slate-400 block font-semibold">UIDAI Compliant</span>
        </div>

        {/* Card 4: Double Bookings */}
        <div className="aura-rose p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.04)] text-center space-y-1 transition-all hover:-translate-y-1 duration-200">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block">
            DOUBLE BOOKINGS
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-black text-orange-600 block">
            0.00%
          </span>
          <span className="text-[10px] text-slate-400 block font-semibold">Guaranteed</span>
        </div>
      </div>

      {/* Main Interactive Login & Portal Switcher */}
      <div id="auth-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
        {/* Left 7 Columns: Passwordless Authentication Terminal */}
        <GlassCard className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xs">
                <Fingerprint className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Passwordless Identity Gateway</h2>
                <p className="text-xs text-slate-500 font-medium">UIDAI Auth API v2.5 Simulation</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setStep('enter_aadhaar'); }}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'otp' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Simulation Auth
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('ekyc')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'ekyc' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Offline e-KYC (.zip)
              </button>
            </div>
          </div>

          {authMode === 'otp' ? (
            step === 'enter_aadhaar' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <NeuInput
                  label="12-Digit Aadhaar Number"
                  placeholder="999988889012"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  maxLength={12}
                  leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                  helperText="Raw Aadhaar numbers are never stored in relational tables per UIDAI Data Vault mandate."
                  required
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Demo preset: <strong>999988889012</strong></span>
                  <NeuButton type="submit" variant="primary" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Generate Secure OTP
                  </NeuButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-medium">
                  {statusMsg || `OTP sent to mobile linked with Aadhaar ending in ${aadhaarNumber.slice(-4)}`}
                </div>

                <NeuInput
                  label="Enter 6-Digit Verification Code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  helperText="Demo test code: 123456 (Valid for 10 minutes)"
                  required
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('enter_aadhaar')}
                    className="text-xs text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                  >
                    Change Aadhaar Number
                  </button>
                  <NeuButton type="submit" variant="emerald" isLoading={isLoading} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                    Verify &amp; Launch Command Center
                  </NeuButton>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleEkycUpload} className="space-y-4">
              <div className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-6 text-center space-y-2 bg-sky-50/50 cursor-pointer transition-colors">
                <UploadCloud className="w-8 h-8 text-sky-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Upload Aadhaar Offline e-KYC (.zip)</p>
                <p className="text-xs text-slate-500 font-medium">Digitally signed XML payload from UIDAI myAadhaar portal</p>
              </div>

              <NeuInput
                label="4-Digit Share Code"
                placeholder="1234"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                maxLength={4}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                helperText="Used to decrypt the offline XML payload"
                required
              />

              <div className="flex justify-end pt-2">
                <NeuButton type="submit" variant="primary" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Decrypt &amp; Authenticate
                </NeuButton>
              </div>
            </form>
          )}

          {/* UIDAI Vault Guarantee */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Aadhaar Vault Service:</strong> AES-256-GCM encryption with master key rotation. Output reference key only.
            </span>
          </div>
        </GlassCard>

        {/* Right 5 Columns: Direct Portal Switcher */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Direct Portal Switcher</h3>
                <p className="text-[11px] text-slate-500 font-medium">Jump directly into any stakeholder role</p>
              </div>
              <StatusBadge variant="cyan" size="sm">
                4 Portals
              </StatusBadge>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => { quickDemoLogin('ROLE_CITIZEN'); router.push('/dashboard'); }}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 flex items-center justify-between text-left transition-all group shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Citizen Command Center</span>
                    <span className="text-[10px] text-slate-500">Bento Grid, biometric pass, slot radar</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { quickDemoLogin('ROLE_PSK_OFFICER'); router.push('/officer'); }}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 flex items-center justify-between text-left transition-all group shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Fingerprint className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">PSK Officer Counter Portal</span>
                    <span className="text-[10px] text-slate-500">Biometric verification &amp; granting</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { quickDemoLogin('ROLE_POLICE_OFFICER'); router.push('/police'); }}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-left transition-all group shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">mPolice Field Officer App</span>
                    <span className="text-[10px] text-slate-500">GPS geo-tagging &amp; digital report signoff</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { quickDemoLogin('ROLE_RPO_ADMIN'); router.push('/admin'); }}
                className="w-full p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 flex items-center justify-between text-left transition-all group shadow-2xs hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sliders className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">RPO Admin &amp; Capacity Control</span>
                    <span className="text-[10px] text-slate-500">Slot inventory, SLA metrics, pipeline health</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
