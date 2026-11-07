import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Loader = ({ message = 'Loading security data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-blue-500/20 border-b-blue-400 animate-spin [animation-duration:1.5s]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-mono text-slate-400 tracking-wide">{message}</p>
    </div>
  );
};

