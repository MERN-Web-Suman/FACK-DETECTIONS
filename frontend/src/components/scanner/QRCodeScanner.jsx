import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { QrCode, Upload, CheckCircle2, AlertTriangle, ArrowRight, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

export const QRCodeScanner = ({ onScanUrl, disabled }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [decodedUrl, setDecodedUrl] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Pre-generated Demo QR Data URIs for instant testing
  const sampleQrs = [
    {
      title: 'Phishing QR Sample',
      desc: 'PayPal Credential Harvest',
      url: 'http://paypal-security-verification-portal.com/login.php',
      badgeColor: 'border-rose-500/40 bg-rose-950/30 text-rose-300'
    },
    {
      title: 'Legitimate QR Sample',
      desc: 'Verified Apple ID Portal',
      url: 'https://appleid.apple.com',
      badgeColor: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
    },
    {
      title: 'Suspicious Spoof QR',
      desc: 'Apple ID XYZ Domain',
      url: 'http://apple-id-verify-account-locked.xyz/recover',
      badgeColor: 'border-amber-500/40 bg-amber-950/30 text-amber-300'
    }
  ];

  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    setError('');
    setDecodedUrl('');
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);

      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, image.width, image.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            setDecodedUrl(code.data.trim());
          } else {
            setError('No valid QR code detected in this image. Please upload a clear QR code.');
          }
        } catch (err) {
          setError('Failed to decode image data: ' + err.message);
        } finally {
          setProcessing(false);
        }
      };
      image.onerror = () => {
        setError('Could not load the selected image.');
        setProcessing(false);
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSelectSample = (sample) => {
    setDecodedUrl(sample.url);
    setImagePreview(null);
    setError('');
  };

  const handleProceedScan = () => {
    if (decodedUrl && onScanUrl) {
      onScanUrl(decodedUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quishing Information Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
          <QrCode className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold flex items-center gap-2">
            <span>Quishing Defense (QR-Phishing Detector)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">NEW</span>
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5 leading-relaxed">
            Attackers hide malicious URLs inside QR codes to bypass email spam filters. Upload or drop any QR code image below to decode and analyze its target destination.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          imagePreview
            ? 'border-cyan-500/50 bg-slate-900/40'
            : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => processImageFile(e.target.files[0])}
          className="hidden"
        />

        {imagePreview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-cyan-500/40 bg-black/50 p-2 shadow-xl shadow-cyan-950/40">
              <img src={imagePreview} alt="QR Preview" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              Click or drag another image to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Drag and drop your QR code image here, or <span className="text-cyan-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500 font-mono mt-1">Supports PNG, JPG, JPEG, WEBP</p>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Decoded Target Result Card */}
      {decodedUrl && (
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>QR Code Successfully Decoded</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Destination Extracted</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm break-all text-cyan-300 select-all">
            {decodedUrl}
          </div>

          <button
            type="button"
            onClick={handleProceedScan}
            disabled={disabled}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <span>Scan Decoded URL with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Test Demo Samples */}
      <div className="pt-2">
        <p className="text-xs font-mono text-slate-500 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Or test with verified sample targets:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {sampleQrs.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(s)}
              className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] ${s.badgeColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{s.title}</span>
                <span className="text-[10px] font-mono opacity-70">Demo</span>
              </div>
              <p className="text-[11px] opacity-80 font-mono mt-1 truncate">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

