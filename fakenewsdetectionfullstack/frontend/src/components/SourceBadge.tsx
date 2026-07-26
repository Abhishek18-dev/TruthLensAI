import React from "react";
import { ExternalLink } from "lucide-react";
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
    "flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-beige-200 dark:border-navy-700 bg-white/90 dark:bg-navy-800/90 text-navy-800 dark:text-navy-200 transition-all shadow-sm";

  if (isValidUrl) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} hover:bg-beige-50 dark:hover:bg-navy-700 hover:border-gold-400 dark:hover:border-gold-600 hover:shadow-md`}
        aria-label={`Open source: ${source.name}`}
      >
        <ExternalLink size={13} className="opacity-60 flex-shrink-0" />
        <span>{source.name}</span>
      </a>
    );
  }

  return (
    <span className={`${baseClasses} opacity-80 cursor-default`}>
      <span>{source.name}</span>
    </span>
  );
};

export default SourceBadge;
