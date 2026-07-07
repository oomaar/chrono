"use client";

import Link from "next/link";

/**
 * The lime clock-icon tile + Chrono wordmark. Click returns to the console.
 */

type BrandMarkProps = {
  onGoNow?: () => void;
};

export function BrandMark({ onGoNow }: BrandMarkProps) {
  return (
    <Link
      href="/"
      onClick={onGoNow}
      className="group hover:bg-elev flex items-center gap-2.5 rounded-md px-1 py-1 transition-colors"
    >
      <span className="bg-brand text-bg flex h-6 w-6 items-center justify-center rounded-md shadow-[0_2px_10px_rgba(198,242,78,0.32)]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 12V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 12L15 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-ink text-sm font-semibold tracking-tight">Chrono</span>
    </Link>
  );
}
