import { describe, expect, it } from "vitest";
import { createFakeDb } from "@/features/fake-db";
import { baseTimestampIso, offsetIso } from "@/features/fake-db/utils/timestamp.utils";
import { createClock } from "@/features/fake-db/time-engine/clock";
import { createLiveEngine } from "@/features/fake-db/time-engine/live-engine";
import { computeAttentionScore, rankByAttention, SEVERITY_SCORE } from "./attention-rank";

const START = baseTimestampIso();

const build = () => {
  const db = createFakeDb("chrono-attention-test");
  const clock = createClock({ startAt: START, autoStart: false });
  const engine = createLiveEngine(db, clock, {
    ambientSeed: "chrono-attention-ambient",
    ambientAnchor: START,
    ambientEventsPerMinute: 0,
  });
  const state = engine.liveReconstructAt(START);
  return { db, engine, state };
};

describe("computeAttentionScore", () => {
  it("returns a score between 0 and 100", () => {
    const { db, state } = build();
    const incident = db.incidents[0];
    const score = computeAttentionScore(incident, state, START);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
    expect(score.incidentId).toBe(incident.id);
    expect(score.factors.length).toBe(6);
  });

  it("ranks a fresh crit incident higher than an old low incident", () => {
    const { db, state } = build();
    const fresh = {
      ...db.incidents[0],
      severity: "crit" as const,
      openedAt: START,
      status: "open" as const,
    };
    const old = {
      ...db.incidents[0],
      id: "old",
      severity: "low" as const,
      openedAt: offsetIso(START, -60 * 24),
      status: "open" as const,
      recommendation: undefined,
    };
    const freshScore = computeAttentionScore(fresh, state, START);
    const oldScore = computeAttentionScore(old, state, START);
    expect(freshScore.total).toBeGreaterThan(oldScore.total);
  });

  it("severity score table is monotonically decreasing", () => {
    expect(SEVERITY_SCORE.crit).toBeGreaterThan(SEVERITY_SCORE.high);
    expect(SEVERITY_SCORE.high).toBeGreaterThan(SEVERITY_SCORE.medium);
    expect(SEVERITY_SCORE.medium).toBeGreaterThan(SEVERITY_SCORE.low);
  });
});

describe("rankByAttention", () => {
  it("returns incidents ordered by total score, highest first", () => {
    const { db, state } = build();
    const open = db.incidents.filter((i) => i.status !== "resolved").slice(0, 4);
    const ranked = rankByAttention(open, state, START);
    for (let i = 1; i < ranked.length; i += 1) {
      expect(ranked[i - 1].attention.total).toBeGreaterThanOrEqual(
        ranked[i].attention.total,
      );
    }
  });
});
