import React from 'react';
import { Terminal, Cpu, ShieldCheck, FileSearch } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Terminal,
      title: "URL Ingestion & Lexical Parsing",
      description: "URL is parsed into protocol, apex domain, subdomains, path, and parameters while calculating character entropy and length distributions."
    },
    {
      step: "02",
      icon: FileSearch,
      title: "Domain & DNS Resolution",
      description: "Verifies IP routing, checks for brand name typosquatting, audits TLD reputation, and simulates transport SSL certificate validation."
    },
    {
      step: "03",
      icon: Cpu,
      title: "Random Forest Neural Inference",
      description: "The 25-feature vector feeds into our trained Random Forest ensemble to evaluate non-linear patterns characteristic of phishing attacks."
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "Risk Verdict & Indicators",
      description: "Generates an instant 0–100 threat score, categorizes the site as Safe, Suspicious, or Phishing, and provides actionable protection guidance."
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3">
            Architectural Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How PhishGuard AI Analyzes Threats
          </p>
          <p className="mt-4 text-slate-400 text-base">
            From raw link to comprehensive security intelligence in under 300 milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative glass-card p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-slate-700/60 group-hover:text-cyan-500/40">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

