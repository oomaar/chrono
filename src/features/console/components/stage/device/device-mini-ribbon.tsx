"use client";

import { useMemo } from "react";
import type { LiveEngine, TimelineEvent } from "@/features/fake-db";

const toneFill: Record<TimelineEvent["tone"], string> = {
  crit: "var(--color-crit)",
  warn: "var(--color-warn)",
  ok: "var(--color-ok)",
  brand: "var(--color-brand)",
  neutral: "var(--color-ink-3)",
};

type DeviceMiniRibbonProps = {
  engine: LiveEngine;
  nowIso: string;
  deviceId: string;
  windowMinutes?: number;
  onMarkerClick?: (event: TimelineEvent) => void;
};

/**
 * A compact horizontal timeline scoped to one device — "this device's life on
 * one line." SVG-based so per-marker positions can be computed without inline
 * CSS. Matches the wireframe's 44px ribbon under the device title.
 */
export function DeviceMiniRibbon({
  engine,
  nowIso,
  deviceId,
  windowMinutes = 24 * 60,
  onMarkerClick,
}: DeviceMiniRibbonProps) {
  const { events, startMs, endMs } = useMemo(() => {
    const window = engine.createWindow(nowIso, windowMinutes);
    const deviceEvents = engine
      .liveEventsInWindow(window)
      .filter((event) => event.deviceIds.includes(deviceId));
    return {
      events: deviceEvents,
      startMs: new Date(window.start).getTime(),
      endMs: new Date(window.end).getTime(),
    };
  }, [engine, nowIso, deviceId, windowMinutes]);

  const span = Math.max(1, endMs - startMs);
  const hours = Math.round(windowMinutes / 60);

  return (
    <div className="border-line bg-surface relative h-11 overflow-hidden rounded-lg border">
      <svg
        viewBox="0 0 1000 44"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        {/* baseline */}
        <line
          x1={12}
          x2={988}
          y1={22}
          y2={22}
          stroke="var(--color-line-strong)"
          strokeWidth={1}
        />
        {events.map((event) => {
          const ratio = Math.min(
            1,
            Math.max(0, (new Date(event.timestamp).getTime() - startMs) / span),
          );
          const cx = 12 + ratio * (1000 - 24);
          return (
            <g
              key={event.id}
              onClick={() => onMarkerClick?.(event)}
              className="cursor-pointer"
            >
              <circle cx={cx} cy={22} r={9} fill={toneFill[event.tone]} opacity={0.18} />
              <circle cx={cx} cy={22} r={4} fill={toneFill[event.tone]}>
                <title>{event.summary}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <span className="text-ink-3 pointer-events-none absolute top-1 left-2 font-mono text-[9px] tracking-[0.14em]">
        −{hours}h
      </span>
      <span className="text-ink-3 pointer-events-none absolute right-2 bottom-1 font-mono text-[9px] tracking-[0.14em]">
        now
      </span>
    </div>
  );
}
