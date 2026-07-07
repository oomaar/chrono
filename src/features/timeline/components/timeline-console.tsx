"use client";

import { useMemo } from "react";
import {
  BASE_TIMESTAMP_MS,
  createClock,
  createFakeDb,
  createLiveEngine,
} from "@/features/fake-db";
import { TimelineCanvas } from "@/features/timeline";
import { ThemeToggle } from "@/features/theme";

const TIMELINE_ANCHOR_ISO = new Date(BASE_TIMESTAMP_MS).toISOString();

export function TimelineConsole() {
  const engine = useMemo(() => {
    const db = createFakeDb();
    const clock = createClock({
      startAt: TIMELINE_ANCHOR_ISO,
      tickMs: 1000,
      scale: 60,
    });
    return createLiveEngine(db, clock, {
      ambientSeed: "chrono-timeline-console",
      ambientAnchor: TIMELINE_ANCHOR_ISO,
      ambientEventsPerMinute: 1.8,
    });
  }, []);

  return (
    <div className="bg-bg text-ink relative min-h-screen overflow-hidden">
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-10">
        <header className="border-line bg-surface flex flex-col justify-between gap-4 rounded-2xl border p-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-brand font-mono text-[10px] tracking-[0.22em] uppercase">
              Phase 3 · Timeline Console
            </p>
            <h1 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Time is the interface.
            </h1>
            <p className="text-ink-2 max-w-2xl text-sm">
              Scrub the ribbon to reconstruct fleet state at any moment. Zoom, jump,
              pause, and step through the timeline. Live mode follows the playhead as the
              clock advances.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <TimelineCanvas engine={engine} initialMode="live" initialZoom="24h" />

        <p className="text-ink-3 max-w-3xl font-mono text-[10px] tracking-[0.14em] uppercase">
          hint · drag the ribbon to scrub · click a marker to jump · use{" "}
          <span className="text-brand">now</span> to resume live
        </p>
      </main>
    </div>
  );
}
