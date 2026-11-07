import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { scanService } from '../services/scanService';
import { ScanResult as ResultView } from '../components/scanner/ScanResult';
import { Loader } from '../components/common/Loader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const ScanResult = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const response = await scanService.getScanById(id);
        if (response.data) {
          setScan(response.data);
        } else {
          setError('Scan report not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load scan report.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchScan();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader message="Retrieving cryptographic report..." />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="py-16 max-w-xl mx-auto px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-mono">Report Not Found</h2>
        <p className="text-sm text-slate-400 font-mono">{error || 'This scan record does not exist or has expired.'}</p>
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/scanner"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">Report ID: {scan._id || scan.id}</span>
      </div>

      <ResultView scan={scan} />
    </div>
  );
};

