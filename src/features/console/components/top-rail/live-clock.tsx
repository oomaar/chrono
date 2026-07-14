"use client";

import { AnimatePresence, motion } from "motion/react";
import { AnimatedCounter, cn } from "@/features/design-system";
import { useConsole } from "../../console-provider";

/**
 * LIVE pill (pulsing brand dot + rate) sitting next to the UTC clock. When a
 * new ambient event lands, a ping ripples out from the dot — a subtle visual
 * heartbeat so operators feel the system react in real time.
 */
export function LiveClock() {
  const { timeline } = useConsole();
  const isLive = timeline.mode === "live";
  const eventCount = timeline.events.length;
  const eventsPerMinute =
    Math.max(
      0,
      Math.round((eventCount / Math.max(1, timeline.window.durationMinutes)) * 10),
    ) / 10;

  const clockLabel = new Date(timeline.now).toISOString().slice(11, 19);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => (isLive ? timeline.pause() : timeline.returnToNow())}
        aria-pressed={isLive}
        aria-label={
          isLive ? "Live mode active — click to pause" : "Paused — click to return to now"
        }
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
            <>
              <motion.span
                className="bg-brand absolute inset-0 rounded-full"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              {/* One-shot ping per new event: motion remounts on key change */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={eventCount}
                  className="bg-brand absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: 4.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}
                />
              </AnimatePresence>
            </>
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
        <AnimatedCounter
          value={eventsPerMinute}
          durationMs={320}
          format={(v) => v.toFixed(1)}
          suffix="/min"
          className="text-ink-2 font-mono text-[10px] tracking-widest tabular-nums"
        />
      </button>
      <span
        className="text-ink-2 hidden font-mono text-xs tabular-nums sm:inline"
        aria-live="off"
        aria-label={`Simulated clock ${clockLabel} UTC`}
      >
        {clockLabel}
        <span className="text-ink-3"> UTC</span>
      </span>
    </div>
  );
}
