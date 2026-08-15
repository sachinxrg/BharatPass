'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { PassportApplication } from '@/types/application';
import { ApplicationHeroWidget } from '@/components/dashboard/ApplicationHeroWidget';
import { IdentityVaultCard } from '@/components/dashboard/IdentityVaultCard';
import { AppointmentRadarWidget } from '@/components/dashboard/AppointmentRadarWidget';
import { PoliceVerificationStreamWidget } from '@/components/dashboard/PoliceVerificationStreamWidget';
import { DocumentHealthWidget } from '@/components/dashboard/DocumentHealthWidget';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Sparkles, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [application, setApplication] = useState<PassportApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const app = await api.getApplication('demo-app-1');
        setApplication(app);
      } catch (err) {
        console.error('Failed to fetch application:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white/85 backdrop-blur-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center font-black text-sky-700 shadow-xs">
            {user?.name?.slice(0, 2).toUpperCase() || 'AS'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900">
                Namaste, {user?.name || 'Citizen Applicant'}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                e-KYC Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Aadhaar Vault Ref: <span className="font-mono text-slate-800 font-bold">{user?.maskedAadhaar || 'XXXXXXXX9012'}</span> • DigiLocker Synchronized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30"
          >
            <PlusCircle className="w-4 h-4" />
            Apply For Family / Renewal
          </Link>
        </div>
      </div>

      {/* 12-Column Responsive Bento Grid Architecture */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* ROW 1 */}
        {application && <ApplicationHeroWidget application={application} />}
        <IdentityVaultCard />

        {/* ROW 2 */}
        <AppointmentRadarWidget />
        <PoliceVerificationStreamWidget />
        <DocumentHealthWidget />
      </div>
    </div>
  );
}
