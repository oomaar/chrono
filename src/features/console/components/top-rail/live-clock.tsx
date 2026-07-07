"use client";

import { motion } from "motion/react";
import { cn } from "@/features/design-system";
import { useConsole } from "../../console-provider";

/**
 * LIVE pill (pulsing brand dot + rate) sitting next to the UTC clock.
 */
export function LiveClock() {
  const { timeline } = useConsole();
  const isLive = timeline.mode === "live";
  const eventsPerMinute = Math.max(
    0,
    Math.round(
      (timeline.events.length / Math.max(1, timeline.window.durationMinutes)) * 10,
    ) / 10,
  );

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => (isLive ? timeline.pause() : timeline.returnToNow())}
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
      <span className="text-ink-2 hidden font-mono text-xs tabular-nums sm:inline">
        {new Date(timeline.now).toISOString().slice(11, 19)}
        <span className="text-ink-3"> UTC</span>
      </span>
    </div>
  );
}
