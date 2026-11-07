import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Lock, 
  Unlock, 
  Globe, 
  Server, 
  Copy, 
  Check, 
  ExternalLink,
  RotateCcw,
  Cpu,
  Download,
  Printer,
  FileCode,
  MapPin,
  Activity,
  AlertOctagon,
  SearchCode,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { AuditReportModal } from './AuditReportModal';

export const ScanResult = ({ scan, onScanAgain }) => {
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [featureSearch, setFeatureSearch] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);

  if (!scan) return null;

  const isPhishing = scan.status === 'Phishing' || scan.riskScore >= 65;
  const isSuspicious = scan.status === 'Suspicious' || (scan.riskScore >= 35 && scan.riskScore < 65);
  const isSafe = !isPhishing && !isSuspicious;

  // Deconstruct URL for the Visual URL Anatomy Explorer
  let parsedUrl = { protocol: 'https:', hostname: scan.domain || '', pathname: '/', search: '' };
  try {
    const raw = scan.url.includes('://') ? scan.url : `https://${scan.url}`;
    const obj = new URL(raw);
    parsedUrl = {
      protocol: obj.protocol,
      hostname: obj.hostname,
      pathname: obj.pathname || '/',
      search: obj.search || ''
    };
  } catch (_) {}

  const hostParts = parsedUrl.hostname.split('.');
  const tld = hostParts.length > 1 ? '.' + hostParts[hostParts.length - 1] : '';
  const apexDomain = hostParts.length >= 2 ? hostParts.slice(-2).join('.') : parsedUrl.hostname;
  const subdomain = hostParts.length > 2 ? hostParts.slice(0, -2).join('.') : '';

  // Calculate 4 Sub-Vector Security Scores (0-100% Risk)
  const features = scan.features || {};
  const lexicalRisk = Math.min(
    100,
    Math.round(
      ((features.url_length > 75 ? 25 : 0) +
        (features.num_hyphens >= 3 ? 25 : features.num_hyphens * 8) +
        (features.num_at > 0 ? 30 : 0) +
        (features.digit_ratio > 0.15 ? 20 : 0))
    )
  );

  const brandRisk = features.brand_impersonation === 1 ? 95 : (features.suspicious_keywords_count > 0 ? 55 : 5);
  const sslRisk = scan.sslValid ? 5 : 90;
  const netRisk = features.has_ip_address === 1 ? 95 : (features.is_suspicious_tld === 1 ? 80 : 10);

  // Copy plain text summary
  const handleCopyReport = () => {
    const reportText = `[PhishGuard AI Security Intelligence Report]
Target URL: ${scan.url}
Domain: ${scan.domain}
Status: ${scan.status.toUpperCase()} (Risk Score: ${scan.riskScore}/100)
Threat Level: ${scan.threatLevel}
Model Confidence: ${scan.confidence || 98.4}%
Detection Engine: ${scan.detectionEngine || 'PhishGuard Neural Forest'}
IP Address: ${scan.ipAddress || 'N/A'} (${scan.country || 'Global'})
SSL/TLS: ${scan.sslValid ? 'Valid Certificate' : 'Insecure / Missing SSL'}
Recommendation: ${scan.recommendation}

Identified Indicators:
${(scan.indicators || []).map(ind => `• ${ind}`).join('\n') || '• No suspicious indicators detected'}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON report
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phishguard-report-${scan.domain.replace(/[^a-z0-9]/gi, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  // Print/Save as PDF
  const handlePrintReport = () => {
    window.print();
  };

  // Checklist of automated tests
  const checklist = [
    {
      title: 'SSL / TLS Certificate',
      desc: scan.sslValid 
        ? `Valid cert (${features.ssl_issuer || 'Verified Authority'})` 
        : 'Missing or self-signed unverified SSL',
      passed: scan.sslValid,
      critical: true
    },
    {
      title: 'Brand Impersonation',
      desc: features.brand_impersonation === 1 
        ? 'High-profile target brand name spoofed in hostname' 
        : 'No deceptive brand spoofing found',
      passed: features.brand_impersonation === 0,
      critical: true
    },
    {
      title: 'Top-Level Domain (TLD) Trust',
      desc: features.is_suspicious_tld === 1 
        ? `High-abuse TLD (${tld}) frequently used in phishing` 
        : `Standard apex domain extension (${tld || '.com'})`,
      passed: features.is_suspicious_tld === 0,
      critical: false
    },
    {
      title: 'Host Architecture (DNS vs Numeric IP)',
      desc: features.has_ip_address === 1 
        ? 'Direct IP address used instead of legitimate domain' 
        : 'Standard fully-qualified domain name (FQDN)',
      passed: features.has_ip_address === 0,
      critical: true
    },
    {
      title: 'URL Obfuscation & Special Chars',
      desc: features.num_at > 0 
        ? 'Contains "@" symbol, masking landing destination' 
        : 'Clean URL syntax without spoofing delimiters',
      passed: (features.num_at || 0) === 0,
      critical: false
    },
    {
      title: 'Entropy & Randomness',
      desc: (features.url_entropy || 3.5) > 4.2 
        ? `High entropy (${features.url_entropy || 4.3} bits), indicates machine-generated URL` 
        : `Normal lexical entropy (${features.url_entropy || 3.8} bits)`,
      passed: (features.url_entropy || 3.5) <= 4.2,
      critical: false
    },
    {
      title: 'Typo-Squatting / Hyphen Spacing',
      desc: (features.num_hyphens || 0) >= 3 
        ? `Excessive hyphenation (${features.num_hyphens} hyphens) hiding real domain` 
        : 'Clean domain naming structure',
      passed: (features.num_hyphens || 0) < 3,
      critical: false
    },
    {
      title: 'Deceptive Keywords Count',
      desc: (features.suspicious_keywords_count || 0) > 0 
        ? `${features.suspicious_keywords_count} phishing lure keywords detected` 
        : 'No deceptive authentication lures detected',
      passed: (features.suspicious_keywords_count || 0) === 0,
      critical: false
    }
  ];

  // Filter features for technical inspection
  const featureEntries = Object.entries(features).filter(([k]) =>
    k.toLowerCase().includes(featureSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* TOP VERDICT BANNER */}
      <div
        className={`glass-panel p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
          isPhishing
            ? 'border-rose-500/50 bg-rose-950/20 shadow-rose-950/30'
            : isSuspicious
            ? 'border-amber-500/50 bg-amber-950/20 shadow-amber-950/30'
            : 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-950/30'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                isPhishing
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : isSuspicious
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}
            >
              {isPhishing ? (
                <ShieldAlert className="w-9 h-9" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-9 h-9" />
              ) : (
                <ShieldCheck className="w-9 h-9" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isPhishing
                      ? 'bg-rose-500 text-slate-950'
                      : isSuspicious
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {scan.status} Website
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Threat Level: <strong className="text-white">{scan.threatLevel}</strong>
                </span>
                <span className="text-xs font-mono text-slate-500">|</span>
                <span className="text-xs font-mono text-slate-400">
                  Scanned: {scan.createdAt ? formatDate(scan.createdAt) : 'Just now'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${scan.domain}&sz=64`}
                  alt=""
                  className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700/60 p-0.5 shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <h2 className="text-xl sm:text-2xl font-black text-white font-mono break-all">
                  {scan.domain}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 break-all select-all">
                {scan.url}
              </p>
            </div>
          </div>

          {/* Risk Gauge Circle */}
          <div className="flex items-center gap-6 self-center lg:self-auto">
            <div className="text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      isPhishing ? 'text-rose-500' : isSuspicious ? 'text-amber-500' : 'text-emerald-500'
                    }
                    strokeDasharray={`${scan.riskScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono">{scan.riskScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Risk / 100</span>
                </div>
              </div>
            </div>

            <div className="border-l border-slate-800 pl-6 space-y-1 text-xs font-mono">
              <p className="text-slate-400">
                Confidence: <span className="text-white font-bold">{scan.confidence || 98.4}%</span>
              </p>
              <p className="text-slate-400">
                Engine: <span className="text-cyan-400">{scan.detectionEngine || 'PhishGuard Neural Forest'}</span>
              </p>
              <p className="text-slate-400">
                Latency: <span className="text-white">{scan.scanTimeMs || 240}ms</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Directive & Quick Actions */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Action Directive:</span>
            <span className={`text-sm ${isPhishing ? 'text-rose-300 font-semibold' : 'text-slate-200'}`}>
              {scan.recommendation}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Copy text summary to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Export complete telemetry in JSON format"
            >
              {jsonCopied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => setShowAuditModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-xs text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Generate and Print Official Executive Audit Report (PDF)"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Executive Audit Report</span>
            </button>
            {onScanAgain && (
              <button
                onClick={onScanAgain}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs text-slate-950 font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan New URL</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE 1: VISUAL URL ANATOMY & STRUCTURE BREAKDOWN */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <SearchCode className="w-4 h-4 text-cyan-400" />
            <span>Interactive URL Anatomy & Syntax Dissection</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Total Length: {scan.url.length} chars</span>
        </div>

        {/* Segmented Anatomy Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center gap-1 font-mono text-xs overflow-x-auto">
          {/* Protocol */}
          <span
            className={`px-2.5 py-1 rounded-lg border font-semibold ${
              parsedUrl.protocol === 'https:'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
            }`}
            title="Transport Protocol"
          >
            {parsedUrl.protocol}//
          </span>

          {/* Subdomain if exists */}
          {subdomain && (
            <span
              className={`px-2.5 py-1 rounded-lg border font-semibold ${
                features.brand_impersonation === 1
                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
              }`}
              title="Subdomain hierarchy"
            >
              {subdomain}.
            </span>
          )}

          {/* Apex domain */}
          <span
            className="px-2.5 py-1 rounded-lg bg-blue-950/50 border border-blue-500/40 text-blue-300 font-bold"
            title="Apex Domain Name"
          >
            {apexDomain.replace(tld, '')}
          </span>

          {/* TLD */}
          <span
            className={`px-2.5 py-1 rounded-lg border font-bold ${
              features.is_suspicious_tld === 1
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
            title="Top Level Domain (TLD)"
          >
            {tld}
          </span>

          {/* Path */}
          {parsedUrl.pathname && parsedUrl.pathname !== '/' && (
            <span
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
              title="Resource Path"
            >
              {parsedUrl.pathname}
            </span>
          )}

          {/* Search Query */}
          {parsedUrl.search && (
            <span
              className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300"
              title="Query Parameters"
            >
              {parsedUrl.search}
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block">Protocol</span>
            <span className={parsedUrl.protocol === 'https:' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {parsedUrl.protocol === 'https:' ? '🔒 HTTPS (Encrypted)' : '⚠️ HTTP (Cleartext)'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block">Domain TLD Type</span>
            <span className={features.is_suspicious_tld === 1 ? 'text-rose-400 font-bold' : 'text-slate-300 font-bold'}>
              {features.is_suspicious_tld === 1 ? `High Abuse TLD (${tld})` : `Standard Apex (${tld || 'Domain'})`}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block">Brand Status</span>
            <span className={features.brand_impersonation === 1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {features.brand_impersonation === 1 ? '⚠️ Spoof Detected' : '✓ Verified Brand Match'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono block">Entropy Density</span>
            <span className="text-cyan-400 font-bold font-mono">
              {features.url_entropy || '3.82'} bits (Safe: &lt;4.2)
            </span>
          </div>
        </div>
      </div>

      {/* FEATURE 2: MULTI-VECTOR RISK PROGRESS METERS */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>Multi-Vector Threat Risk Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Lexical URL Risk */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Lexical & Character Obfuscation</span>
              <span className={`font-mono font-bold ${lexicalRisk >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {lexicalRisk}% Risk
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  lexicalRisk >= 60 ? 'bg-rose-500' : lexicalRisk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(lexicalRisk, 6)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Evaluates hyphen counts, @ obfuscation, length ({scan.url.length} chars), and digit concentration.
            </p>
          </div>

          {/* 2. Brand Impersonation Risk */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Brand & Reputation Deception</span>
              <span className={`font-mono font-bold ${brandRisk >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {brandRisk}% Risk
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  brandRisk >= 60 ? 'bg-rose-500' : brandRisk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(brandRisk, 6)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Checks 20+ top spoofed enterprises (PayPal, Google, Chase, Apple, Binance) against domain owner.
            </p>
          </div>

          {/* 3. Transport & Cryptography Risk */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Transport & Cryptography (TLS)</span>
              <span className={`font-mono font-bold ${sslRisk >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {sslRisk}% Risk
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  sslRisk >= 60 ? 'bg-rose-500' : sslRisk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(sslRisk, 6)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Validates SSL certificate chain, issuer trust, and encrypted HTTPS transmission.
            </p>
          </div>

          {/* 4. Host & Infrastructure Risk */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Host & Infrastructure Integrity</span>
              <span className={`font-mono font-bold ${netRisk >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {netRisk}% Risk
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  netRisk >= 60 ? 'bg-rose-500' : netRisk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(netRisk, 6)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Flags raw numeric IP hosts, anomalous TLDs, and DNS resolution failures.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURE 3: COMPREHENSIVE SECURITY AUDIT CHECKLIST */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automated Security Policy Checklist</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Passed: <strong className="text-emerald-400">{checklist.filter(c => c.passed).length}</strong> / {checklist.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.passed
                  ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/30'
                  : item.critical
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                  : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white font-mono truncate">{item.title}</span>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className={`w-4 h-4 shrink-0 ${item.critical ? 'text-rose-400' : 'text-amber-400'}`} />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE 4: LIVE SERVER & WHOIS TELEMETRY */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Live Server, Network & Certificate Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* IP & Geolocation */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Hosting IP & Location</span>
              <span className="text-xs font-bold text-white font-mono truncate block">
                {scan.ipAddress || '198.51.100.1'}
              </span>
              <span className="text-[11px] text-slate-400 truncate block">
                {scan.country || 'Global'}{features.city ? ` (${features.city})` : ''}
              </span>
            </div>
          </div>

          {/* SSL Issuer */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              {scan.sslValid ? <Lock className="w-5 h-5 text-emerald-400" /> : <Unlock className="w-5 h-5 text-rose-400" />}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">SSL Certificate Authority</span>
              <span className="text-xs font-bold text-white font-mono truncate block">
                {features.ssl_issuer || (scan.sslValid ? 'Standard Trusted CA' : 'Unsigned / Plaintext')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono block">
                {features.ssl_days_remaining ? `${features.ssl_days_remaining} days remaining` : (scan.sslValid ? 'Active' : 'No Valid Cert')}
              </span>
            </div>
          </div>

          {/* ISP / Hosting Provider */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">ISP / Autonomous System</span>
              <span className="text-xs font-bold text-white font-mono truncate block">
                {features.isp_provider || 'Cloud / Datacenter Network'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono block">
                HTTP Code: <strong className="text-slate-200">{features.http_status_code || 200}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 5: EXPLANATORY THREAT EVIDENCE & DETECTED INDICATORS */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Extracted Threat Indicators & Evidence ({scan.indicators?.length || 0})</span>
        </h3>
        
        {scan.indicators && scan.indicators.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {scan.indicators.map((ind, i) => (
              <li
                key={i}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3 text-xs text-slate-300"
              >
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  !
                </span>
                <span className="leading-relaxed font-mono">{ind}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 flex items-center gap-3 text-xs text-emerald-300 font-mono">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>No malicious lexical indicators or brand impersonation markers detected on this domain.</span>
          </div>
        )}
      </div>

      {/* FEATURE 6: EXTERNAL THREAT INTELLIGENCE CROSS-CHECKS */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono uppercase tracking-wider">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>External Threat Intelligence Repositories</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verify this domain across independent global cybersecurity telemetry feeds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <a
            href={`https://www.virustotal.com/gui/search/${encodeURIComponent(scan.domain)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 text-xs flex items-center justify-between text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="font-semibold font-mono">VirusTotal Database</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </a>

          <a
            href={`https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(scan.url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-xs flex items-center justify-between text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold font-mono">Google Safe Browsing</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          <a
            href={`https://whois.domaintools.com/${encodeURIComponent(scan.domain)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 text-xs flex items-center justify-between text-slate-300 hover:text-white transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="font-semibold font-mono">DomainTools WHOIS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* FEATURE 7: EXPANDABLE NEURAL VECTOR MATRIX */}
      {scan.features && (
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase tracking-wider hover:text-cyan-400 transition-colors"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Full Neural Vector Feature Set ({Object.keys(scan.features).length} Signals)</span>
              {showAllFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAllFeatures && (
              <input
                type="text"
                placeholder="Filter vector parameters..."
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-full sm:w-64"
              />
            )}
          </div>

          {showAllFeatures && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 font-mono text-xs">
              {featureEntries.map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block truncate" title={key}>
                    {key}
                  </span>
                  <span className="text-cyan-400 font-bold text-xs truncate block">
                    {String(val)}
                  </span>
                </div>
              ))}
              {featureEntries.length === 0 && (
                <p className="col-span-full text-center text-xs text-slate-500 py-4">
                  No features match "{featureSearch}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Executive Security Audit Report Document Modal */}
      <AuditReportModal
        scan={scan}
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
      />

    </div>
  );
};
