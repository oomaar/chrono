"use client";

import { useMemo } from "react";
import type { TimelineEvent, TimelineLane, TimeWindow } from "@/features/fake-db";
import { TIMELINE_LANE_LABELS } from "@/features/fake-db";
import { timestampToRatio } from "../../utils/time-scale";

type TimelineLaneRowProps = {
  lane: TimelineLane;
  events: TimelineEvent[];
  window: TimeWindow;
};

const toneClass = (tone: TimelineEvent["tone"]): string => {
  switch (tone) {
    case "crit":
      return "text-crit";
    case "warn":
      return "text-warn";
    case "ok":
      return "text-ok";
    case "brand":
      return "text-brand";
    default:
      return "text-ink-3";
  }
};

export function TimelineLaneRow({ lane, events, window }: TimelineLaneRowProps) {
  const laneEvents = useMemo(
    () => events.filter((event) => event.lane === lane),
    [events, lane],
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-ink-3 w-24 shrink-0 text-right font-mono text-[9px] tracking-widest uppercase">
        {TIMELINE_LANE_LABELS[lane]}
      </span>
      <div className="border-line bg-bg relative h-4 flex-1 overflow-hidden rounded-md border">
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {laneEvents.map((event) => {
            const ratio = timestampToRatio(event.timestamp, window);
            const x = Math.max(0, Math.min(1, ratio)) * 100;
            return (
              <rect
                key={event.id}
                x={x - 0.4}
                y="4"
                width="0.9"
                height="12"
                rx="0.4"
                className={toneClass(event.tone)}
                fill="currentColor"
                opacity={0.85}
              />
            );
          })}
        </svg>
      </div>
      <span className="text-ink-3 w-8 shrink-0 text-right font-mono text-[10px] tabular-nums">
        {laneEvents.length}
      </span>
    </div>
  );
}
