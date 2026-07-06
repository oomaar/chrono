import type { FakeDb } from "../types/fake-db.types";
import type {
  ReconstructedState,
  RibbonBucket,
  TimeEngine,
  TimeWindow,
} from "../types/time-engine.types";
import type { TimelineEvent, TimelineLane } from "../types/timeline-event.types";
import { differenceInMinutes, parseIso } from "../utils/timestamp.utils";
import { createAmbientEventGenerator } from "./ambient-generator";
import type { AmbientEventGenerator } from "./ambient-generator";
import type { Clock } from "./clock.types";
import { derivedUpdateProgress } from "./derived-progress";
import { createTimeEngine } from "./time-engine";

export type LiveEngineOptions = {
  /** Seed for deterministic ambient event generation. */
  ambientSeed?: string;
  /** Anchor time for the ambient stream. Defaults to `clock.now()` at creation. */
  ambientAnchor?: string;
  /** Average ambient events per simulated minute. */
  ambientEventsPerMinute?: number;
  /** Estimated duration for rolling updates when deriving progress. */
  updateDurationMinutes?: number;
};

export type LiveEngine = TimeEngine & {
  /** The clock this engine is bound to. */
  clock: Clock;
  /** The ambient generator (exposed for advanced use). */
  ambient: AmbientEventGenerator;
  /** All ambient events up to the given time (defaults to now). */
  ambientEvents(at?: string): TimelineEvent[];
  /** Baseline + ambient events inside a window, sorted newest → oldest. */
  liveEventsInWindow(window: TimeWindow): TimelineEvent[];
  /** Baseline + ambient events for a lane inside a window. */
  liveEventsInLane(window: TimeWindow, lane: TimelineLane): TimelineEvent[];
  /** Reconstruct fleet state including ambient online/offline transitions. */
  liveReconstructAt(timestamp: string): ReconstructedState;
  /** Ribbon buckets computed over baseline + ambient events. */
  liveRibbonBuckets(window: TimeWindow, bucketCount?: number): RibbonBucket[];
  /** Live progress for an update at the given time (defaults to now). */
  derivedUpdateProgress(updateId: string, at?: string): number;
};

/**
 * The live engine layers a real clock and a deterministic ambient event stream
 * on top of the static universe. Same clock start + same ambient seed = same
 * live experience, so demos are reproducible while feeling alive.
 */
export const createLiveEngine = (
  db: FakeDb,
  clock: Clock,
  options: LiveEngineOptions = {},
): LiveEngine => {
  const baseEngine = createTimeEngine(db);
  const ambient = createAmbientEventGenerator(db, {
    seed: options.ambientSeed ?? "chrono-ambient",
    anchor: options.ambientAnchor ?? clock.now(),
    eventsPerMinute: options.ambientEventsPerMinute,
  });

  const liveEventsInWindow = (window: TimeWindow): TimelineEvent[] => {
    const baseline = baseEngine.eventsInWindow(window);
    const startMs = parseIso(window.start);
    const endMs = parseIso(window.end);
    const ambientEvents = ambient.eventsUpTo(window.end).filter((event) => {
      const timeMs = parseIso(event.timestamp);
      return timeMs >= startMs && timeMs <= endMs;
    });
    return [...baseline, ...ambientEvents].sort((a, b) =>
      a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0,
    );
  };

  const liveEventsInLane = (window: TimeWindow, lane: TimelineLane): TimelineEvent[] =>
    liveEventsInWindow(window).filter((event) => event.lane === lane);

  const liveReconstructAt = (timestamp: string): ReconstructedState => {
    const baseState = baseEngine.reconstructAt(timestamp);
    const ambientEvents = ambient.eventsUpTo(timestamp);

    let online = baseState.fleet.online;
    let offline = baseState.fleet.offline;
    // Only transition when the source pool is non-empty, so the total invariant
    // (sum of statuses === total devices) is preserved.
    for (const event of ambientEvents) {
      if (event.kind === "device-offline" && online > 0) {
        online -= 1;
        offline += 1;
      } else if (event.kind === "device-online" && offline > 0) {
        offline -= 1;
        online += 1;
      }
    }

    return {
      ...baseState,
      fleet: {
        ...baseState.fleet,
        online,
        offline,
      },
    };
  };

  const liveRibbonBuckets = (
    window: TimeWindow,
    bucketCount?: number,
  ): RibbonBucket[] => {
    const target = bucketCount ?? 84;
    const startMs = parseIso(window.start);
    const endMs = parseIso(window.end);
    const spanMs = Math.max(1, endMs - startMs);
    const bucketMs = spanMs / target;

    const buckets: RibbonBucket[] = Array.from({ length: target }, (_, index) => ({
      index,
      timestamp: new Date(startMs + (index + 0.5) * bucketMs).toISOString(),
      eventCount: 0,
      criticalCount: 0,
      warnCount: 0,
      okCount: 0,
      intensity: 0,
    }));

    for (const event of liveEventsInWindow(window)) {
      const eventMs = parseIso(event.timestamp);
      const rawIndex = Math.floor((eventMs - startMs) / bucketMs);
      const index = Math.max(0, Math.min(target - 1, rawIndex));
      const bucket = buckets[index];
      bucket.eventCount += 1;
      if (event.tone === "crit") bucket.criticalCount += 1;
      else if (event.tone === "warn") bucket.warnCount += 1;
      else if (event.tone === "ok" || event.tone === "brand") bucket.okCount += 1;
    }

    const maxCount = Math.max(1, ...buckets.map((b) => b.eventCount));
    for (const bucket of buckets) {
      bucket.intensity = bucket.eventCount / maxCount;
    }

    return buckets;
  };

  return {
    ...baseEngine,
    clock,
    ambient,
    now: () => clock.now(),
    ambientEvents: (at) => ambient.eventsUpTo(at ?? clock.now()),
    liveEventsInWindow,
    liveEventsInLane,
    liveReconstructAt,
    liveRibbonBuckets,
    derivedUpdateProgress: (updateId, at) => {
      const update = db.updates.find((entry) => entry.id === updateId);
      if (!update) return 0;
      return derivedUpdateProgress(
        update,
        at ?? clock.now(),
        options.updateDurationMinutes,
      );
    },
  };
};

/**
 * Small helper: how many minutes of simulated time have elapsed since the
 * ambient anchor. Useful for "session uptime" displays.
 */
export const liveElapsedMinutes = (engine: LiveEngine, sinceIso: string) =>
  differenceInMinutes(engine.now(), sinceIso);
