import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, Loader2, X, RefreshCw, KeyRound, ExternalLink } from 'lucide-react';
import { systemService } from '../../services/systemService';

export const DbConnectModal = ({ isOpen, onClose, onConnected }) => {
  const [dbStatus, setDbStatus] = useState(null);
  const [mongoURI, setMongoURI] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await systemService.getDbStatus();
      if (res.data) {
        setDbStatus(res.data);
      }
    } catch (_) { }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!mongoURI.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a valid MongoDB connection string.' });
      return;
    }

    setConnecting(true);
    setFeedback(null);

    try {
      const res = await systemService.connectDb(mongoURI.trim());
      setFeedback({ type: 'success', message: res.message || 'Connected to MongoDB successfully!' });
      await fetchStatus();
      setMongoURI('');
      if (onConnected) onConnected();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Could not connect to MongoDB with this URL.'
      });
    } finally {
      setConnecting(false);
    }
  };

  const handlePresetLocal = () => {
    setMongoURI('mongodb://127.0.0.1:27017/phishing_detector');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Database className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <span>Connect MongoDB Database</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Store real-time URL scan records & telemetry directly in your database
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Current Storage State:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold ${dbStatus?.connected
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              {dbStatus?.connected ? 'Live MongoDB Connected' : 'In-Memory Store (Connect URL below)'}
            </span>
          </div>

          {dbStatus?.connected && (
            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-300">
              <p>Host: <span className="text-cyan-400">{dbStatus.host}</span></p>
              <p>Database: <span className="text-white">{dbStatus.dbName}</span></p>
              <p>Masked URI: <span className="text-slate-500">{dbStatus.uriMasked}</span></p>
              <p>Total Scans Saved: <span className="text-emerald-400 font-bold">{dbStatus.totalScans}</span></p>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono flex items-start gap-2.5 border ${feedback.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Connect Form */}
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                MongoDB Connection String (URI)
              </label>
              <button
                type="button"
                onClick={handlePresetLocal}
                className="text-[11px] font-mono text-cyan-400 hover:underline"
              >
                Use Local URI
              </button>
            </div>

            <input
              type="text"
              value={mongoURI}
              onChange={(e) => setMongoURI(e.target.value)}
              placeholder="mongodb+srv://<user>:<password>@cluster0.mongodb.net/phishing_detector?retryWrites=true&w=majority"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
            />
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Supports MongoDB Atlas, cloud clusters, or local MongoDB instances.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs text-slate-400 font-mono transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={connecting || !mongoURI.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg ${connecting || !mongoURI.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing & Connecting...</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Connect & Store in MongoDB</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

