import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'cyan', trend }) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      text: 'text-cyan-400'
    },
    rose: {
      border: 'hover:border-rose-500/40',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      text: 'text-rose-400'
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400'
    },
    amber: {
      border: 'hover:border-amber-500/40',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      text: 'text-amber-400'
    },
    blue: {
      border: 'hover:border-blue-500/40',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      text: 'text-blue-400'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div className={`glass-card p-5 rounded-2xl border border-slate-800 transition-all duration-300 ${scheme.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${scheme.badge}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{value}</span>
        {trend && (
          <span className="text-xs font-mono text-emerald-400 font-semibold">{trend}</span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 font-mono mt-1.5">{subtitle}</p>
      )}
    </div>
  );
};

