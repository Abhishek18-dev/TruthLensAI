import React from "react";
import { ShieldCheck, Target, Search, FileText, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import type { VerificationResponse } from "../services/api";
import { SourceBadge } from "./SourceBadge";

interface VerificationPanelProps {
  verification: VerificationResponse;
}

const getVerdictStyles = (verdict: string) => {
  const v = verdict.toLowerCase();

  if (v.includes("verified") || v.includes("true") || v.includes("real")) {
    return {
      container: "from-emerald-500/5 to-emerald-500/10 border-emerald-200/50 dark:border-emerald-900/50",
      badge: "bg-emerald-500 text-white shadow-emerald-500/30",
      bar: "bg-gradient-to-r from-emerald-400 to-emerald-600",
      icon: "text-emerald-500",
      IconComponent: CheckCircle2,
    };
  }

  if (v.includes("false") || v.includes("fake")) {
    return {
      container: "from-red-500/5 to-red-500/10 border-red-200/50 dark:border-red-900/50",
      badge: "bg-red-500 text-white shadow-red-500/30",
      bar: "bg-gradient-to-r from-red-400 to-red-600",
      icon: "text-red-500",
      IconComponent: XCircle,
    };
  }

  if (v.includes("misleading") || v.includes("partially")) {
    return {
      container: "from-amber-500/5 to-amber-500/10 border-amber-200/50 dark:border-amber-900/50",
      badge: "bg-amber-500 text-white shadow-amber-500/30",
      bar: "bg-gradient-to-r from-amber-400 to-amber-600",
      icon: "text-amber-500",
      IconComponent: AlertTriangle,
    };
  }

  // Default: Insufficient Evidence / Unknown
  return {
    container: "from-slate-500/5 to-slate-500/10 border-slate-200/50 dark:border-slate-800/50",
    badge: "bg-slate-600 text-white shadow-slate-500/30",
    bar: "bg-gradient-to-r from-slate-400 to-slate-600",
    icon: "text-slate-500",
    IconComponent: Info,
  };
};

export const VerificationPanel: React.FC<VerificationPanelProps> = ({ verification }) => {
  const styles = getVerdictStyles(verification.verdict);
  const VerdictIcon = styles.IconComponent;

  return (
    <div className={`glass-panel-accent rounded-3xl p-6 lg:p-8 animate-fadeIn transition-colors bg-gradient-to-br ${styles.container} backdrop-blur-xl border shadow-xl relative overflow-hidden`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-[#E8E2D5] dark:border-[#1B2A4A] relative z-10">
        <div className={`p-2.5 rounded-xl bg-white dark:bg-[#101F42] shadow-sm ${styles.icon}`}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#1A2536] dark:text-[#F4EFE6] tracking-tight">AI Agent Investigation</h3>
          <p className="text-sm font-medium text-[#1A2536]/60 dark:text-[#F4EFE6]/60">Comprehensive RAG verification report</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Verdict & Confidence Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 dark:bg-[#0A1128]/40 p-6 rounded-2xl border border-white/50 dark:border-[#1B2A4A]/50 shadow-inner">
          {/* Verdict Badge */}
          <div className="flex flex-col justify-center space-y-2">
            <span className="text-xs font-bold text-[#1A2536]/60 dark:text-[#F4EFE6]/60 uppercase tracking-widest flex items-center">
              <Target size={12} className="mr-1.5" /> Final Verdict
            </span>
            <div className="flex items-center">
              <span className={`flex items-center text-lg lg:text-xl font-extrabold uppercase px-5 py-2.5 rounded-xl shadow-lg ${styles.badge} tracking-wide`}>
                <VerdictIcon size={20} className="mr-2" />
                {verification.verdict}
              </span>
            </div>
          </div>

          {/* Verification Confidence */}
          <div className="flex flex-col justify-center space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-[#1A2536]/60 dark:text-[#F4EFE6]/60 uppercase tracking-widest">
                Confidence Score
              </span>
              <span className="text-2xl font-black text-[#1A2536] dark:text-[#F4EFE6] leading-none">
                {verification.confidence}%
              </span>
            </div>
            <div className="w-full bg-[#E8E2D5]/50 dark:bg-[#101F42]/80 rounded-full h-3.5 shadow-inner overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${styles.bar} relative overflow-hidden`}
                style={{ width: `${Math.min(verification.confidence, 100)}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8E2D5] dark:via-[#1B2A4A] to-transparent"></div>

        {/* Summary */}
        <div>
          <span className="flex items-center text-sm font-bold text-[#1A2536] dark:text-[#F4EFE6] mb-3">
            <FileText size={16} className="mr-2 text-[#C5A880]" />
            Executive Summary
          </span>
          <p className="text-base font-medium text-[#1A2536]/90 dark:text-[#F4EFE6]/90 leading-relaxed bg-white/60 dark:bg-[#101F42]/60 p-5 rounded-2xl border border-[#E8E2D5]/50 dark:border-[#1B2A4A]/50 shadow-sm backdrop-blur-sm">
            {verification.summary}
          </p>
        </div>

        {/* Reasoning */}
        <div>
          <span className="flex items-center text-sm font-bold text-[#1A2536] dark:text-[#F4EFE6] mb-3">
            <Search size={16} className="mr-2 text-[#C5A880]" />
            Agentic Reasoning Process
          </span>
          <div className="bg-[#FAF7F0]/80 dark:bg-[#0A1128]/80 p-5 rounded-2xl border border-[#E8E2D5] dark:border-[#1B2A4A] shadow-inner">
            <p className="text-sm text-[#1A2536]/80 dark:text-[#F4EFE6]/80 leading-relaxed whitespace-pre-line font-medium">
              {verification.reasoning}
            </p>
          </div>
        </div>

        {/* Trusted Sources */}
        {verification.sources.length > 0 && (
          <div className="pt-2">
            <span className="flex items-center text-sm font-bold text-[#1A2536] dark:text-[#F4EFE6] mb-4">
              <span className="flex items-center justify-center bg-[#C5A880]/20 text-[#9A7B56] dark:text-[#C5A880] rounded-lg w-6 h-6 mr-2 text-xs">
                {verification.sources.length}
              </span>
              Verified Sources
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
