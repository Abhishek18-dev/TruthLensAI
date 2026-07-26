import React, { useEffect, useState } from "react";
import { 
  FileText, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  Cpu
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { truthLensApi } from "../services/api";
import type { AnalyticsResponse } from "../services/api";

export const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await truthLensApi.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-pulse">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#E8E2D5] dark:border-[#1B2A4A]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#C5A880] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-[#1A2536] dark:text-[#F4EFE6] tracking-wide">
          Loading dashboard metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-slideUp">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        
        {/* TOTAL SCANS */}
        <div className="glass-panel card-hover rounded-2xl p-6 border border-[#E8E2D5] dark:border-[#1B2A4A] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/50 dark:bg-[#101F42]/50 shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#1A2536]/70 dark:text-[#F4EFE6]/70 uppercase tracking-widest">Total Scans</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FAF7F0] to-[#E8E2D5] dark:from-[#1B2A4A] dark:to-[#0A1128] border border-[#E8E2D5] dark:border-[#1B2A4A] shadow-sm">
              <FileText size={18} className="text-[#1E3A8A] dark:text-[#C5A880]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">{analytics.total_predictions}</span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center border border-emerald-200/50 dark:border-emerald-800/50">
                +12% ↗
              </span>
            </div>
            <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-medium">Aggregated workspace scans</span>
          </div>
        </div>

        {/* FAKE/MISLEADING RATE */}
        <div className="glass-panel card-hover rounded-2xl p-6 border border-[#E8E2D5] dark:border-[#1B2A4A] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/50 dark:bg-[#101F42]/50 shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#1A2536]/70 dark:text-[#F4EFE6]/70 uppercase tracking-widest">Fake Rate</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-950/40 border border-red-100 dark:border-red-900/50 shadow-sm">
              <ShieldAlert size={18} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">{analytics.fake_percentage}%</span>
              <span className="text-xs text-[#1A2536]/60 dark:text-[#F4EFE6]/60 font-medium">of total</span>
            </div>
            <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-medium">Flagged suspicion index</span>
          </div>
        </div>

        {/* AVERAGE CONFIDENCE */}
        <div className="glass-panel card-hover rounded-2xl p-6 border border-[#E8E2D5] dark:border-[#1B2A4A] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/50 dark:bg-[#101F42]/50 shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#1A2536]/70 dark:text-[#F4EFE6]/70 uppercase tracking-widest">Avg Confidence</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
              <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-450" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">{analytics.average_confidence}%</span>
              <span className="text-xs text-[#1A2536]/60 dark:text-[#F4EFE6]/60 font-medium">score</span>
            </div>
            <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-medium">Mean model evaluation weight</span>
          </div>
        </div>

        {/* INFERENCE LATENCY */}
        <div className="glass-panel card-hover rounded-2xl p-6 border border-[#E8E2D5] dark:border-[#1B2A4A] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white/50 dark:bg-[#101F42]/50 shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-[#1A2536]/70 dark:text-[#F4EFE6]/70 uppercase tracking-widest">Latency</span>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/50 shadow-sm">
              <Clock size={18} className="text-blue-600 dark:text-blue-450" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">180ms</span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                Optimal
              </span>
            </div>
            <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-medium">Active classification speed</span>
          </div>
        </div>

      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-8 border border-[#E8E2D5] dark:border-[#1B2A4A] transition-all duration-300 bg-white/40 dark:bg-[#101F42]/40 shadow-sm backdrop-blur-md flex flex-col">
          <div className="mb-8 flex flex-col space-y-1 border-b border-[#E8E2D5]/50 dark:border-[#1B2A4A]/50 pb-4">
            <h3 className="text-xl font-semibold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">Detection Frequency & Trust Curve</h3>
            <p className="text-sm text-[#1A2536]/60 dark:text-[#F4EFE6]/60">Verification metrics for the past week</p>
          </div>
          <div className="h-80 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeline_line} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--chart-grid, #E8E2D5)" vertical={false} opacity={0.5} />
                <XAxis dataKey="date" stroke="var(--chart-axis, #9CA3AF)" style={{ fontSize: 11, fontWeight: 500 }} dy={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--chart-axis, #9CA3AF)" style={{ fontSize: 11, fontWeight: 500 }} dx={-10} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--chart-tooltip-bg, #0A1128)", 
                    border: "1px solid var(--chart-tooltip-border, #1B2A4A)", 
                    borderRadius: "12px", 
                    color: "var(--chart-tooltip-text, #F4EFE6)", 
                    fontSize: 12,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }} 
                  cursor={{ stroke: 'var(--chart-grid, #E8E2D5)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="avgConfidence" name="Trust Rating (%)" stroke="#C5A880" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: "#C5A880" }} />
                <Line type="monotone" dataKey="total" name="Evaluation Count" stroke="#1E3A8A" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: "#1E3A8A" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Active Models */}
        <div className="glass-panel rounded-2xl p-8 border border-[#E8E2D5] dark:border-[#1B2A4A] transition-all duration-300 bg-white/40 dark:bg-[#101F42]/40 shadow-sm backdrop-blur-md">
          <div className="mb-6 flex flex-col space-y-1">
            <h3 className="text-lg font-semibold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight flex items-center space-x-2">
              <Cpu size={20} className="text-[#C5A880]" />
              <span>Active Classification Models</span>
            </h3>
            <p className="text-sm text-[#1A2536]/60 dark:text-[#F4EFE6]/60">Current configuration parameters</p>
          </div>

          <div className="relative border-l border-[#E8E2D5] dark:border-[#1B2A4A] ml-3 pl-6 space-y-6 mt-8">
            {/* RoBERTa */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#FAF7F0] dark:ring-[#0A1128]"></div>
              <div className="flex items-start justify-between pb-6 border-b border-[#E8E2D5]/60 dark:border-[#1B2A4A]/60">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#1A2536] dark:text-[#F4EFE6] block">RoBERTa-Fake-v2</span>
                  <span className="text-xs text-[#1A2536]/60 dark:text-[#F4EFE6]/60 block">Primary Contextual</span>
                </div>
                <div className="flex flex-col items-end space-y-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                    Active
                  </span>
                  <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-mono">240ms</span>
                </div>
              </div>
            </div>

            {/* BERT */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-400 ring-4 ring-[#FAF7F0] dark:ring-[#0A1128]"></div>
              <div className="flex items-start justify-between pb-6 border-b border-[#E8E2D5]/60 dark:border-[#1B2A4A]/60">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#1A2536] dark:text-[#F4EFE6] block">BERT-Base</span>
                  <span className="text-xs text-[#1A2536]/60 dark:text-[#F4EFE6]/60 block">Speed Screening</span>
                </div>
                <div className="flex flex-col items-end space-y-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50">
                    Idle
                  </span>
                  <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-mono">120ms</span>
                </div>
              </div>
            </div>

            {/* GPT-Detector */}
            <div className="relative">
              <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#FAF7F0] dark:ring-[#0A1128]"></div>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#1A2536] dark:text-[#F4EFE6] block">GPT-Detector</span>
                  <span className="text-xs text-[#1A2536]/60 dark:text-[#F4EFE6]/60 block">Syntactic Evaluation</span>
                </div>
                <div className="flex flex-col items-end space-y-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50">
                    Optimized
                  </span>
                  <span className="text-xs text-[#1A2536]/50 dark:text-[#F4EFE6]/50 font-mono">195ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;
