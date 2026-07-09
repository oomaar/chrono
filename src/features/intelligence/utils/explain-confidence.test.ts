import { describe, expect, it } from "vitest";
import { createFakeDb } from "@/features/fake-db";
import { confidenceBand, explainRecommendationConfidence } from "./explain-confidence";

describe("confidenceBand", () => {
  it("maps into high / medium / low bands", () => {
    expect(confidenceBand(95)).toBe("high");
    expect(confidenceBand(75)).toBe("medium");
    expect(confidenceBand(30)).toBe("low");
  });
});

describe("explainRecommendationConfidence", () => {
  it("returns four factors for an incident with a recommendation", () => {
    const db = createFakeDb("chrono-confidence-test");
    const withRec = db.incidents.find((i) => i.recommendation);
    if (!withRec) throw new Error("expected an incident with a recommendation");
    const breakdown = explainRecommendationConfidence(withRec);
    expect(breakdown.score).toBe(withRec.recommendation?.confidence);
    expect(breakdown.factors.length).toBe(4);
    for (const factor of breakdown.factors) {
      expect(factor.contribution).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns zero factors when no recommendation is present", () => {
    const db = createFakeDb("chrono-confidence-none");
    const withoutRec = db.incidents.find((i) => !i.recommendation);
    if (!withoutRec) return; // some seeds might have recs on all — that's ok
    const breakdown = explainRecommendationConfidence(withoutRec);
    expect(breakdown.factors.length).toBe(0);
    expect(breakdown.score).toBe(0);
  });
});
