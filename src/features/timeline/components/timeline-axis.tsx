"use client";

import { useMemo } from "react";
import type { TimeWindow } from "@/features/fake-db";
import { differenceInMinutes, parseIso } from "@/features/fake-db";
import { AXIS_TICK_COUNT } from "../utils/zoom-presets";
import type { ZoomLevel } from "../types/timeline.types";

type TimelineAxisProps = {
  window: TimeWindow;
  now: string;
  zoom: ZoomLevel;
};

const formatOffset = (minutes: number): string => {
  if (Math.abs(minutes) < 1) return "now";
  const sign = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  if (abs < 60) return `${sign}${Math.round(abs)}m`;
  const hours = abs / 60;
  if (Number.isInteger(hours)) return `${sign}${hours}h`;
  return `${sign}${hours.toFixed(1)}h`;
};

export function TimelineAxis({ window, now, zoom }: TimelineAxisProps) {
  const ticks = useMemo(() => {
    const tickCount = AXIS_TICK_COUNT[zoom];
    const startMs = parseIso(window.start);
    const endMs = parseIso(window.end);
    return Array.from({ length: tickCount }, (_, index) => {
      const ratio = index / (tickCount - 1);
      const tsMs = startMs + ratio * (endMs - startMs);
      const tsIso = new Date(tsMs).toISOString();
      const offsetMin = differenceInMinutes(tsIso, now);
      return {
        ratio,
        label: formatOffset(offsetMin),
      };
    });
  }, [window, now, zoom]);

  return (
    <div className="text-ink-3 flex justify-between px-px font-mono text-[10px] tracking-[0.14em]">
      {ticks.map((tick, index) => (
        <span key={index}>{tick.label}</span>
      ))}
    </div>
  );
}
