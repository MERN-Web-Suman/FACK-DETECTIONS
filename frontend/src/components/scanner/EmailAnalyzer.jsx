import React, { useState } from 'react';
import { scanService } from '../../services/scanService';
import { Mail, ShieldAlert, ShieldCheck, AlertTriangle, Play, Sparkles, Loader2, ArrowRight, ExternalLink } from 'lucide-react';

export const EmailAnalyzer = ({ onScanUrl, disabled }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const sampleEmails = [
    {
      title: 'PayPal Account Suspended',
      badge: 'Phishing Sample',
      subject: 'URGENT: Your PayPal Account Has Been Suspended Within 24 Hours',
      body: 'Dear customer,\n\nWe detected unauthorized login attempts from an unknown device. Your access has been locked. Immediate action is required to verify your password and confirm identity.\n\nClick below to re-activate your profile:\nhttp://paypal-security-verification-portal.com/login.php\n\nIf you do not act now, your account will be terminated permanently.\n\nSecurity Team'
    },
    {
      title: 'CEO Wire Transfer Request',
      badge: 'BEC Fraud Bait',
      subject: 'Urgent Wire Transfer Request - Confidential Acquisition',
      body: 'Hi,\n\nAre you currently at your desk? I need an immediate wire transfer processed today for a confidential vendor acquisition. The invoice attached requires remittance to our new bank details.\n\nPlease reply directly and do not discuss with others. Send the funds confirmation once done.\n\nBest regards,\nChief Executive Officer'
    },
    {
      title: 'Legitimate Meeting Summary',
      badge: 'Safe Sample',
      subject: 'Sprint Planning Notes - Q2 Architecture Review',
      body: 'Hello Team,\n\nThanks for joining today’s roadmap sync. We reviewed the upcoming sprint deliverables and finalized the engineering milestones.\n\nPlease review the documentation on our GitHub repository when you have a moment:\nhttps://github.com/trending\n\nLet me know if you have any questions.\n\nBest,\nProduct Team'
    }
  ];

  const handleAnalyze = async () => {
    if (!subject.trim() && !body.trim()) {
      setError('Please provide an email subject or message body to analyze.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await scanService.analyzeEmail(subject, body);
      if (res && res.data) {
        setResult(res.data);
      } else {
        setError('Received unexpected response from NLP threat engine.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze email content.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setSubject(sample.subject);
    setBody(sample.body);
    setError('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Informational Header */}
      <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold flex items-center gap-2">
            <span>Phishing Email NLP &amp; Social Engineering Detector</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">NLP</span>
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5 leading-relaxed">
            Detect coercive urgency, Business Email Compromise (BEC), and credential harvesting lures within email text before anyone clicks.
          </p>
        </div>
      </div>

      {/* Preset Templates */}
      <div>
        <p className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load real-world email threat templates:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleEmails.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sample.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {sample.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{sample.subject}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">Email Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading || disabled}
            placeholder="e.g. URGENT: Action required on your security settings"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">Email Body Content</label>
          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading || disabled}
            placeholder="Paste raw email body text or message here..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono transition-all"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || disabled || (!subject.trim() && !body.trim())}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing NLP Semantic Indicators...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Analyze Email Social Engineering</span>
            </>
          )}
        </button>
      </div>

      {/* NLP Analysis Result */}
      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn shadow-2xl">
          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            result.verdict === 'Phishing'
              ? 'bg-rose-950/40 border-rose-500/40'
              : result.verdict === 'Suspicious'
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <div className="flex items-center gap-3">
              {result.verdict === 'Phishing' ? (
                <ShieldAlert className="w-7 h-7 text-rose-400" />
              ) : result.verdict === 'Suspicious' ? (
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              )}
              <div>
                <h4 className="text-base font-bold text-white font-mono">
                  Verdict: {result.verdict} Threat Detected
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Threat Level: {result.threatLevel} | Risk Score: {result.riskScore}/100
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black font-mono ${
                result.riskScore >= 65 ? 'text-rose-400' :
                result.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {result.riskScore}%
              </span>
            </div>
          </div>

          {/* Metric Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Coercive Urgency</span>
                <span className="font-bold text-white">{result.urgencyScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${result.urgencyScore}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Financial / BEC Bait</span>
                <span className="font-bold text-white">{result.financialRiskScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${result.financialRiskScore}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Credential Harvest Risk</span>
                <span className="font-bold text-white">{result.credentialHarvestRisk}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${result.credentialHarvestRisk}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
            <span className="text-cyan-400 font-bold block mb-1">AI Security Recommendation:</span>
            {result.recommendation}
          </div>

          {/* Detected Red Flags */}
          {result.detectedIndicators && result.detectedIndicators.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Semantic Signal Triggers ({result.detectedIndicators.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.detectedIndicators.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span className="truncate">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted URLs to inspect */}
          {result.extractedUrls && result.extractedUrls.length > 0 && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-300">
                  Suspicious URLs Found in Email Body ({result.extractedUrls.length})
                </span>
                <span className="text-[10px] font-mono text-slate-400">Click to inspect</span>
              </div>
              <div className="space-y-2">
                {result.extractedUrls.map((u, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-300 truncate">{u}</span>
                    <button
                      type="button"
                      onClick={() => onScanUrl && onScanUrl(u)}
                      className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-all text-[11px] shrink-0 inline-flex items-center gap-1"
                    >
                      <span>Deep Scan with AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

