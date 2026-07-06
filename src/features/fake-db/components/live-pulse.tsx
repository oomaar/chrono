"use client";

import { useMemo, useState } from "react";
import {
  BASE_TIMESTAMP_MS,
  createClock,
  createFakeDb,
  createLiveEngine,
  useClock,
} from "@/features/fake-db";

const LIVE_WINDOW_MINUTES = 24 * 60;

/**
 * Compact live pulse — proves the operating system feels alive: real clock,
 * derived deployment progress, and a rolling ambient event count.
 */
export function LivePulse() {
  const { engine, clock, rolling } = useMemo(() => {
    const db = createFakeDb();
    // Use a wall-clock scale that runs 60x faster than real time — 1 real
    // second = 1 simulated minute — so demos surface change quickly.
    const clock = createClock({
      startAt: new Date(BASE_TIMESTAMP_MS).toISOString(),
      tickMs: 1000,
      scale: 60,
    });
    const engine = createLiveEngine(db, clock, {
      ambientSeed: "chrono-live-pulse",
      ambientAnchor: new Date(BASE_TIMESTAMP_MS).toISOString(),
      ambientEventsPerMinute: 1.8,
    });
    const rolling = db.updates.find((update) => update.stage === "rolling");
    return { engine, clock, rolling };
  }, []);

  const [paused, setPaused] = useState(false);

  const now = useClock(clock);
  const ambientCount = engine.ambientEvents(now).length;
  const state = engine.liveReconstructAt(now);
  const rollingProgress = rolling ? engine.derivedUpdateProgress(rolling.id, now) : 0;
  const window = engine.createWindow(now, LIVE_WINDOW_MINUTES);
  const recent = engine.liveEventsInWindow(window).slice(0, 5);

  const handleTogglePause = () => {
    if (paused) clock.start();
    else clock.stop();
    setPaused(!paused);
  };

  return (
    <section className="border-line bg-surface rounded-2xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-brand font-mono text-[10px] tracking-[0.22em] uppercase">
            Live · 60× compressed
          </p>
          <h2 className="text-lg font-semibold">Simulated clock</h2>
        </div>
        <button
          type="button"
          onClick={handleTogglePause}
          className="border-line hover:border-line-strong text-ink-2 hover:text-ink rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="border-line bg-elev rounded-xl border p-3">
          <p className="text-ink font-mono text-lg font-semibold tabular-nums">
            {new Date(now).toISOString().slice(11, 19)}
          </p>
          <p className="text-ink-3 mt-1 text-[10px] tracking-[0.14em] uppercase">
            sim time · utc
          </p>
        </div>
        <div className="border-line bg-elev rounded-xl border p-3">
          <p className="text-brand font-mono text-lg font-semibold tabular-nums">
            {state.fleet.online.toLocaleString()}
          </p>
          <p className="text-ink-3 mt-1 text-[10px] tracking-[0.14em] uppercase">
            online · derived
          </p>
        </div>
        <div className="border-line bg-elev rounded-xl border p-3">
          <p className="text-ink font-mono text-lg font-semibold tabular-nums">
            {ambientCount}
          </p>
          <p className="text-ink-3 mt-1 text-[10px] tracking-[0.14em] uppercase">
            ambient events
          </p>
        </div>
        <div className="border-line bg-elev rounded-xl border p-3">
          <p className="text-warn font-mono text-lg font-semibold tabular-nums">
            {rollingProgress}%
          </p>
          <p className="text-ink-3 mt-1 text-[10px] tracking-[0.14em] uppercase">
            {rolling?.name ?? "no rolling update"}
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-2">
        {recent.map((event) => (
          <li
            key={event.id}
            className="border-line-2 flex items-center gap-3 border-b py-2 text-sm last:border-0"
          >
            <span className="text-ink-3 w-20 font-mono text-[10px] tracking-[0.14em] uppercase">
              {new Date(event.timestamp).toISOString().slice(11, 19)}
            </span>
            <span className="text-ink-3 w-24 font-mono text-[10px] tracking-[0.14em] uppercase">
              {event.lane}
            </span>
            <span className="text-ink-2 flex-1">{event.summary}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
