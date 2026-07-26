import React from "react";
import { ShieldCheck } from "lucide-react";
import type { VerificationResponse } from "../services/api";
import { SourceBadge } from "./SourceBadge";

interface VerificationPanelProps {
  verification: VerificationResponse;
}

const getVerdictStyles = (verdict: string) => {
  const v = verdict.toLowerCase();

  if (v.includes("verified") || v.includes("true") || v.includes("real")) {
    return {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      bar: "bg-emerald-500",
      icon: "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (v.includes("false") || v.includes("fake")) {
    return {
      badge: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
      bar: "bg-red-500",
      icon: "text-red-600 dark:text-red-400",
    };
  }

  if (v.includes("misleading") || v.includes("partially")) {
    return {
      badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      bar: "bg-amber-500",
      icon: "text-amber-600 dark:text-amber-400",
    };
  }

  // Default: Insufficient Evidence / Unknown
  return {
    badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/60 dark:text-slate-300 dark:border-slate-700",
    bar: "bg-slate-500",
    icon: "text-slate-600 dark:text-slate-400",
  };
};

export const VerificationPanel: React.FC<VerificationPanelProps> = ({ verification }) => {
  const styles = getVerdictStyles(verification.verdict);

  return (
    <div className="glass-panel-accent rounded-2xl p-6 animate-fadeIn transition-colors">
      {/* Section Header */}
      <h3 className="text-base font-extrabold text-navy-950 dark:text-beige-100 uppercase tracking-wider mb-5 flex items-center space-x-2.5">
        <ShieldCheck size={20} className={styles.icon} />
        <span>Evidence-Based Verification</span>
      </h3>

      <div className="space-y-4">
        {/* Verdict Badge */}
        <div className="flex justify-between items-center border-b border-navy-950/10 dark:border-navy-700 pb-3">
          <span className="text-xs font-semibold text-navy-700 dark:text-navy-300">Verdict:</span>
          <span className={`text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-lg border ${styles.badge}`}>
            {verification.verdict}
          </span>
        </div>

        {/* Verification Confidence */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-navy-700 dark:text-navy-300">Verification Confidence</span>
            <span className="font-extrabold text-navy-950 dark:text-beige-100">
              {verification.confidence}%
            </span>
          </div>
          <div className="w-full bg-beige-200 dark:bg-navy-950 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${styles.bar}`}
              style={{ width: `${Math.min(verification.confidence, 100)}%` }}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="pt-2">
          <span className="text-xs font-bold block text-navy-700 dark:text-navy-300 mb-2 uppercase tracking-wider">
            Summary
          </span>
          <p className="text-sm font-semibold text-navy-950 dark:text-beige-50 leading-relaxed bg-white/50 dark:bg-navy-950/60 p-4 rounded-xl border border-navy-950/5 dark:border-navy-800">
            {verification.summary}
          </p>
        </div>

        {/* Reasoning */}
        <div>
          <span className="text-xs font-bold block text-navy-700 dark:text-navy-300 mb-2 uppercase tracking-wider">
            Reasoning
          </span>
          <p className="text-xs text-navy-750 dark:text-navy-200 leading-relaxed bg-white/50 dark:bg-navy-950/60 p-4 rounded-xl border border-navy-950/5 dark:border-navy-800 whitespace-pre-line">
            {verification.reasoning}
          </p>
        </div>

        {/* Trusted Sources */}
        {verification.sources.length > 0 && (
          <div>
            <span className="text-xs font-bold block text-navy-700 dark:text-navy-300 mb-2 uppercase tracking-wider">
              Trusted Sources ({verification.sources.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {verification.sources.map((source, index) => (
                <SourceBadge key={index} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPanel;
