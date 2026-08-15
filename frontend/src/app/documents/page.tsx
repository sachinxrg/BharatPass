'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { DOCUMENT_REQUIREMENTS } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeuButton } from '@/components/ui/NeuButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Camera, 
  FileCheck,
  Eye,
  ScanLine
} from 'lucide-react';

interface UploadResult {
  docType: string;
  fileName: string;
  ocrScore: number;
  qualityPassed: boolean;
  issues: string[];
  extractedFields: Record<string, string>;
}

export default function DocumentUploadPage() {
  const [selectedDocType, setSelectedDocType] = useState('PHOTO');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<Record<string, UploadResult>>({
    PHOTO: {
      docType: 'PHOTO',
      fileName: 'passport_biometric_photo.jpg',
      ocrScore: 98,
      qualityPassed: true,
      issues: [],
      extractedFields: {
        'Facial Symmetry': '99.2%',
        'Background Color': 'Pure White (#FFFFFF)',
        'Eye Openness': '100% (Biometric Grade A)',
        'Resolution': '600 DPI (Passed)',
      },
    },
    AADHAAR_EKYC: {
      docType: 'AADHAAR_EKYC',
      fileName: 'offline_ekyc_signed.xml',
      ocrScore: 100,
      qualityPassed: true,
      issues: [],
      extractedFields: {
        'Digital Signature': 'UIDAI Sub-CA 2026 (Valid)',
        'Hash Integrity': 'SHA-256 Match',
        'Reference UUID': 'e8b2-4819-bf91',
      },
    },
  });

  const handleSimulateUpload = async (docType: string) => {
    setIsScanning(true);
    setTimeout(() => {
      const mockScore = Math.floor(88 + Math.random() * 10);
      setResults((prev) => ({
        ...prev,
        [docType]: {
          docType,
          fileName: `${docType.toLowerCase()}_scan.pdf`,
          ocrScore: mockScore,
          qualityPassed: true,
          issues: mockScore < 90 ? ['Slight shadow detected on upper corner'] : [],
          extractedFields: {
            'Text Recognition': 'Tesseract 5.3 OCR Match',
            'Name Verification': 'Aarav Rajesh Sharma (99% Match)',
            'DOB Verification': '15/08/1996 (Exact Match)',
          },
        },
      }));
      setIsScanning(false);
    }, 1500);
  };

  const totalUploaded = Object.keys(results).length;
  const averageScore = Math.round(
    Object.values(results).reduce((acc, curr) => acc + curr.ocrScore, 0) / (totalUploaded || 1)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header with AI Assistant Bot Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-sky-100 border border-sky-200 p-1 flex items-center justify-center shadow-xs animate-float-fast">
            <img src="/images/TranparentRobot.gif" alt="AI Bot Assistant" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>AI OCR Pre-Check Engine</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Document Ingestion &amp; Quality Radar</h1>
            <p className="text-xs text-slate-500 font-medium">
              Instant blur detection, glare analysis, and demographic cross-referencing before PSK visit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-right">
            <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Overall AI Health</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-black text-emerald-600">{averageScore}/100</span>
              <StatusBadge variant="emerald" size="sm">
                PSK Ready
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Columns: Checklist */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
            Required Document Stack
          </span>

          {Object.entries(DOCUMENT_REQUIREMENTS).map(([key, doc]) => {
            const uploaded = results[key];
            const isSelected = selectedDocType === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedDocType(key)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/80 border-sky-400 shadow-sm ring-2 ring-sky-300/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        uploaded
                          ? 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}
                    >
                      {uploaded ? <FileCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{doc.name}</span>
                        {doc.required && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            Required
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1 font-medium">{doc.description}</span>
                    </div>
                  </div>

                  {uploaded ? (
                    <span className="font-mono text-xs font-black text-emerald-600">
                      {uploaded.ocrScore}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Columns: Active Scanner / Upload Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard glow="cyan" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Ingestion Terminal: {DOCUMENT_REQUIREMENTS[selectedDocType]?.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium">Supported: PDF, JPG, PNG (Max 10MB)</p>
              </div>
              <StatusBadge variant="cyan" size="sm">
                Apache Tika + Tesseract 5.3
              </StatusBadge>
            </div>

            {/* Drag Drop / Scan Zone */}
            <div className="relative overflow-hidden border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-8 text-center space-y-3 bg-sky-50/40 transition-all group">
              {isScanning && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center animate-bounce">
                    <img src="/images/TranparentRobot.gif" alt="Scanning Robot" className="w-12 h-12 object-contain" />
                  </div>
                  <p className="text-sm font-black text-sky-900">Running Tesseract AI OCR Pre-Check...</p>
                  <p className="text-xs text-slate-500">Analyzing blur, glare &amp; bounding box alignment</p>
                </div>
              )}

              <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-sky-600" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Drag &amp; Drop or Upload {DOCUMENT_REQUIREMENTS[selectedDocType]?.name}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {DOCUMENT_REQUIREMENTS[selectedDocType]?.description}
                </p>
              </div>

              <div className="pt-2">
                <NeuButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleSimulateUpload(selectedDocType)}
                  leftIcon={<Camera className="w-3.5 h-3.5" />}
                >
                  Upload &amp; Run Instant AI Scan
                </NeuButton>
              </div>
            </div>

            {/* OCR Extracted Results Box */}
            {results[selectedDocType] && (
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">AI OCR Pre-Validation Results</span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    Score: {results[selectedDocType].ocrScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(results[selectedDocType].extractedFields).map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-semibold block">{k}</span>
                      <span className="font-mono text-slate-900 font-bold">{v}</span>
                    </div>
                  ))}
                </div>

                {results[selectedDocType].issues.length > 0 ? (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Advisory Note:</span>
                      {results[selectedDocType].issues.map((issue, idx) => (
                        <p key={idx} className="text-[11px] text-slate-600">{issue}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quality Grade A — 0% Chance of PSK Document Rejection</span>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
