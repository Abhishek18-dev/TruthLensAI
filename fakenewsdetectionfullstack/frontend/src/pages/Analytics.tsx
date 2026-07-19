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
  RefreshCw
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-navy-700 dark:border-navy-500 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-navy-800 dark:text-navy-200 animate-pulse">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-navy-950 dark:text-white transition-colors">Analytics Dashboard</h1>
            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${
              analytics.current_mode === "production"
                ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
                : "bg-gold-50 text-gold-700 border-gold-250 dark:bg-gold-950/60 dark:text-gold-400 dark:border-gold-900"
            }`}>
              {analytics.current_mode} Mode
            </span>
          </div>
          <p className="text-sm text-navy-600 dark:text-navy-200 transition-colors mt-1">
            Real-time telemetry and validation precision across classifier models.
          </p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-beige-300 dark:border-navy-700 rounded-lg bg-white dark:bg-navy-800 text-xs font-semibold text-navy-800 dark:text-navy-100 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer self-start"
        >
          <RefreshCw size={14} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Predictions */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs text-navy-500 dark:text-navy-300 font-bold uppercase tracking-wider block">Total Audits</span>
            <span className="text-3xl font-extrabold text-navy-950 dark:text-white block">{analytics.total_predictions}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 font-bold">
              Live sessions
            </span>
          </div>
          <div className="p-3 bg-navy-100 dark:bg-navy-900 text-navy-800 dark:text-navy-200 rounded-xl">
            <Database size={24} />
          </div>
        </div>

        {/* Fake Percentage */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs text-navy-500 dark:text-navy-300 font-bold uppercase tracking-wider block">Fake News %</span>
            <span className="text-3xl font-extrabold text-red-700 dark:text-red-500 block">{analytics.fake_percentage}%</span>
            <span className="text-[10px] text-navy-450 dark:text-navy-350">Total detected misinformation</span>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900">
            <ShieldAlert size={24} />
          </div>
        </div>

        {/* Real Percentage */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs text-navy-500 dark:text-navy-300 font-bold uppercase tracking-wider block">Credible %</span>
            <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-500 block">{analytics.real_percentage}%</span>
            <span className="text-[10px] text-navy-450 dark:text-navy-350">Objective journalist reporting</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Average Confidence */}
        <div className="glass-panel rounded-2xl p-5 border border-beige-200 dark:border-navy-700 glow-navy flex items-center justify-between transition-colors">
          <div className="space-y-1">
            <span className="text-xs text-navy-500 dark:text-navy-300 font-bold uppercase tracking-wider block">Mean Confidence</span>
            <span className="text-3xl font-extrabold text-gold-600 dark:text-gold-400 block">{analytics.average_confidence}%</span>
            <span className="text-[10px] text-navy-450 dark:text-navy-350">Aggregated voting margin</span>
          </div>
          <div className="p-3 bg-gold-50 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 rounded-xl border border-gold-100 dark:border-gold-900">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Chart: Line Chart (Timeline) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-4 transition-colors">
          <div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Classification Trends</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300">Timeline tracking article classifications and average confidence scores.</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timeline_line} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="date" stroke="var(--chart-axis)" style={{ fontSize: 11 }} />
                <YAxis stroke="var(--chart-axis)" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "8px", color: "var(--chart-tooltip-text)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="total" name="Total Predictions" stroke="#3c6b9e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="fake" name="Fake News" stroke="#ea580c" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="real" name="Real News" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="avgConfidence" name="Avg Confidence (%)" stroke="#c5a31e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Distribution Pie Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Data Distribution</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300">Categorical division of prediction outputs within active history logs.</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "8px", color: "var(--chart-tooltip-text)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-navy-500 dark:text-navy-300 italic">No predictions logged yet. Run prediction to view distribution.</p>
            )}
          </div>
          <div className="text-[11px] text-center text-navy-600 dark:text-navy-300 italic bg-beige-100 dark:bg-navy-900/60 rounded-lg p-2.5 transition-colors">
            Pie slice colors denote classification. Large ratio variations indicate unusual query spikes.
          </div>
        </div>

        {/* Bottom Full Row: Model Performance Comparison Bar Chart */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-4 transition-colors">
          <div>
            <h3 className="text-lg font-bold text-navy-950 dark:text-white">Transformer Model Confidence Profile</h3>
            <p className="text-xs text-navy-500 dark:text-navy-300">Comparison of average individual confidence benchmarks across deep transformer models.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="model" stroke="var(--chart-axis)" style={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke="var(--chart-axis)" style={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Confidence']} contentStyle={{ background: "var(--chart-tooltip-bg)", border: "1px solid var(--chart-tooltip-border)", borderRadius: "8px", color: "var(--chart-tooltip-text)" }} />
                <Bar dataKey="confidence" name="Avg Confidence %">
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
      <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-4 transition-colors">
        <div>
          <h3 className="text-lg font-bold text-navy-950 dark:text-white">Verification History Log</h3>
          <p className="text-xs text-navy-500 dark:text-navy-300">Database list of predictions executed in current system sandbox runtime.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-beige-300 dark:divide-navy-800">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Article Excerpt</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Prediction Mode</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Model Used</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Prediction</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-navy-500 dark:text-navy-300 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-200 dark:divide-navy-900">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-beige-100/50 dark:hover:bg-navy-800/40 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-navy-700 dark:text-navy-200 font-medium">{item.date}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-navy-700 dark:text-navy-200 font-medium">{item.time}</td>
                  <td className="px-4 py-3.5 text-xs text-navy-900 dark:text-navy-100 font-sans max-w-xs truncate">{item.text_snippet}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                      item.mode === "production"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-450 dark:border-emerald-900"
                        : "bg-gold-50 text-gold-700 border-gold-250 dark:bg-gold-950/60 dark:text-gold-400 dark:border-gold-900"
                    }`}>
                      {item.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-navy-600 dark:text-navy-300 font-mono font-medium">{item.model_used}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.prediction === "Fake"
                        ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/60 dark:text-red-450 dark:border-red-900"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-450 dark:border-emerald-900"
                    }`}>
                      {item.prediction}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs font-bold text-navy-800 dark:text-navy-200">{item.confidence}%</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-xs text-navy-450 dark:text-navy-300 italic">No news evaluations logged in the audit registry database yet.</td>
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
