import React from 'react';
import { 
  Binary, 
  Target, 
  KeyRound, 
  Globe2, 
  Gauge, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

export const Features = () => {
  const featureList = [
    {
      icon: Binary,
      title: "Lexical & Entropy Analysis",
      color: "cyan",
      description: "Calculates Shannon entropy, length ratios, digit distribution, and character variance to flag algorithmic URL generation."
    },
    {
      icon: Target,
      title: "Brand Impersonation Defense",
      color: "rose",
      description: "Identifies lookalike brand domains targeting Apple, PayPal, Microsoft, Binance, and major banking institutions before harm occurs."
    },
    {
      icon: KeyRound,
      title: "Transport & SSL Inspection",
      color: "emerald",
      description: "Audits HTTPS transport security, certificate validity, and flags unencrypted cleartext credential transmission vectors."
    },
    {
      icon: Globe2,
      title: "TLD & Homoglyph Intelligence",
      color: "blue",
      description: "Screens high-risk top-level domains (.xyz, .top, .ru) and catches Cyrillic/Greek homoglyphs disguised as standard Latin characters."
    },
    {
      icon: Gauge,
      title: "Confidence Scoring Engine",
      color: "amber",
      description: "Delivers an explainable 0–100 threat score paired with transparent evidence indicators and protective user guidelines."
    },
    {
      icon: ShieldAlert,
      title: "SOC & Admin Telemetry",
      color: "indigo",
      description: "Enterprise dashboard equipped with attack timeline graphs, user management controls, and full scan audit trails."
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3">
          Comprehensive Defense Capabilities
        </h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Layered Phishing Detection Pipeline
        </p>
        <p className="mt-4 text-slate-400 text-base">
          Rather than relying solely on outdated static blacklists, PhishGuard AI inspects anatomical markers that reveal malicious intent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-5 group-hover:border-cyan-500/50 transition-colors">
                <Icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

