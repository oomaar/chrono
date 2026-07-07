"use client";

import { differenceInMinutes } from "@/features/fake-db";
import { useConsole } from "../../console-provider";

const formatOffset = (playhead: string, now: string): string => {
  const delta = differenceInMinutes(playhead, now);
  if (Math.abs(delta) < 0.5) return "Now — live";
  const sign = delta < 0 ? "−" : "+";
  const abs = Math.abs(delta);
  if (abs < 60) return `${sign}${Math.round(abs)}m from now`;
  const hours = abs / 60;
  return `${sign}${hours.toFixed(1)}h from now`;
};

const kickerFor = (mode: "live" | "scrubbing" | "playback"): string => {
  if (mode === "live") return "Viewing";
  if (mode === "playback") return "Replaying";
  return "Investigating";
};

/**
 * The time statement — kicker + human-readable playhead offset.
 * This is *not* a page breadcrumb; it's a statement about time.
 */
export function ModeStatement() {
  const { timeline } = useConsole();
  const kicker = kickerFor(timeline.mode);
  const statement = formatOffset(timeline.playhead, timeline.now);

  return (
    <div className="hidden min-w-0 items-center gap-2.5 md:flex">
      <span className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
        {kicker}
      </span>
      <span className="text-ink truncate text-sm font-medium">{statement}</span>
    </div>
  );
}
