import React, { useState } from 'react';
import { scanService } from '../../services/scanService';
import { Layers, Play, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck, Loader2, ExternalLink, Sparkles, Trash2 } from 'lucide-react';

export const BulkScanner = ({ onSelectScan, disabled }) => {
  const [urlsText, setUrlsText] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');

  const sampleBatch = [
    'https://appleid.apple.com',
    'http://paypal-security-verification-portal.com/login.php',
    'https://github.com/trending',
    'http://apple-id-verify-account-locked.xyz/recover',
    'https://www.netflix.com/login'
  ];

  const handleRunBulk = async () => {
    const list = urlsText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (list.length === 0) {
      setError('Please enter at least one URL to scan.');
      return;
    }

    if (list.length > 10) {
      setError('Bulk scanner accepts up to 10 URLs per batch.');
      return;
    }

    setError('');
    setScanning(true);
    setResults([]);
    setProgress({ current: 0, total: list.length });

    const batchResults = [];

    for (let i = 0; i < list.length; i++) {
      const target = list[i];
      try {
        const res = await scanService.analyzeUrl(target);
        if (res && res.data) {
          batchResults.push({
            url: target,
            status: res.data.status,
            riskScore: res.data.riskScore,
            threatLevel: res.data.threatLevel,
            domain: res.data.domain,
            recommendation: res.data.recommendation,
            raw: res.data
          });
        }
      } catch (err) {
        batchResults.push({
          url: target,
          status: 'Error',
          riskScore: 0,
          threatLevel: 'Unknown',
          domain: target.replace(/^https?:\/\//i, '').split('/')[0],
          recommendation: err.response?.data?.message || 'Scan failed',
          raw: null
        });
      }
      setProgress({ current: i + 1, total: list.length });
      setResults([...batchResults]);
    }

    setScanning(false);
  };

  const handleLoadSample = () => {
    setUrlsText(sampleBatch.join('\n'));
    setError('');
  };

  const handleClear = () => {
    setUrlsText('');
    setResults([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Information Header */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold flex items-center gap-2">
            <span>Multi-Target Batch Analysis</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">BATCH</span>
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5 leading-relaxed">
            Scan up to 10 URLs simultaneously. Paste URLs separated by newlines to evaluate domain risk matrix and security posture in one go.
          </p>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Target URLs (one per line, max 10):</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={scanning || disabled}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Batch</span>
            </button>
            {urlsText && (
              <button
                type="button"
                onClick={handleClear}
                disabled={scanning}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={5}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          disabled={scanning || disabled}
          placeholder="https://example.com&#10;http://suspicious-login-portal.xyz&#10;https://legit-site.org/auth"
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
        />

        {error && (
          <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        <button
          type="button"
          onClick={handleRunBulk}
          disabled={scanning || disabled || !urlsText.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning Batch ({progress.current}/{progress.total})...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Analyze Batch Matrix</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Progress Bar */}
      {scanning && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Evaluating Target {progress.current} of {progress.total}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Batch Results Table */}
      {results.length > 0 && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-fadeIn">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Batch Scan Results ({results.length} URLs Processed)
            </h5>
            <span className="text-[11px] font-mono text-slate-400">
              {results.filter(r => r.status === 'Phishing').length} Threats Detected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400">
                <tr>
                  <th className="py-3 px-4">Target Domain</th>
                  <th className="py-3 px-4">Status Verdict</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Threat Level</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {results.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="font-semibold text-white truncate" title={row.url}>{row.domain}</p>
                      <p className="text-[11px] text-slate-500 truncate">{row.url}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {row.status === 'Phishing' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/50 text-rose-300 border border-rose-500/40">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          Phishing
                        </span>
                      ) : row.status === 'Suspicious' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/50 text-amber-300 border border-amber-500/40">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Suspicious
                        </span>
                      ) : row.status === 'Legitimate' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/40">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Legitimate
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={
                        row.riskScore >= 70 ? 'text-rose-400' :
                        row.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                      }>
                        {row.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-400">{row.threatLevel}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {row.raw && onSelectScan && (
                        <button
                          type="button"
                          onClick={() => onSelectScan(row.raw)}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/60 transition-all inline-flex items-center gap-1"
                        >
                          <span>Full Report</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

