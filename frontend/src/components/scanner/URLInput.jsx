import React from 'react';
import { Globe, X, ClipboardPaste } from 'lucide-react';

export const URLInput = ({ url, setUrl, disabled, error, onSubmit }) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch (_) {}
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Globe className="w-5 h-5 text-cyan-400" />
        </div>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled}
          placeholder="Enter website URL (e.g. https://example.com or suspicious-site.xyz)"
          className={`w-full bg-slate-950/80 text-white placeholder-slate-500 pl-12 pr-24 py-4 rounded-2xl border font-mono text-sm sm:text-base focus:outline-none transition-all shadow-inner ${
            error 
              ? 'border-rose-500 focus:border-rose-500' 
              : 'border-slate-800 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)]'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {url && !disabled && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            disabled={disabled}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-cyan-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-cyan-500/40 transition-all"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-400 font-mono flex items-center gap-1 pl-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

