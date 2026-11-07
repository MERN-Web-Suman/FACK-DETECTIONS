import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import api from '../../services/api';
import {
  User, Mail, Shield, KeyRound, Check, AlertCircle,
  Copy, RefreshCw, Eye, EyeOff, Code2, Terminal
} from 'lucide-react';

export const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [keyGenerating, setKeyGenerating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState('curl'); // 'curl' | 'python' | 'node'

  useEffect(() => {
    const fetchUserKey = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.data && res.data.apiKey) {
          setApiKey(res.data.apiKey);
        }
      } catch (_) {}
    };
    fetchUserKey();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const payload = { name, avatar };
      if (password) payload.password = password;

      const res = await api.put('/users/profile', payload);
      if (res.data) {
        setMessage('Profile updated successfully!');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateKey = async () => {
    setKeyGenerating(true);
    try {
      const res = await authService.generateApiKey();
      if (res.apiKey) {
        setApiKey(res.apiKey);
        setShowKey(true);
      }
    } catch (err) {
      setError('Failed to generate API Key: ' + (err.response?.data?.message || err.message));
    } finally {
      setKeyGenerating(false);
    }
  };

  const handleCopyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    curl: `curl -X POST "http://localhost:5000/api/scans/analyze" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey || 'YOUR_API_KEY_HERE'}" \\
  -d '{"url": "https://example.com"}'`,
    python: `import requests

url = "http://localhost:5000/api/scans/analyze"
headers = {
    "x-api-key": "${apiKey || 'YOUR_API_KEY_HERE'}",
    "Content-Type": "application/json"
}
payload = {"url": "https://example.com"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    node: `import axios from 'axios';

const response = await axios.post(
  'http://localhost:5000/api/scans/analyze',
  { url: 'https://example.com' },
  {
    headers: {
      'x-api-key': '${apiKey || 'YOUR_API_KEY_HERE'}',
      'Content-Type': 'application/json'
    }
  }
);
console.log(response.data);`
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="user" />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-4xl">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>Profile &amp; Security Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage your personal credentials, profile settings, and developer API keys.
          </p>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10"
            />
            <div>
              <h2 className="text-base font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Avatar Image URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">New Password (leave empty to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
            >
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* ── Feature 4: Developer API Key Section ── */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span>Developer API Credentials</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">REST API</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Automate phishing scans in your own scripts using an authenticated API key.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateKey}
              disabled={keyGenerating}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${keyGenerating ? 'animate-spin' : ''}`} />
              <span>{apiKey ? 'Regenerate Key' : 'Generate Key'}</span>
            </button>
          </div>

          {/* API Key Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Secret API Key (Header: x-api-key)</span>
              {apiKey && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active Key
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-cyan-300 overflow-x-auto select-all">
                {apiKey ? (
                  showKey ? apiKey : apiKey.slice(0, 10) + '•'.repeat(24) + apiKey.slice(-4)
                ) : (
                  <span className="text-slate-500 italic">No API key generated yet. Click Generate Key above.</span>
                )}
              </div>

              {apiKey && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors relative"
                    title="Copy API key"
                  >
                    <Copy className="w-4 h-4" />
                    {copied && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono">
                        Copied!
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Integration Code Snippets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Code Integration Snippets:</span>
              </span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['curl', 'python', 'node'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSnippetTab(tab)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-bold transition-all ${
                      activeSnippetTab === tab
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
              <pre className="text-cyan-400">{codeSnippets[activeSnippetTab]}</pre>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
