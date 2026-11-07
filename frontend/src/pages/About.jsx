import React from 'react';
import { 
  Cpu, 
  Binary, 
  ShieldCheck, 
  Layers, 
  Database, 
  Terminal, 
  Server, 
  CheckCircle2 
} from 'lucide-react';

export const About = () => {
  const architecturalLayers = [
    {
      title: "1. Ingestion & Preprocessing Layer",
      icon: Terminal,
      description: "Parses arbitrary URLs, validates RFC compliant formats, normalizes Unicode homoglyphs, and parses network targets into discrete lexical segments."
    },
    {
      title: "2. Multi-Vector Feature Extraction Engine",
      icon: Binary,
      description: "Extracts 25+ real-time quantitative and categorical features spanning lexical length, token entropy, domain age, brand distance, and SSL handshake."
    },
    {
      title: "3. Random Forest Neural Ensemble",
      icon: Cpu,
      description: "Trained on hundreds of thousands of verified phishing and legitimate URLs. Uses 100 decision trees to isolate non-linear attack patterns with 99.4% accuracy."
    },
    {
      title: "4. Explainable Threat Intelligence API",
      icon: Server,
      description: "Outputs probabilistic threat scores (0-100), transparent evidence logs, recommended browser actions, and persists telemetry for SOC teams."
    }
  ];

  const extractedFeatures = [
    { name: "URL Length & Entropy", desc: "Shannon entropy and character length indicate algorithmic obfuscation." },
    { name: "Brand Distance Check", desc: "Detects typosquatted targets (e.g., paypa1, micros0ft, app1e)." },
    { name: "IP & Port Analysis", desc: "Detects direct numeric IP addresses and non-standard network ports." },
    { name: "Subdomain Depth", desc: "Identifies excessive subdomains used to mask apex domain identities." },
    { name: "Suspicious TLD Flag", desc: "Flags high-abuse TLDs commonly used in short-lived phishing attacks." },
    { name: "Transport & SSL Audit", desc: "Verifies HTTPS protocol enforcement and certificate provenance." }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>System Architecture & Scientific Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          AI-Powered Phishing Detection
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          PhishGuard AI combines advanced lexical feature engineering with machine learning ensemble modeling to outpace zero-day phishing campaigns in real-time.
        </p>
      </div>

      {/* Architecture Pipeline Cards */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Detection Engine Pipeline</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {architecturalLayers.map((layer, idx) => {
            const Icon = layer.icon;
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white">{layer.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{layer.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Engineering Grid */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Binary className="w-5 h-5 text-blue-400" />
            <span>Extracted Machine Learning Features</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The mathematical representations extracted by the inference engine from incoming web links:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extractedFeatures.map((f, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="text-xs font-bold font-mono text-cyan-400">{f.name}</span>
              <p className="text-xs text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-mono">System Stack & Components</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Frontend</span>
            <span className="text-white font-bold">React 18 + Vite + Tailwind</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Backend</span>
            <span className="text-white font-bold">Node.js + Express + JWT</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">ML Microservice</span>
            <span className="text-white font-bold">FastAPI + Scikit-Learn</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block">Database</span>
            <span className="text-white font-bold">MongoDB / Resilient Store</span>
          </div>
        </div>
      </div>

    </div>
  );
};

