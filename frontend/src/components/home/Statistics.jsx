import React from 'react';
import { ShieldCheck, Zap, Users, AlertOctagon } from 'lucide-react';

export const Statistics = () => {
  const stats = [
    {
      label: "Detection Accuracy",
      value: "99.4%",
      change: "+0.8% vs static lists",
      icon: ShieldCheck,
      color: "emerald"
    },
    {
      label: "URLs Scanned Globally",
      value: "1.42M+",
      change: "Continuously growing",
      icon: Users,
      color: "cyan"
    },
    {
      label: "Average Latency",
      value: "285ms",
      change: "Sub-second inference",
      icon: Zap,
      color: "blue"
    },
    {
      label: "Phishing Campaigns Blocked",
      value: "418,000+",
      change: "Zero-day domains intercepted",
      icon: AlertOctagon,
      color: "rose"
    }
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-8' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{s.label}</span>
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">{s.value}</p>
                <p className="text-xs text-cyan-400 mt-1 font-mono">{s.change}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

