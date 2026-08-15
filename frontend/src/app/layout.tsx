import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { AIAssistantWidget } from '@/components/ui/AIAssistantWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Bharat Pass — Next-Generation Passport Seva Portal',
  description:
    'High-concurrency, enterprise-grade passport issuance and verification platform with passwordless Aadhaar e-KYC, Redisson distributed slot booking, and real-time mPolice verification streaming.',
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen selection:bg-cyan-500/20 selection:text-cyan-900 bg-slate-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            {children}
          </main>
          <AIAssistantWidget />
          <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-xl py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Bharat Pass Logo" className="w-6 h-6 object-contain" />
                <span className="font-bold text-slate-800">Bharat Pass NextGen v1.0 • Ministry of External Affairs</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/emblem.png" alt="State Emblem of India" className="w-4 h-6 object-contain" />
                <p className="text-slate-500 font-medium">UIDAI Data Vault Mandate Compliant • AES-256-GCM Encrypted</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
