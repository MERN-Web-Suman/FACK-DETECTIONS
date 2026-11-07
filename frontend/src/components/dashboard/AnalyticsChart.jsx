import React from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Target } from 'lucide-react';

export const AnalyticsChart = ({ analyticsData }) => {
  const topBrands = analyticsData?.topImpersonatedBrands || [
    { brand: 'PayPal', count: 184, percentage: 34 },
    { brand: 'Apple ID', count: 122, percentage: 22 },
    { brand: 'Chase Bank', count: 98, percentage: 18 },
    { brand: 'Microsoft 365', count: 74, percentage: 14 },
    { brand: 'Netflix', count: 65, percentage: 12 }
  ];

  const timeline = analyticsData?.timelineData || [
    { day: 'Mon', phishing: 24, safe: 85 },
    { day: 'Tue', phishing: 38, safe: 92 },
    { day: 'Wed', phishing: 45, safe: 110 },
    { day: 'Thu', phishing: 29, safe: 95 },
    { day: 'Fri', phishing: 52, safe: 130 },
    { day: 'Sat', phishing: 19, safe: 65 },
    { day: 'Sun', phishing: 15, safe: 58 }
  ];

  const maxVal = Math.max(...timeline.map((d) => d.phishing + d.safe), 160);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 7-Day Threat Activity Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Weekly Attack Volume Telemetry</span>
          </h4>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded bg-rose-500"></span> Phishing
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded bg-emerald-500"></span> Legitimate
            </span>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-800">
          {timeline.map((item, idx) => {
            const phishHeight = (item.phishing / maxVal) * 100;
            const safeHeight = (item.safe / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end gap-1 h-full justify-center">
                  <div
                    style={{ height: `${phishHeight}%` }}
                    className="w-1/2 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t transition-all group-hover:brightness-125"
                    title={`Phishing: ${item.phishing}`}
                  ></div>
                  <div
                    style={{ height: `${safeHeight}%` }}
                    className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all group-hover:brightness-125"
                    title={`Legitimate: ${item.safe}`}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-2">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Targeted Brands Radar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-400" />
            <span>Top Impersonated High-Value Brands</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">Share of Attacks</span>
        </div>

        <div className="space-y-3 pt-2">
          {topBrands.map((b, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">{b.brand}</span>
                <span className="text-slate-400">{b.count} incidents ({b.percentage}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  style={{ width: `${b.percentage}%` }}
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500 rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

