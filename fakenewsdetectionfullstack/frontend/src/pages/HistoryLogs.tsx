import React, { useEffect, useState } from "react";
import { truthLensApi } from "../services/api";
import type { HistoryItem } from "../services/api";
import { RefreshCw, History } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-navy-700 dark:border-navy-500 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-navy-800 dark:text-navy-200 animate-pulse">
          Loading history logs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 grid-bg">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-navy-950 dark:text-white transition-colors flex items-center space-x-2">
            <History size={22} className="text-navy-700 dark:text-navy-300" />
            <span>Verification History Log</span>
          </h1>
          <p className="text-sm text-navy-600 dark:text-navy-200 transition-colors">
            Review detailed record of text audits performed in current session.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-beige-300 dark:border-navy-700 rounded-lg bg-white dark:bg-navy-800 text-xs font-semibold text-navy-800 dark:text-navy-100 hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors shadow-sm cursor-pointer self-start"
        >
          <RefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-2xl p-6 border border-beige-200 dark:border-navy-700 glow-navy space-y-4 transition-colors">
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
                        ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900"
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
export default HistoryLogs;
