'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Search, 
  UserCheck, 
  Sliders, 
  Radio, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, quickDemoLogin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Citizen Command Center', icon: LayoutDashboard, role: 'ROLE_CITIZEN' },
    { href: '/apply', label: 'New Passport Application', icon: FileText, role: 'ROLE_CITIZEN' },
    { href: '/book-slot', label: 'PSK Slot Radar', icon: Calendar, role: 'ROLE_CITIZEN' },
    { href: '/track', label: 'Live Stream Tracker', icon: Radio, role: 'ROLE_CITIZEN' },
    { href: '/officer', label: 'PSK Officer Portal', icon: UserCheck, role: 'ROLE_PSK_OFFICER' },
    { href: '/police', label: 'mPolice Verification', icon: ShieldCheck, role: 'ROLE_POLICE_OFFICER' },
    { href: '/admin', label: 'RPO Admin Analytics', icon: Sliders, role: 'ROLE_RPO_ADMIN' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand with Official Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 p-1 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/images/logo.png" alt="Bharat Pass Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                BHARAT PASS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 font-mono font-bold">
                NEXTGEN
              </span>
            </div>
            <span className="text-[10px] text-slate-500 tracking-wide font-medium">
              Passport Seva Modernization Portal
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200',
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-sky-600' : 'text-slate-400')} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side persona switch & system status */}
        <div className="flex items-center gap-3">
          {/* Amber UIDAI Pill with Shimmer */}
          <div className="relative hidden sm:inline-flex group">
            <div className="absolute -top-1 inset-x-2 h-2 bg-amber-400/50 blur-xs rounded-full group-hover:opacity-100 transition-opacity" />
            <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50/95 border border-amber-200 text-amber-800 text-[11px] font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              UIDAI v2.5 Simulation
            </span>
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all hover:scale-102 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="max-w-[140px] truncate">{user?.name || 'Priya Sharma (Coun...'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl p-2 shadow-2xl border border-slate-200 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Select Interactive Persona
                </div>
                <button
                  onClick={() => quickDemoLogin('ROLE_CITIZEN')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs text-left hover:bg-sky-50/60 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-indigo-700">Citizen Applicant</span>
                    <span className="text-[10px] text-slate-500 font-medium">Aarav Sharma (Bangalore)</span>
                  </div>
                  {user?.role === 'ROLE_CITIZEN' && <span className="text-emerald-600 font-black text-xs">Active</span>}
                </button>
                <button
                  onClick={() => quickDemoLogin('ROLE_PSK_OFFICER')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs text-left hover:bg-sky-50/60 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sky-700">PSK Granting Officer</span>
                    <span className="text-[10px] text-slate-500 font-medium">Priya Sharma (Counter A)</span>
                  </div>
                  {user?.role === 'ROLE_PSK_OFFICER' && <span className="text-emerald-600 font-black text-xs">Active</span>}
                </button>
                <button
                  onClick={() => quickDemoLogin('ROLE_POLICE_OFFICER')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs text-left hover:bg-sky-50/60 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-emerald-700">mPolice Beat Officer</span>
                    <span className="text-[10px] text-slate-500 font-medium">SI Rajesh Kumar (GPS Active)</span>
                  </div>
                  {user?.role === 'ROLE_POLICE_OFFICER' && <span className="text-emerald-600 font-black text-xs">Active</span>}
                </button>
                <button
                  onClick={() => quickDemoLogin('ROLE_RPO_ADMIN')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs text-left hover:bg-sky-50/60 text-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-700">RPO Regional Admin</span>
                    <span className="text-[10px] text-slate-500 font-medium">Dr. G. K. Rao (Bangalore RPO)</span>
                  </div>
                  {user?.role === 'ROLE_RPO_ADMIN' && <span className="text-emerald-600 font-black text-xs">Active</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
