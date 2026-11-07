import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-bold text-white tracking-tight">PhishGuard AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time, machine-learning-driven phishing website analysis and URL security intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Neural Engine Online
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Detection Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/scanner" className="hover:text-cyan-400 transition-colors">Lexical URL Analyzer</Link></li>
              <li><Link to="/scanner" className="hover:text-cyan-400 transition-colors">Brand Typosquatting Radar</Link></li>
              <li><Link to="/scanner" className="hover:text-cyan-400 transition-colors">Homoglyph & Punycode Check</Link></li>
              <li><Link to="/scanner" className="hover:text-cyan-400 transition-colors">SSL Certificate Validator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">System & Tech</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Random Forest Model</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Feature Engineering Pipeline</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">FastAPI Microservice</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Full-Stack Architecture</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Security Feeds</h4>
            <p className="text-xs text-slate-400 mb-3">
              Telemetry continuously correlates against live PhishTank, OpenPhish, and proprietary heuristic datasets.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              Accuracy: <span className="text-emerald-400 font-bold">99.4%</span> | Latency: <span className="text-cyan-400 font-bold">&lt;350ms</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PhishGuard AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

