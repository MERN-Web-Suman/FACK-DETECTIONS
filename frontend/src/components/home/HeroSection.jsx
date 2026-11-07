import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Lock, 
  AlertTriangle,
  Zap
} from 'lucide-react';

export const HeroSection = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!url.trim()) return;
    navigate(`/scanner?url=${encodeURIComponent(url.trim())}`);
  };

  const sampleUrls = [
    { label: 'Phishing Sample', url: 'http://paypal-security-verification-portal.com/login.php', isPhish: true },
    { label: 'Legitimate Sample', url: 'https://appleid.apple.com', isPhish: false },
    { label: 'Suspicious Spoof', url: 'http://apple-id-verify-account-locked.xyz/recover', isPhish: true }
  ];

  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:py-24 cyber-grid border-b border-slate-800/80">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Release / Tech Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-8 shadow-sm shadow-cyan-500/10 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Machine Learning Phishing Defense v2.4</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Zero-Day Phishing Detection Powered by{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            Intelligent AI
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Safeguard users and enterprises against sophisticated spoofing, credential harvesters, and deceptive domains with sub-second neural URL classification.
        </p>

        {/* Hero Interactive Scanner Box */}
        <div className="mt-10 max-w-3xl mx-auto">
          <form onSubmit={handleQuickScan} className="glass-panel p-2.5 rounded-2xl border border-slate-700/80 shadow-2xl shadow-cyan-950/40 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste or enter suspicious URL (e.g. http://paypal-security-check.xyz)"
                className="w-full bg-slate-950/60 text-slate-100 placeholder-slate-500 pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/60 font-mono text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Scan URL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-mono">Try real samples:</span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(s.url)}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                  s.isPhish
                    ? 'border-rose-900/40 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40'
                    : 'border-emerald-900/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-900/40'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-xl text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">Model</p>
              <p className="text-sm font-bold text-white">Random Forest & AI</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">Extraction</p>
              <p className="text-sm font-bold text-white">25+ Structural Signals</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">Accuracy</p>
              <p className="text-sm font-bold text-white">99.4% Precision</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl text-left flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400">Latency</p>
              <p className="text-sm font-bold text-white">&lt; 300ms Speed</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

