import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Shield } from 'lucide-react';

export const ScanProgress = ({ targetUrl }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Deconstructing URL Anatomy & Shannon Entropy', detail: 'Evaluating length, digit ratios, token structure' },
    { title: 'Auditing SSL/TLS Transport Layer Security', detail: 'Verifying certificate authenticity & cipher strength' },
    { title: 'Executing Brand Spoofing & Typosquatting Radar', detail: 'Scanning against Alexa Top 1000 targeted institutions' },
    { title: 'Running Random Forest Classification Model', detail: 'Calculating non-linear threat probability vector' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-xl space-y-6 animate-pulse-glow">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Inference Pipeline In Progress</h4>
            <p className="text-xs text-slate-400 font-mono truncate max-w-sm sm:max-w-md">{targetUrl}</p>
          </div>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-semibold">
          {Math.min(Math.round(((currentStep + 1) / steps.length) * 100), 99)}% Complete
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                isCurrent
                  ? 'bg-cyan-950/30 border-cyan-500/40'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800/80'
                  : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0"></div>
                )}
              </div>
              <div className="text-left">
                <p className={`text-xs sm:text-sm font-medium ${isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-300'}`}>
                  {s.title}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

