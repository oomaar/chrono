"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  BASE_TIMESTAMP_MS,
  createClock,
  createFakeDb,
  createLiveEngine,
} from "@/features/fake-db";
import { useTimelineEngine } from "@/features/timeline";
import type { ConsoleContextValue } from "./types/console.types";

const TIMELINE_ANCHOR_ISO = new Date(BASE_TIMESTAMP_MS).toISOString();

const ConsoleContext = createContext<ConsoleContextValue | null>(null);

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const { db, engine } = useMemo(() => {
    const database = createFakeDb();
    const clock = createClock({
      startAt: TIMELINE_ANCHOR_ISO,
      tickMs: 1000,
      scale: 60,
    });
    const liveEngine = createLiveEngine(database, clock, {
      ambientSeed: "chrono-console",
      ambientAnchor: TIMELINE_ANCHOR_ISO,
      ambientEventsPerMinute: 1.6,
    });
    return { db: database, engine: liveEngine };
  }, []);

  const timeline = useTimelineEngine({
    engine,
    initialMode: "live",
    initialZoom: "24h",
  });

  const [focusedMomentId, setFocusedMoment] = useState<string | null>(null);

  const value = useMemo<ConsoleContextValue>(
    () => ({
      db,
      engine,
      timeline,
      focusedMomentId,
      setFocusedMoment,
    }),
    [db, engine, timeline, focusedMomentId],
  );

  return <ConsoleContext.Provider value={value}>{children}</ConsoleContext.Provider>;
}

export function useConsole(): ConsoleContextValue {
  const context = useContext(ConsoleContext);
  if (!context) {
    throw new Error("useConsole must be used within a ConsoleProvider");
  }
  return context;
}
