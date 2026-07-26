import React from "react";
import { ExternalLink, Globe } from "lucide-react";
import type { VerificationSource } from "../services/api";

interface SourceBadgeProps {
  source: VerificationSource;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  // Check if the URL is non-empty and structurally valid
  let isValidUrl = false;
  if (source.url && source.url.trim() !== "") {
    try {
      new URL(source.url);
      isValidUrl = true;
    } catch {
      // Invalid URL format
      isValidUrl = false;
    }
  }

  const baseClasses =
    "group flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold border border-[#E8E2D5] dark:border-[#1B2A4A] bg-white dark:bg-[#101F42]/80 text-[#1A2536] dark:text-[#F4EFE6] transition-all duration-300 shadow-sm overflow-hidden relative";

  if (isValidUrl) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:-translate-y-0.5 hover:shadow-md hover:border-[#C5A880] dark:hover:border-[#C5A880]/50 hover:bg-[#FAF7F0] dark:hover:bg-[#101F42]`}
        aria-label={`Open source: ${source.name}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A880]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="p-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0A1128] text-[#9A7B56] dark:text-[#C5A880] group-hover:scale-110 transition-transform duration-300">
          <Globe size={14} />
        </div>
        <span className="flex-1 truncate z-10">{source.name}</span>
        <ExternalLink size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-[#C5A880] transition-all duration-300 flex-shrink-0 z-10" />
      </a>
    );
  }

  return (
    <span className={`${baseClasses} opacity-80 cursor-default bg-[#FAF7F0]/50 dark:bg-[#0A1128]/50`}>
      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
        <Globe size={14} />
      </div>
      <span className="flex-1 truncate text-gray-600 dark:text-gray-400">{source.name}</span>
    </span>
  );
};

export default SourceBadge;
