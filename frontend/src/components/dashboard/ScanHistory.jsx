import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const ScanHistory = ({ scans = [], onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.domain?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || s.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain or URL..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
            {['ALL', 'PHISHING', 'SUSPICIOUS', 'LEGITIMATE'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === st
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Domain & Target URL</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">IP / Geo</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredScans.length > 0 ? (
                filteredScans.map((s) => {
                  const isPhishing = s.status === 'Phishing';
                  const isSuspicious = s.status === 'Suspicious';

                  return (
                    <tr key={s._id || s.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 max-w-xs truncate">
                        <span className="font-bold text-white block truncate">{s.domain}</span>
                        <span className="text-[10px] text-slate-500 truncate block">{s.url}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isPhishing
                              ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                              : isSuspicious
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                            }`}
                        >
                          {isPhishing ? (
                            <ShieldAlert className="w-3 h-3" />
                          ) : isSuspicious ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          {s.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-200">
                        <span
                          className={
                            isPhishing ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                          }
                        >
                          {s.riskScore}
                        </span>
                        <span className="text-slate-600 font-normal"> / 100</span>
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        <span>{s.ipAddress || '198.51.100.1'}</span>
                        <span className="block text-[10px] text-slate-500">{s.country || 'Global'}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(s.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/scan-result/${s._id || s.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="View Full Report"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          {onDelete && (
                            <button
                              onClick={() => onDelete(s._id || s.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No scans matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
