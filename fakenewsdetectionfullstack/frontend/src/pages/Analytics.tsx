import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { truthLensApi } from "../services/api";
import type { AnalyticsResponse, HistoryItem } from "../services/api";
import { 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Database,
  RefreshCw,
  Activity
} from "lucide-react";

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const analyticsData = await truthLensApi.getAnalytics();
      const historyData = await truthLensApi.getHistory();
      setAnalytics(analyticsData);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to load analytics metrics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 border-4 border-navy-200 dark:border-navy-800 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-base font-bold text-navy-800 dark:text-navy-200 animate-pulse">
          Loading Analytics Dashboard...
        </p>
      </div>
    );
  }

  const PIE_COLORS = ["#dc2626", "#16a34a"]; // Fake Red vs Real Green
  const BAR_COLORS = ["#1e3554", "#2d527e", "#5f8bbb"]; // Shaded Navy Blues

  const pieData = Object.entries(analytics.distribution_pie).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const barData = Object.entries(analytics.model_performance_bar).map(([key, val]) => ({
    model: key,
    confidence: val,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg animate-slideUp">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white transition-colors flex items-center space-x-3">
              <div className="p-2 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200">
                <Activity size={24} />
              </div>
              <span>Analytics Dashboard</span>
            </h1>
            <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-extrabold uppercase border tracking-widest ${
              analytics.current_mode === "production"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
                : "bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-950/60 dark:text-gold-400 dark:border-gold-900"
            }`}>
              {analytics.current_mode} Mode
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-300 transition-colors font-medium">
            Real-time telemetry and validation precision across classifier models.
          </p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="inline-flex items-center space-x-2 px-5 py-2 border border-beige-300 dark:border-navy-700 rounded-xl bg-white dark:bg-navy-800 text-sm font-bold text-navy-800 dark:text-navy-100 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer self-start card-hover"
        >
          <RefreshCw size={16} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {/* Total Predictions */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors card-hover">
          <div className="space-y-2">
            <span className="text-xs text-navy-500 dark:text-navy-400 font-extrabold uppercase tracking-widest block">Total Audits</span>
            <span className="text-4xl font-black text-navy-950 dark:text-white block">{analytics.total_predictions}</span>
            <span className="inline-block text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900 font-bold uppercase tracking-wider">
              Live sessions
            </span>
          </div>
          <div className="p-4 bg-navy-50 dark:bg-navy-900 text-navy-800 dark:text-navy-300 rounded-2xl shadow-inner border border-beige-200 dark:border-navy-800">
            <Database size={28} />
          </div>
        </div>

        {/* Fake Percentage */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors card-hover">
          <div className="space-y-2">
            <span className="text-xs text-navy-500 dark:text-navy-400 font-extrabold uppercase tracking-widest block">Fake News %</span>
            <span className="text-4xl font-black text-red-600 dark:text-red-500 block">{analytics.fake_percentage}%</span>
            <span className="text-xs font-medium text-navy-500 dark:text-navy-400 block">Total detected misinformation</span>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl shadow-inner border border-red-100 dark:border-red-900/50">
            <ShieldAlert size={28} />
          </div>
        </div>

        {/* Real Percentage */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors card-hover">
          <div className="space-y-2">
            <span className="text-xs text-navy-500 dark:text-navy-400 font-extrabold uppercase tracking-widest block">Credible %</span>
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-500 block">{analytics.real_percentage}%</span>
            <span className="text-xs font-medium text-navy-500 dark:text-navy-400 block">Objective journalist reporting</span>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner border border-emerald-100 dark:border-emerald-900/50">
            <TrendingUp size={28} />
          </div>
        </div>

        {/* Average Confidence */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors card-hover">
          <div className="space-y-2">
            <span className="text-xs text-navy-500 dark:text-navy-400 font-extrabold uppercase tracking-widest block">Mean Confidence</span>
            <span className="text-4xl font-black text-gold-600 dark:text-gold-500 block">{analytics.average_confidence}%</span>
            <span className="text-xs font-medium text-navy-500 dark:text-navy-400 block">Aggregated voting margin</span>
          </div>
          <div className="p-4 bg-gold-50 dark:bg-gold-950/40 text-gold-600 dark:text-gold-400 rounded-2xl shadow-inner border border-gold-100 dark:border-gold-900/50">
            <Clock size={28} />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
        
        {/* Left Chart: Line Chart (Timeline) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-navy-950 dark:text-white">Classification Trends</h3>
            <p className="text-sm font-medium text-navy-500 dark:text-navy-400">Timeline tracking article classifications and average confidence scores.</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeline_line} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--chart-axis)" style={{ fontSize: 12, fontWeight: 500 }} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--chart-axis)" style={{ fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", color: "var(--chart-tooltip-text)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600, paddingTop: "20px" }} />
                <Line type="monotone" dataKey="total" name="Total Predictions" stroke="#3c6b9e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="fake" name="Fake News" stroke="#dc2626" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="real" name="Real News" stroke="#16a34a" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="avgConfidence" name="Avg Confidence (%)" stroke="#C5A880" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Distribution Pie Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 flex flex-col justify-between transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-navy-950 dark:text-white">Data Distribution</h3>
            <p className="text-sm font-medium text-navy-500 dark:text-navy-400">Categorical division of prediction outputs within active history logs.</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", color: "var(--chart-tooltip-text)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-3">
                <ShieldAlert className="mx-auto text-navy-300 dark:text-navy-600" size={32} />
                <p className="text-sm font-medium text-navy-500 dark:text-navy-400">No predictions logged yet. Run prediction to view distribution.</p>
              </div>
            )}
          </div>
          <div className="text-xs font-medium text-center text-navy-600 dark:text-navy-300 bg-navy-50 dark:bg-navy-900/50 rounded-xl p-4 border border-beige-200 dark:border-navy-800 transition-colors">
            Pie slice colors denote classification. Large ratio variations indicate unusual query spikes.
          </div>
        </div>

        {/* Bottom Full Row: Model Performance Comparison Bar Chart */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-navy-950 dark:text-white">Transformer Model Confidence Profile</h3>
            <p className="text-sm font-medium text-navy-500 dark:text-navy-400">Comparison of average individual confidence benchmarks across deep transformer models.</p>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="model" stroke="var(--chart-axis)" style={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={12} />
                <YAxis domain={[80, 100]} stroke="var(--chart-axis)" style={{ fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Confidence']} cursor={{fill: 'var(--chart-grid)', opacity: 0.4}} contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "12px", color: "var(--chart-tooltip-text)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="confidence" name="Avg Confidence %" radius={[6, 6, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Audit History Log Table */}
      <div className="glass-panel rounded-2xl p-8 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-navy-950 dark:text-white">Recent Verification Logs</h3>
          <p className="text-sm font-medium text-navy-500 dark:text-navy-400">Database list of predictions executed in current system sandbox runtime.</p>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-beige-200 dark:border-navy-800 shadow-inner">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-beige-50 dark:bg-navy-900 border-b border-beige-200 dark:border-navy-800">
              <tr>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Time</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Article Excerpt</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Mode</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Model Used</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Prediction</th>
                <th className="px-6 py-4 font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider text-[10px]">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-200 dark:divide-navy-800 bg-white/50 dark:bg-navy-950/50">
              {history.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-beige-50 dark:hover:bg-navy-800/60 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-navy-700 dark:text-navy-300">{item.date}</td>
                  <td className="px-6 py-4 text-xs font-medium text-navy-700 dark:text-navy-300">{item.time}</td>
                  <td className="px-6 py-4 text-xs text-navy-900 dark:text-navy-100 max-w-[200px] truncate">{item.text_snippet}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest ${
                      item.mode === "production"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
                        : "bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-950/60 dark:text-gold-400 dark:border-gold-900"
                    }`}>
                      {item.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-navy-600 dark:text-navy-400">{item.model_used}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                      item.prediction === "Fake"
                        ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
                    }`}>
                      {item.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-navy-900 dark:text-navy-100">{item.confidence}%</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-navy-500 dark:text-navy-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Database size={32} className="text-navy-300 dark:text-navy-700" />
                      <span>No news evaluations logged in the audit registry database yet.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
