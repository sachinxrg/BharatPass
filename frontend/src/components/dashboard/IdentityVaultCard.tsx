'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeuToggle } from '@/components/ui/NeuToggle';
import { ShieldCheck, Lock, Unlock, Key, Fingerprint, Database, CheckCircle2, RefreshCw } from 'lucide-react';

export function IdentityVaultCard() {
  const [biometricLocked, setBiometricLocked] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const handleKeyRotation = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1200);
  };

  return (
    <GlassCard glow="cyan" className="col-span-12 lg:col-span-4 flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center shadow-xs">
            <Fingerprint className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Identity Vault</h3>
            <span className="text-[10px] text-slate-500 font-medium">UIDAI Data Vault Mandate</span>
          </div>
        </div>
        <StatusBadge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3 mr-1" />}>
          Verified
        </StatusBadge>
      </div>

      {/* Aadhaar Vault Compliance Box */}
      <div className="space-y-3">
        {/* Masked Aadhaar Display */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">Aadhaar Token</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono font-bold">
              AES-256-GCM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-base font-black text-slate-900 tracking-wider">
              •••• •••• 9012
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">Offline e-KYC OK</span>
          </div>
          <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Reference Key (UUIDv4):</span>
            <span className="font-mono text-slate-700 font-bold truncate max-w-[120px]">
              e8b2-4819-bf91
            </span>
          </div>
        </div>

        {/* DigiLocker Status */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">DigiLocker Linked</span>
              <span className="text-[10px] text-slate-500">Class X, PAN, Birth Cert</span>
            </div>
          </div>
          <StatusBadge variant="indigo" size="sm">
            Linked
          </StatusBadge>
        </div>

        {/* Biometric Lock Toggle */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <NeuToggle
            checked={biometricLocked}
            onChange={setBiometricLocked}
            label="UIDAI Biometric Lock"
            description={biometricLocked ? 'Biometrics locked for security' : 'Biometrics temporarily unlocked'}
          />
        </div>
      </div>

      {/* Master Key Rotation Status */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Key className="w-3.5 h-3.5 text-amber-500" />
          <span>Key Rotation: <strong>master-v1</strong></span>
        </div>
        <button
          onClick={handleKeyRotation}
          disabled={isRotating}
          className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
          {isRotating ? 'Rotating...' : 'Rotate Key'}
        </button>
      </div>
    </GlassCard>
  );
}
