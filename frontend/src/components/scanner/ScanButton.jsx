import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const ScanButton = ({ loading, disabled }) => {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
        loading || disabled
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99]'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Analyzing Neural Signals...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-5 h-5" />
          <span>Run AI Security Scan</span>
        </>
      )}
    </button>
  );
};

