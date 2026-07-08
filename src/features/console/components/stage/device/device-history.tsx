"use client";

import { useMemo } from "react";
import { cn } from "@/features/design-system";
import { differenceInMinutes } from "@/features/fake-db";
import type { TimelineEvent } from "@/features/fake-db";
import { useConsole } from "../../../console-provider";

const toneDotClass: Record<TimelineEvent["tone"], string> = {
  crit: "bg-crit",
  warn: "bg-warn",
  ok: "bg-ok",
  brand: "bg-brand",
  neutral: "bg-ink-3",
};

const formatAge = (minutes: number): string => {
  if (minutes < 1) return "now";
  if (minutes < 60) return `−${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `−${hours}h${String(mins).padStart(2, "0")}` : `−${hours}h`;
};

/**
 * Timeline of events that touched a specific device — scrolls vertically, in
 * newest-first order. Clicking a row scrubs the ribbon to that moment.
 */
export function DeviceHistory({ deviceId }: { deviceId: string }) {
  const { engine, timeline, setFocusedMoment } = useConsole();

  const events = useMemo(() => {
    const window = engine.createWindow(timeline.now, 24 * 60);
    return engine
      .liveEventsInWindow(window)
      .filter((event) => event.deviceIds.includes(deviceId));
  }, [engine, timeline.now, deviceId]);

  return (
    <section>
      <p className="text-ink-3 mb-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        Timeline · last 24h · {events.length} events
      </p>
      {events.length === 0 ? (
        <div className="border-line-strong text-ink-3 rounded-xl border border-dashed p-6 text-center text-xs">
          No events touched this device in the last 24 hours.
        </div>
      ) : (
        <ul className="border-line divide-line-2 divide-y rounded-xl border">
          {events.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => {
                  timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
                  if (event.incidentId) {
                    setFocusedMoment(event.incidentId);
                  }
                }}
                className="hover:bg-elev flex w-full items-start gap-3 px-3 py-2 text-left transition-colors"
              >
                <span className="text-ink-3 w-14 shrink-0 pt-0.5 font-mono text-[10px] tracking-[0.14em]">
                  {formatAge(
                    Math.abs(differenceInMinutes(event.timestamp, timeline.now)),
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 flex-none rounded-full",
                    toneDotClass[event.tone],
                  )}
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-ink text-xs leading-snug">{event.summary}</p>
                  <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                    {event.kind.replaceAll("-", " ")} · {event.lane}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
