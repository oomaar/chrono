"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { EmptyState, cn } from "@/features/design-system";
import type { LiveEngine, TimeWindow, TimelineEvent } from "@/features/fake-db";
import { EmptyTimeline } from "@/features/illustrations";

const toneDotClass: Record<TimelineEvent["tone"], string> = {
  crit: "bg-crit",
  warn: "bg-warn",
  ok: "bg-ok",
  brand: "bg-brand",
  neutral: "bg-ink-3",
};

type EventsBetweenProps = {
  engine: LiveEngine;
  pinA: string;
  pinB: string;
  onInvestigate: (event: TimelineEvent) => void;
};

const formatOffsetLabel = (targetIso: string, anchorIso: string): string => {
  const minutes = (new Date(targetIso).getTime() - new Date(anchorIso).getTime()) / 60000;
  const abs = Math.abs(minutes);
  const sign = minutes < 0 ? "−" : "+";
  if (abs < 1) return "0m";
  if (abs < 60) return `${sign}${Math.round(abs)}m`;
  const hours = Math.floor(abs / 60);
  const mins = Math.round(abs % 60);
  return mins > 0
    ? `${sign}${hours}h${String(mins).padStart(2, "0")}`
    : `${sign}${hours}h`;
};

/**
 * "Events between A and B" — the actual moments that produced the delta.
 * The wireframe treats this as the core of Compare: the two columns show
 * *what changed*, this list shows *why*.
 */
export function EventsBetween({ engine, pinA, pinB, onInvestigate }: EventsBetweenProps) {
  const events = useMemo(() => {
    // Order pins so A is always earlier — the "between" list is time-directional.
    const earlier = pinA < pinB ? pinA : pinB;
    const later = pinA < pinB ? pinB : pinA;
    const durationMinutes = Math.max(
      1,
      Math.round((new Date(later).getTime() - new Date(earlier).getTime()) / 60000),
    );
    const window: TimeWindow = engine.createWindow(later, durationMinutes);
    return engine
      .liveEventsInWindow(window)
      .filter((event) => event.timestamp >= earlier && event.timestamp <= later);
  }, [engine, pinA, pinB]);

  const anchor = pinA < pinB ? pinA : pinB;

  return (
    <section className="space-y-3">
      <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        Events between A and B · {events.length}
      </p>
      {events.length === 0 ? (
        <EmptyState
          illustration={<EmptyTimeline className="text-ink-3 h-20 w-auto" />}
          title="Nothing happened between these moments"
          description="Try pinning a wider span, or investigate one of the pins individually."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.28,
                ease: [0.2, 0.7, 0.3, 1],
                delay: Math.min(index * 0.035, 0.42),
              }}
            >
              <button
                type="button"
                onClick={() => onInvestigate(event)}
                className="group border-line bg-surface hover:border-line-strong hover:bg-elev flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors"
              >
                <span className="text-ink-3 w-14 shrink-0 font-mono text-[11px] tracking-[0.14em]">
                  {formatOffsetLabel(event.timestamp, anchor)}
                </span>
                <span
                  className={cn(
                    "h-2 w-2 flex-none rounded-full",
                    toneDotClass[event.tone],
                  )}
                />
                <span className="text-ink flex-1 truncate text-xs">{event.summary}</span>
                <span className="text-ink-3 group-hover:text-ink font-mono text-[10px] tracking-[0.14em]">
                  investigate →
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
