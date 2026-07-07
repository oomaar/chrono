import { describe, expect, it } from "vitest";
import { isoFromOffset, type TimelineEvent } from "@/features/fake-db";
import { clusterEventsByProximity } from "./event-clustering";

const window = {
  start: isoFromOffset(-60),
  end: isoFromOffset(60),
  durationMinutes: 120,
};

const buildEvent = (
  id: string,
  minuteOffset: number,
  tone: TimelineEvent["tone"] = "ok",
): TimelineEvent => ({
  id,
  kind: "device-online",
  lane: "connectivity",
  tone,
  timestamp: isoFromOffset(minuteOffset),
  summary: id,
  deviceIds: [],
  reversible: false,
  future: false,
});

describe("clusterEventsByProximity", () => {
  it("returns empty array when there are no events", () => {
    expect(clusterEventsByProximity([], window, 500, 20)).toEqual([]);
  });

  it("returns empty array when width is zero", () => {
    expect(clusterEventsByProximity([buildEvent("a", 0)], window, 0, 20)).toEqual([]);
  });

  it("returns one cluster per event when they are far apart", () => {
    const events = [buildEvent("a", -50), buildEvent("b", 0), buildEvent("c", 50)];
    const clusters = clusterEventsByProximity(events, window, 1000, 10);
    expect(clusters).toHaveLength(3);
    for (const cluster of clusters) {
      expect(cluster.events).toHaveLength(1);
    }
  });

  it("clusters events that fall within the pixel threshold", () => {
    const events = [
      buildEvent("a", 0),
      buildEvent("b", 1),
      buildEvent("c", 2),
      buildEvent("d", 40),
    ];
    // 1 minute out of 120 = ~0.83% of width; at 1000px that's ~8px.
    // With threshold of 20px, the first three cluster together.
    const clusters = clusterEventsByProximity(events, window, 1000, 20);
    expect(clusters).toHaveLength(2);
    expect(clusters[0].events).toHaveLength(3);
    expect(clusters[1].events).toHaveLength(1);
  });

  it("picks the highest-severity event as the cluster representative", () => {
    const events = [
      buildEvent("a", 0, "ok"),
      buildEvent("b", 1, "crit"),
      buildEvent("c", 2, "warn"),
    ];
    const [cluster] = clusterEventsByProximity(events, window, 1000, 40);
    expect(cluster.representative.id).toBe("b");
    expect(cluster.criticalCount).toBe(1);
    expect(cluster.warnCount).toBe(1);
    expect(cluster.okCount).toBe(1);
  });

  it("sorts clusters by ratio ascending", () => {
    const events = [
      buildEvent("late", 40),
      buildEvent("early", -40),
      buildEvent("mid", 0),
    ];
    const clusters = clusterEventsByProximity(events, window, 1000, 5);
    const ratios = clusters.map((c) => c.ratio);
    const sorted = [...ratios].sort((a, b) => a - b);
    expect(ratios).toEqual(sorted);
  });
});
