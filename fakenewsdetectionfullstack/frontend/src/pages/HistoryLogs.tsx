import React, { useEffect, useState } from "react";
import { truthLensApi } from "../services/api";
import type { HistoryItem } from "../services/api";
import { RefreshCw, History, Database } from "lucide-react";

export const HistoryLogs: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await truthLensApi.getHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 border-4 border-navy-200 dark:border-navy-800 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-base font-bold text-navy-800 dark:text-navy-200 animate-pulse">
          Loading History Logs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg animate-slideUp">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 dark:text-white transition-colors flex items-center space-x-3">
            <div className="p-2 bg-navy-100 dark:bg-navy-900 rounded-xl text-navy-800 dark:text-navy-200">
              <History size={24} />
            </div>
            <span>Verification History Log</span>
          </h1>
          <p className="text-sm text-navy-600 dark:text-navy-300 transition-colors font-medium">
            Review detailed record of text audits performed in current session.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="inline-flex items-center space-x-2 px-5 py-2 border border-beige-300 dark:border-navy-700 rounded-xl bg-white dark:bg-navy-800 text-sm font-bold text-navy-800 dark:text-navy-100 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer self-start card-hover"
        >
          <RefreshCw size={16} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-2xl p-8 border border-beige-200 dark:border-navy-700 glow-navy space-y-6 transition-colors shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-extrabold text-navy-950 dark:text-white">Audit Registry Database</h2>
          <span className="text-sm font-bold text-navy-500 dark:text-navy-400 bg-navy-50 dark:bg-navy-900/50 px-3 py-1 rounded-lg border border-beige-200 dark:border-navy-800">
            {history.length} Total Records
          </span>
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
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-beige-50 dark:hover:bg-navy-800/60 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-navy-700 dark:text-navy-300">{item.date}</td>
                  <td className="px-6 py-4 text-xs font-medium text-navy-700 dark:text-navy-300">{item.time}</td>
                  <td className="px-6 py-4 text-xs text-navy-900 dark:text-navy-100 max-w-sm truncate">{item.text_snippet}</td>
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
                  <td colSpan={7} className="px-6 py-16 text-center text-sm font-medium text-navy-500 dark:text-navy-400">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 bg-navy-50 dark:bg-navy-900 rounded-full">
                        <Database size={36} className="text-navy-400 dark:text-navy-500" />
                      </div>
                      <span className="text-base">No news evaluations logged in the audit registry database yet.</span>
                      <span className="text-xs text-navy-400 dark:text-navy-500">Run a prediction from the dashboard to populate logs.</span>
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
export default HistoryLogs;
