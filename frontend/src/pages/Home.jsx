import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { Features } from '../components/home/Features';
import { HowItWorks } from '../components/home/HowItWorks';
import { Statistics } from '../components/home/Statistics';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  return (
    <div className="space-y-6">
      <HeroSection />
      <Statistics />
      <Features />
      <HowItWorks />

      {/* Call to action section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Real-Time Phishing Threat Protection</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Shield Against Deceptive Websites?
            </h2>

            <p className="text-slate-400 text-base leading-relaxed">
              Sign in or create an account to run real-time AI security scans and safeguard your browsing telemetry history.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/scanner"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <span>Launch Live Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all text-center"
                >
                  Create Free Account
                </button>
              ) : (
                <Link
                  to="/user/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all text-center"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

