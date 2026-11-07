import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { ScanHistory as HistoryTable } from '../../components/dashboard/ScanHistory';
import { scanService } from '../../services/scanService';
import { Loader } from '../../components/common/Loader';
import { History, AlertTriangle, Trash2, X } from 'lucide-react';

export const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Custom delete confirmation state ---
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchScans = async () => {
    try {
      const response = await scanService.getScanHistory();
      if (response.data) {
        setScans(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  // Step 1: User clicks delete → open dialog
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setDeleteError('');
  };

  // Step 2: User cancels → close dialog
  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setDeleteError('');
  };

  // Step 3: User confirms → actually delete
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await scanService.deleteScan(confirmDeleteId);
      setScans(prev => prev.filter(s => String(s._id || s.id) !== String(confirmDeleteId)));
      setConfirmDeleteId(null);
      setDeleteError('');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete scan record');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="user" />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>My Security Scan Archive</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Historical log of all URLs evaluated through your account.
          </p>
        </div>

        {loading ? (
          <Loader message="Loading your scan history..." />
        ) : (
          <HistoryTable scans={scans} onDelete={handleDeleteClick} />
        )}
      </main>

      {/* ── Custom In-Page Delete Confirmation Modal ── */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />

          {/* Dialog Card */}
          <div className="relative z-10 bg-slate-900 border border-red-500/40 rounded-xl shadow-2xl shadow-red-900/30 p-6 w-full max-w-sm mx-4">
            {/* Close button */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
              disabled={deleting}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon + Title */}
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-white font-bold font-mono text-base">Delete Scan Record</h2>
                <p className="text-slate-400 text-xs mt-1 font-mono leading-relaxed">
                  This scan record will be permanently deleted.<br />
                  Are you sure you want to proceed?
                </p>
              </div>
            </div>

            {/* Inline error */}
            {deleteError && (
              <div className="mb-4 px-3 py-2 bg-red-900/30 border border-red-500/40 rounded-lg text-red-400 text-xs font-mono text-center">
                {deleteError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
