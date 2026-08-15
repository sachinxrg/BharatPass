'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PSK_CENTERS } from '@/lib/constants';
import { SlotAvailability } from '@/types/booking';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  AlertTriangle, 
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';

export default function BookSlotPage() {
  const [selectedPskId, setSelectedPskId] = useState(PSK_CENTERS[0].id);
  const [selectedDate, setSelectedDate] = useState('2026-08-18');
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Reservation & Lock state
  const [reservedSlot, setReservedSlot] = useState<{
    appointmentId: string;
    timeWindow: string;
    displayTime: string;
    lockExpiry: number;
  } | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch slot availability
  useEffect(() => {
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const res = await api.getSlotAvailability(selectedPskId, selectedDate);
        setSlots(res.slots);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [selectedPskId, selectedDate]);

  // 5-minute countdown ticker for Redisson Lease Lock
  useEffect(() => {
    if (!reservedSlot || bookingConfirmed) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((reservedSlot.lockExpiry - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setReservedSlot(null);
        alert('Slot reservation lease expired! Slot returned to the public pool.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservedSlot, bookingConfirmed]);

  const handleReserve = async (slot: SlotAvailability) => {
    if (slot.available <= 0) return;
    setIsProcessing(true);
    try {
      const res = await api.reserveSlot({
        appId: 'demo-app-1',
        pskId: selectedPskId,
        date: selectedDate,
        timeWindow: slot.timeWindow,
      });

      setReservedSlot({
        appointmentId: res.appointmentId,
        timeWindow: slot.timeWindow,
        displayTime: slot.displayTime,
        lockExpiry: Date.now() + 300 * 1000,
      });
      setSecondsRemaining(300);
    } catch (err) {
      alert('Unable to acquire slot lock. Another applicant may have reserved it.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!reservedSlot) return;
    setIsProcessing(true);
    try {
      await api.confirmSlot(reservedSlot.appointmentId, 'PAY-RAZOR-99124');
      setBookingConfirmed(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      alert('Payment confirmation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const activePsk = PSK_CENTERS.find((p) => p.id === selectedPskId) || PSK_CENTERS[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            <span>Redisson Distributed Lease Lock Engine</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">PSK Biometric Appointment Radar</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time slot inventory across India with 50,000+ concurrency resistance and zero double-booking guarantee.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge variant="emerald" pulse size="sm">
            50K RPS Token Bucket Active
          </StatusBadge>
        </div>
      </div>

      {bookingConfirmed ? (
        /* Confirmed Digital Appointment Pass */
        <div className="max-w-2xl mx-auto">
          <GlassCard glow="emerald" className="text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Appointment Confirmed &amp; Locked!</h2>
              <p className="text-xs text-slate-500 font-medium">
                Please present this digital pass at PSK Entry Gate Counter A.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                  <span className="text-sm font-black text-slate-900">{activePsk.name}</span>
                  <span className="text-xs text-slate-500 block">{activePsk.city}, {activePsk.state}</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Date of Appointment:</span>
                  <span className="font-mono text-sky-700 font-bold">{selectedDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reporting Slot Window:</span>
                  <span className="font-mono text-emerald-700 font-bold">{reservedSlot?.displayTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Batch Code:</span>
                  <span className="font-mono text-slate-800 font-semibold">BATCH-{activePsk.code}-A04</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Entry Gate:</span>
                  <span className="text-slate-800 font-bold">Counter A (Biometric)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <NeuButton
                variant="primary"
                onClick={() => window.print()}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                Print / Save Appointment Pass (PDF)
              </NeuButton>
              <NeuButton
                variant="secondary"
                onClick={() => { setBookingConfirmed(false); setReservedSlot(null); }}
              >
                Book Another Slot
              </NeuButton>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* Booking Heatmap Grid & Selection */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Columns: PSK Center & Date Selector */}
          <div className="lg:col-span-4 space-y-4">
            <GlassCard glow="indigo" className="space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">1. Select Passport Seva Kendra</h3>
                <p className="text-xs text-slate-500">Choose your regional seva office</p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {PSK_CENTERS.map((psk) => (
                  <button
                    key={psk.id}
                    onClick={() => setSelectedPskId(psk.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      selectedPskId === psk.id
                        ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm ring-2 ring-sky-300/40'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{psk.name}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-sky-700 font-bold">
                        {psk.code}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                      {psk.city}, {psk.state} • {psk.dailySlots} slots/day
                    </span>
                  </button>
                ))}
              </div>

              {/* Date Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                  2. Choose Appointment Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['2026-08-18', '2026-08-19', '2026-08-20'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-2.5 rounded-2xl text-center border font-mono text-xs transition-all ${
                        selectedDate === d
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold ring-2 ring-cyan-300/40'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {d.slice(5)}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Distributed Lock Active Banner */}
            {reservedSlot && (
              <GlassCard glow="amber" className="p-4 space-y-3 border-amber-200 bg-amber-50/90 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span className="text-xs font-bold text-amber-900">Slot Held for Checkout</span>
                  </div>
                  <span className="font-mono text-sm font-black text-amber-700">
                    {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Holding slot <strong>{reservedSlot.displayTime}</strong> with Redisson lease lock. Complete payment before TTL expires.
                </p>
                <NeuButton
                  variant="emerald"
                  size="sm"
                  className="w-full"
                  isLoading={isProcessing}
                  onClick={handleConfirmPayment}
                  leftIcon={<CreditCard className="w-4 h-4" />}
                >
                  Pay ₹1,500 &amp; Lock Slot
                </NeuButton>
              </GlassCard>
            )}
          </div>

          {/* Right 8 Columns: Live Interactive Slot Inventory Heatmap */}
          <div className="lg:col-span-8 space-y-4">
            <GlassCard glow="cyan" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">{activePsk.name}</h2>
                    <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-bold">
                      {selectedDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Click any open window to atomically reserve slot with 5-minute checkout lease.
                  </p>
                </div>

                {/* Heatmap Legend */}
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> High Availability
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Fast Filling
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Full
                  </span>
                </div>
              </div>

              {/* Slot Grid */}
              {loadingSlots ? (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium">Querying Redis Slot Cluster...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot) => {
                    const isAvailable = slot.available > 0;
                    const isFastFilling = slot.available > 0 && slot.available <= 5;
                    const isSelected = reservedSlot?.timeWindow === slot.timeWindow;

                    return (
                      <button
                        key={slot.timeWindow}
                        disabled={!isAvailable || isProcessing}
                        onClick={() => handleReserve(slot)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-400 shadow-sm'
                            : isAvailable
                            ? isFastFilling
                              ? 'bg-amber-50/70 hover:bg-amber-100 border-amber-300 text-amber-900 hover:scale-105 cursor-pointer shadow-2xs'
                              : 'bg-emerald-50/70 hover:bg-emerald-100 border-emerald-300 text-emerald-900 hover:scale-105 cursor-pointer shadow-2xs'
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60 line-through'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-black text-slate-900">
                            {slot.displayTime}
                          </span>
                          {isSelected && <Lock className="w-3.5 h-3.5 text-sky-600" />}
                        </div>

                        <div className="flex justify-between items-center mt-2 text-[11px]">
                          <span className="text-slate-500 font-sans font-medium">Available:</span>
                          <span className="font-mono font-bold">
                            {isAvailable ? `${slot.available} / ${slot.total}` : 'FULL'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Concurrency Technical Guarantee Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>RLock Distributed Mutex on <code>SLOT:&#123;rpo&#125;:&#123;date&#125;:&#123;time&#125;</code></span>
                </div>
                <span className="font-mono text-sky-700 font-bold">P99 Lock Latency: 42ms</span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
