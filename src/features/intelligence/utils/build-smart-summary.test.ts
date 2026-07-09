import { describe, expect, it } from "vitest";
import { createFakeDb } from "@/features/fake-db";
import { baseTimestampIso } from "@/features/fake-db/utils/timestamp.utils";
import { createClock } from "@/features/fake-db/time-engine/clock";
import { createLiveEngine } from "@/features/fake-db/time-engine/live-engine";
import { buildSmartSummary } from "./build-smart-summary";

const START = baseTimestampIso();

const build = () => {
  const db = createFakeDb("chrono-summary-test");
  const clock = createClock({ startAt: START, autoStart: false });
  const engine = createLiveEngine(db, clock, {
    ambientSeed: "chrono-summary-ambient",
    ambientAnchor: START,
    ambientEventsPerMinute: 0,
  });
  const state = engine.liveReconstructAt(START);
  const events = engine.liveEventsInWindow(engine.createWindow(START, 6 * 60));
  return { db, engine, state, events };
};

describe("buildSmartSummary", () => {
  it("produces a headline that mentions open incidents when they exist", () => {
    const { db, state, events } = build();
    const summary = buildSmartSummary({ db, state, events, nowIso: START });
    if (state.openIncidentIds.length > 0) {
      expect(summary.headline).toMatch(/incident/i);
    } else {
      expect(summary.headline.toLowerCase()).toContain("calm");
    }
  });

  it("mirrors the state's open incident count", () => {
    const { db, state, events } = build();
    const summary = buildSmartSummary({ db, state, events, nowIso: START });
    expect(summary.openIncidentCount).toBe(state.openIncidentIds.length);
  });

  it("trend is one of three fixed values", () => {
    const { db, state, events } = build();
    const summary = buildSmartSummary({ db, state, events, nowIso: START });
    expect(["improving", "steady", "deteriorating"]).toContain(summary.trend);
  });

  it("respects the requested window duration", () => {
    const { db, state, events } = build();
    const summary = buildSmartSummary({ db, state, events, nowIso: START }, 60);
    expect(summary.windowMinutes).toBe(60);
  });
});
