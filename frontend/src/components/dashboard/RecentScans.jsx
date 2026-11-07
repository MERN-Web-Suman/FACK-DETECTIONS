import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export const RecentScans = ({ scans = [] }) => {
  if (!scans || scans.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
        <p className="text-sm text-slate-400 font-mono">No scans recorded yet.</p>
        <Link
          to="/scanner"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
        >
          <span>Run your first URL scan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Recent URL Threat Inspections</span>
        </h3>
        <Link
          to="/user/history"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/80 overflow-x-auto">
        {scans.map((scan) => {
          const isPhishing = scan.status === 'Phishing';
          const isSuspicious = scan.status === 'Suspicious';

          return (
            <div
              key={scan._id || scan.id}
              className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isPhishing
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : isSuspicious
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isPhishing ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : isSuspicious ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${scan.domain}&sz=32`}
                      alt=""
                      className="w-3.5 h-3.5 rounded shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <p className="text-sm font-bold text-white font-mono truncate">{scan.domain}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">{scan.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      isPhishing
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                        : isSuspicious
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                    }`}
                  >
                    {scan.status}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatRelativeTime(scan.createdAt)}
                  </p>
                </div>

                <div className="text-center w-12 hidden md:block">
                  <span className="text-xs font-mono font-bold text-slate-300">{scan.riskScore}</span>
                  <span className="block text-[9px] text-slate-500 uppercase">Risk</span>
                </div>

                <Link
                  to={`/scan-result/${scan._id || scan.id}`}
                  className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                  title="View full report"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

