'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { NeuButton } from './NeuButton';
import { Sparkles, MessageSquare, X, Send, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am BharatBot, your AI Passport Seva Assistant. How can I assist your application today?',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Check my Application SLA',
    'What documents are needed for Tatkaal?',
    'How does Redisson slot lock work?',
    'Is my Aadhaar masked & safe?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      let reply = 'I have analyzed your query against the Passport Seva NextGen Rules.';
      if (userMsg.toLowerCase().includes('sla') || userMsg.toLowerCase().includes('status')) {
        reply = 'Your active application (BP-2026-894210) is on Stage 4 (mPolice Beat Dispatched). Guaranteed SLA deadline is 09 Sept 2026.';
      } else if (userMsg.toLowerCase().includes('tatkaal') || userMsg.toLowerCase().includes('document')) {
        reply = 'Tatkaal requires 3 identity annexures (e.g. Aadhaar e-KYC, PAN, Voter ID) and offers an accelerated 3-7 day SLA with ₹3,500 fee.';
      } else if (userMsg.toLowerCase().includes('aadhaar') || userMsg.toLowerCase().includes('safe')) {
        reply = '100% UIDAI Data Vault Compliant! Raw Aadhaar numbers are never stored; they are encrypted using AES-256-GCM and referenced by UUIDv4 only.';
      } else if (userMsg.toLowerCase().includes('slot') || userMsg.toLowerCase().includes('lock')) {
        reply = 'Our Redisson distributed lock holds your selected PSK slot for 300 seconds during checkout with 0% double-booking probability!';
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Popover Chat Dialog */}
      {isOpen && (
        <div className="mb-4 w-96 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md p-1 flex items-center justify-center">
                <img
                  src="/images/TranparentRobot.gif"
                  alt="AI Robot Assistant"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black">BharatBot AI</h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold">
                    v2.5 Live
                  </span>
                </div>
                <p className="text-[10px] text-sky-100 font-medium">NextGen Intelligence Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-200 shrink-0 flex items-center justify-center overflow-hidden">
                    <img src="/images/TranparentRobot.gif" alt="AI" className="w-5 h-5 object-contain" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-sky-500 text-white font-medium rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs font-medium'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition-colors font-semibold"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about Bharat Pass..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
            <button
              onClick={() => handleSend(inputText)}
              className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 p-2.5 pr-4 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_10px_30px_-5px_rgba(2,132,199,0.25)] hover:shadow-[0_15px_35px_-5px_rgba(2,132,199,0.4)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 shadow-inner">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src="/images/TranparentRobot.gif"
              alt="BharatBot AI Assistant"
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900">BharatBot AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          </div>
          <span className="text-[10px] text-slate-500 font-bold">Ask Questions &amp; Track</span>
        </div>
      </button>
    </div>
  );
}
