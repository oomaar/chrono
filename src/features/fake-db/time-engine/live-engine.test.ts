import { describe, expect, it } from "vitest";
import { createFakeDb } from "../generators/create-fake-db";
import { baseTimestampIso, offsetIso } from "../utils/timestamp.utils";
import { createClock } from "./clock";
import { derivedUpdateProgress } from "./derived-progress";
import { createLiveEngine } from "./live-engine";

const START = baseTimestampIso();

const buildEngine = (seed = "chrono-live-test") => {
  const db = createFakeDb(seed);
  const clock = createClock({ startAt: START, autoStart: false });
  const engine = createLiveEngine(db, clock, {
    ambientSeed: `${seed}-ambient`,
    ambientAnchor: START,
    ambientEventsPerMinute: 2,
  });
  return { db, clock, engine };
};

describe("createLiveEngine", () => {
  it("returns the clock's current time as now()", () => {
    const { engine, clock } = buildEngine();
    expect(engine.now()).toBe(clock.now());
    const later = offsetIso(START, 30);
    clock.jumpTo(later);
    expect(engine.now()).toBe(later);
  });

  it("ambient event count grows monotonically as time advances", () => {
    const { engine, clock } = buildEngine();
    const initial = engine.ambientEvents().length;
    clock.jumpTo(offsetIso(START, 30));
    const after30 = engine.ambientEvents().length;
    clock.jumpTo(offsetIso(START, 90));
    const after90 = engine.ambientEvents().length;

    expect(after30).toBeGreaterThan(initial);
    expect(after90).toBeGreaterThan(after30);
  });

  it("same ambient seed produces the same ambient stream", () => {
    const a = buildEngine("live-repro");
    const b = buildEngine("live-repro");
    a.clock.jumpTo(offsetIso(START, 45));
    b.clock.jumpTo(offsetIso(START, 45));

    expect(a.engine.ambientEvents()).toEqual(b.engine.ambientEvents());
  });

  it("live events in window include ambient events", () => {
    const { engine, clock } = buildEngine();
    clock.jumpTo(offsetIso(START, 60));
    const window = engine.createWindow(engine.now(), 60);
    const events = engine.liveEventsInWindow(window);
    const ambientIds = new Set(engine.ambientEvents().map((event) => event.id));
    const includesAmbient = events.some((event) => ambientIds.has(event.id));
    expect(includesAmbient).toBe(true);
  });

  it("derivedUpdateProgress advances as the clock ticks for rolling updates", () => {
    const { db, engine, clock } = buildEngine();
    const rolling = db.updates.find((update) => update.stage === "rolling");
    if (!rolling) {
      throw new Error("Test fixture must contain a rolling update");
    }

    clock.jumpTo(rolling.startedAt);
    const initial = engine.derivedUpdateProgress(rolling.id);
    clock.jumpTo(offsetIso(rolling.startedAt, 30));
    const later = engine.derivedUpdateProgress(rolling.id);

    expect(later).toBeGreaterThanOrEqual(initial);
    expect(later).toBeLessThanOrEqual(100);
  });

  it("derivedUpdateProgress caps queued at 0 and completed at 100", () => {
    const { db, engine } = buildEngine();
    const queued = db.updates.find((update) => update.stage === "queued");
    const completed = db.updates.find((update) => update.stage === "completed");
    if (queued) expect(engine.derivedUpdateProgress(queued.id)).toBe(0);
    if (completed) expect(engine.derivedUpdateProgress(completed.id)).toBe(100);
  });

  it("reconstruct at 'now' still returns a valid fleet snapshot", () => {
    const { db, engine, clock } = buildEngine();
    clock.jumpTo(offsetIso(START, 60));
    const state = engine.liveReconstructAt(engine.now());
    expect(state.fleet.total).toBe(db.devices.length);
    const sum =
      state.fleet.online +
      state.fleet.offline +
      state.fleet.degraded +
      state.fleet.isolated +
      state.fleet.nonCompliant +
      state.fleet.maintenance;
    expect(sum).toBe(state.fleet.total);
  });
});

describe("derivedUpdateProgress", () => {
  it("returns 0 for queued updates", () => {
    const progress = derivedUpdateProgress(
      {
        id: "u",
        name: "n",
        kind: "os",
        channel: "stable",
        fromVersion: "1",
        toVersion: "2",
        stage: "queued",
        progress: 0,
        targetCount: 10,
        completedCount: 0,
        failedCount: 0,
        startedAt: START,
        initiatedByUserId: "u",
        affectedTags: [],
      },
      offsetIso(START, 30),
    );
    expect(progress).toBe(0);
  });

  it("never regresses below the base progress for rolling updates", () => {
    const progress = derivedUpdateProgress(
      {
        id: "u",
        name: "n",
        kind: "os",
        channel: "stable",
        fromVersion: "1",
        toVersion: "2",
        stage: "rolling",
        progress: 40,
        targetCount: 10,
        completedCount: 4,
        failedCount: 0,
        startedAt: START,
        initiatedByUserId: "u",
        affectedTags: [],
      },
      START,
    );
    expect(progress).toBeGreaterThanOrEqual(40);
  });
});
