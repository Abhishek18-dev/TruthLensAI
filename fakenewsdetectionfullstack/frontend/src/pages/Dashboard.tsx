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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-navy-700 dark:border-navy-500 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-navy-800 dark:text-navy-200 animate-pulse">
          Loading Dashboard overview...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOTAL SCANS */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-navy-450 dark:text-navy-300 uppercase tracking-widest block">Total Scans</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-navy-950 dark:text-white">{analytics.total_predictions}</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded flex items-center">
                +12% ↗
              </span>
            </div>
            <span className="text-[10px] text-navy-500 dark:text-navy-400 block pt-1 font-light">Aggregated workspace scans</span>
          </div>
          <div className="p-2.5 bg-navy-50 dark:bg-navy-900 border border-beige-200 dark:border-navy-800 rounded-xl text-navy-800 dark:text-navy-200">
            <FileText size={18} />
          </div>
        </div>

        {/* FAKE/MISLEADING RATE */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-navy-450 dark:text-navy-300 uppercase tracking-widest block">Fake/Misleading Rate</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-navy-950 dark:text-white">{analytics.fake_percentage}%</span>
              <span className="text-[10px] text-navy-500 dark:text-navy-400 font-medium">of total</span>
            </div>
            <span className="text-[10px] text-navy-500 dark:text-navy-400 block pt-1 font-light">Flagged suspicion index</span>
          </div>
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400">
            <ShieldAlert size={18} />
          </div>
        </div>

        {/* AVERAGE CONFIDENCE */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-navy-450 dark:text-navy-300 uppercase tracking-widest block">Average Confidence</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-navy-950 dark:text-white">{analytics.average_confidence}%</span>
              <span className="text-[10px] text-navy-550 dark:text-navy-400 font-medium">score</span>
            </div>
            <span className="text-[10px] text-navy-500 dark:text-navy-400 block pt-1 font-light">Mean model evaluation weight</span>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 rounded-xl text-emerald-600 dark:text-emerald-450">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* INFERENCE LATENCY */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-navy-450 dark:text-navy-300 uppercase tracking-widest block">Inference Latency</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-navy-950 dark:text-white">180ms</span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                Optimal
              </span>
            </div>
            <span className="text-[10px] text-navy-500 dark:text-navy-400 block pt-1 font-light">Active classification speed</span>
          </div>
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl text-blue-600 dark:text-blue-450">
            <Clock size={18} />
          </div>
        </div>

      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Detection Frequency & Trust Curve</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300">Verification metrics for the past week</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeline_line} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--chart-axis)" style={{ fontSize: 10 }} dy={10} />
                <YAxis stroke="var(--chart-axis)" style={{ fontSize: 10 }} dx={-5} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "8px", color: "var(--chart-tooltip-text)", fontSize: 11 }} />
                <Line type="monotone" dataKey="avgConfidence" name="Trust Rating (%)" stroke="#a7976c" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="total" name="Evaluation Count" stroke="#1e3554" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Active Models */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 transition-colors">
          <h3 className="text-sm font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Cpu size={16} className="text-gold-500 dark:text-gold-400" />
            <span>Active Classification Models</span>
          </h3>
          <p className="text-xs text-navy-500 dark:text-navy-450 mb-4 font-light">Current model configuration parameters</p>

          <div className="space-y-4">
            {/* RoBERTa */}
            <div className="p-3 bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850 rounded-xl flex items-center justify-between transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy-950 dark:text-white block">RoBERTa-Fake-v2</span>
                <span className="text-[10px] text-navy-500 dark:text-navy-450 block font-light">Primary Contextual</span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-900">
                  Active
                </span>
                <span className="text-[10px] text-navy-500 dark:text-navy-400 block font-mono mt-1">240ms</span>
              </div>
            </div>

            {/* BERT */}
            <div className="p-3 bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850 rounded-xl flex items-center justify-between transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy-955 dark:text-white block">BERT-Base</span>
                <span className="text-[10px] text-navy-500 dark:text-navy-450 block font-light">Speed Screening</span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300 border border-beige-250 dark:border-navy-755">
                  Idle
                </span>
                <span className="text-[10px] text-navy-500 dark:text-navy-400 block font-mono mt-1">120ms</span>
              </div>
            </div>

            {/* GPT-Detector */}
            <div className="p-3 bg-navy-50/50 dark:bg-navy-900/40 border border-beige-200 dark:border-navy-850 rounded-xl flex items-center justify-between transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-navy-955 dark:text-white block">GPT-Detector</span>
                <span className="text-[10px] text-navy-500 dark:text-navy-450 block font-light">Syntactic Evaluation</span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  Optimized
                </span>
                <span className="text-[10px] text-navy-500 dark:text-navy-400 block font-mono mt-1">195ms</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Dashboard;
