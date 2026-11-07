import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { URLInput } from '../components/scanner/URLInput';
import { ScanButton } from '../components/scanner/ScanButton';
import { ScanProgress } from '../components/scanner/ScanProgress';
import { ScanResult } from '../components/scanner/ScanResult';
import { QRCodeScanner } from '../components/scanner/QRCodeScanner';
import { BulkScanner } from '../components/scanner/BulkScanner';
import { EmailAnalyzer } from '../components/scanner/EmailAnalyzer';
import { scanService } from '../services/scanService';
import { AuthContext } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { Shield, Sparkles, Globe, QrCode, Layers, Mail, Lock } from 'lucide-react';

export const Scanner = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'qr' | 'bulk' | 'email'
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);
  const { openAuthModal } = useAuthModal();

  const presets = [
    { type: 'Phishing', url: 'http://paypal-security-verification-portal.com/login.php', color: 'rose' },
    { type: 'Phishing (.xyz)', url: 'http://apple-id-verify-account-locked.xyz/recover', color: 'rose' },
    { type: 'Direct IP Phish', url: 'http://192.168.1.102/bank-login/auth.html', color: 'amber' },
    { type: 'Legitimate', url: 'https://appleid.apple.com', color: 'emerald' },
    { type: 'Legitimate', url: 'https://github.com/trending', color: 'emerald' }
  ];

  const requireAuth = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return false;
    }
    return true;
  };

  const handleScan = async (targetUrl = url) => {
    if (!requireAuth()) return;

    const toScan = (targetUrl || '').trim();
    if (!toScan) {
      setError('Please provide a valid URL to analyze.');
      return;
    }

    setUrl(toScan);
    setError('');
    setLoading(true);
    setResult(null);

    // Switch to URL view to see the scan in action
    setActiveTab('url');

    try {
      const [apiResponse] = await Promise.all([
        scanService.analyzeUrl(toScan),
        new Promise((resolve) => setTimeout(resolve, 1400))
      ]);

      if (apiResponse && apiResponse.data) {
        setResult(apiResponse.data);
      } else {
        setError('Received unexpected response from scanning engine.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while contacting scanning engine.');
    } finally {
      setLoading(false);
    }
  };

  // Direct select scan result from bulk table
  const handleSelectBulkResult = (rawScan) => {
    setResult(rawScan);
    setUrl(rawScan.url);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  useEffect(() => {
    const queryUrl = searchParams.get('url');
    if (queryUrl && isAuthenticated) {
      setUrl(queryUrl);
      handleScan(queryUrl);
    }
  }, [searchParams, isAuthenticated]);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Neural Heuristic &amp; NLP Threat Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Threat Defense &amp; Phishing Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Detect malicious URLs, deceptive QR codes (quishing), batch domain risks, and coercive email bait.
        </p>
      </div>

      {/* Auth Notice for Guests */}
      {!isAuthenticated && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-950/30 border border-amber-500/25 cursor-pointer hover:bg-amber-950/50 transition-all"
          onClick={() => openAuthModal('login')}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-amber-200 text-sm font-semibold">Sign in required to execute scans</p>
            <p className="text-amber-400/70 text-xs font-mono">
              Please <span className="underline text-amber-300 font-bold">sign in</span> or <span className="underline text-amber-300 font-bold">create an account</span> to run live AI scans.
            </p>
          </div>
        </div>
      )}

      {/* ── Mode Selection Navigation Tabs ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'url'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Single URL Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'qr'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span>QR (Quishing) Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bulk'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Batch / Bulk Scanner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'email'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4 text-rose-400" />
          <span>Email Threat Analyzer</span>
        </button>
      </div>

      {/* ── Tab Content Panels ── */}

      {/* Tab 1: Single URL */}
      {activeTab === 'url' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
            className="space-y-4"
          >
            <URLInput
              url={url}
              setUrl={setUrl}
              disabled={loading}
              error={error}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-500">Preset Demos:</span>
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (!requireAuth()) return;
                      setUrl(p.url);
                      handleScan(p.url);
                    }}
                    className={`px-2 py-0.5 rounded-lg border text-[11px] transition-all ${
                      p.color === 'rose'
                        ? 'border-rose-900/50 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40'
                        : p.color === 'amber'
                        ? 'border-amber-900/50 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40'
                        : 'border-emerald-900/50 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40'
                    }`}
                  >
                    {p.type}
                  </button>
                ))}
              </div>

              <ScanButton loading={loading} disabled={!url.trim()} />
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: QR (Quishing) Scanner */}
      {activeTab === 'qr' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl animate-fadeIn">
          <QRCodeScanner
            onScanUrl={(decodedUrl) => {
              if (requireAuth()) {
                handleScan(decodedUrl);
              }
            }}
            disabled={loading}
          />
        </div>
      )}

      {/* Tab 3: Bulk / Batch Scanner */}
      {activeTab === 'bulk' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl animate-fadeIn">
          <BulkScanner
            onSelectScan={handleSelectBulkResult}
            disabled={!isAuthenticated}
          />
        </div>
      )}

      {/* Tab 4: Email Threat Analyzer */}
      {activeTab === 'email' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl animate-fadeIn">
          <EmailAnalyzer
            onScanUrl={(extractedUrl) => {
              if (requireAuth()) {
                handleScan(extractedUrl);
              }
            }}
            disabled={!isAuthenticated}
          />
        </div>
      )}

      {/* Loading Progress State */}
      {loading && <ScanProgress targetUrl={url} />}

      {/* Render Deep Dissection Scan Result */}
      {result && !loading && (
        <ScanResult
          scan={result}
          onScanAgain={() => {
            setResult(null);
            setUrl('');
          }}
        />
      )}
    </div>
  );
};
