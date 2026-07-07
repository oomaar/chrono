"use client";

import { motion } from "motion/react";
import { cn } from "@/features/design-system";
import type { TimelineMode } from "../../types/timeline.types";

type LiveBadgeProps = {
  mode: TimelineMode;
  eventsPerMinute: number;
  onClick?: () => void;
};

export function LiveBadge({ mode, eventsPerMinute, onClick }: LiveBadgeProps) {
  const isLive = mode === "live";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full border px-3 transition-colors",
        isLive
          ? "border-brand/40 bg-brand/10"
          : "border-line bg-surface-2 hover:border-line-strong",
      )}
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            isLive ? "bg-brand" : "bg-ink-3",
          )}
        />
        {isLive ? (
          <motion.span
            className="bg-brand absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
      </span>
      <span
        className={cn(
          "font-mono text-[10px] font-semibold tracking-[0.14em] uppercase",
          isLive ? "text-brand" : "text-ink-3",
        )}
      >
        {isLive ? "Live" : "Paused"}
      </span>
      <span className="text-ink-2 font-mono text-[10px] tracking-widest tabular-nums">
        {eventsPerMinute}/min
      </span>
    </button>
  );
}
