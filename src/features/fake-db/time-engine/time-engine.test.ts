import { describe, expect, it } from "vitest";
import { createFakeDb } from "../generators/create-fake-db";
import { baseTimestampIso, offsetIso } from "../utils/timestamp.utils";
import { createTimeEngine } from "./time-engine";

const db = createFakeDb("chrono-time-engine");
const engine = createTimeEngine(db);

describe("createTimeEngine", () => {
  it("returns the base timestamp as 'now'", () => {
    expect(engine.now()).toBe(baseTimestampIso());
  });

  it("createWindow spans the requested duration back from end", () => {
    const window = engine.createWindow(engine.now(), 60);
    expect(window.durationMinutes).toBe(60);
    expect(new Date(window.end).getTime()).toBeGreaterThan(
      new Date(window.start).getTime(),
    );
  });

  it("eventsInWindow only returns events inside the window", () => {
    const window = engine.createWindow(engine.now(), 24 * 60);
    const events = engine.eventsInWindow(window);
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event.timestamp >= window.start).toBe(true);
      expect(event.timestamp <= window.end).toBe(true);
    }
  });

  it("eventsInLane filters by lane", () => {
    const window = engine.createWindow(engine.now(), 24 * 60);
    const security = engine.eventsInLane(window, "security");
    expect(security.every((event) => event.lane === "security")).toBe(true);
  });

  it("reconstructAt returns a full fleet snapshot at 'now'", () => {
    const state = engine.reconstructAt(engine.now());
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

  it("reconstructAt excludes future-scheduled updates from rolling list", () => {
    const state = engine.reconstructAt(engine.now());
    const rollingIds = new Set(state.rollingUpdateIds);
    for (const updateId of rollingIds) {
      const update = db.updates.find((entry) => entry.id === updateId);
      expect(update?.stage).not.toBe("queued");
    }
  });

  it("ribbonBuckets aggregates events into the requested number of buckets", () => {
    const window = engine.createWindow(engine.now(), 24 * 60);
    const buckets = engine.ribbonBuckets(window, 24);
    expect(buckets).toHaveLength(24);
    const totalEvents = buckets.reduce((sum, b) => sum + b.eventCount, 0);
    expect(totalEvents).toBe(engine.eventsInWindow(window).length);
    for (const bucket of buckets) {
      expect(bucket.intensity).toBeGreaterThanOrEqual(0);
      expect(bucket.intensity).toBeLessThanOrEqual(1);
    }
  });

  it("nearestEvent returns the closest event and honors threshold", () => {
    const anchor = offsetIso(engine.now(), -120);
    const closest = engine.nearestEvent(anchor);
    expect(closest).not.toBeNull();

    const noneNearby = engine.nearestEvent(offsetIso(engine.now(), -60 * 24 * 365), 1);
    expect(noneNearby).toBeNull();
  });

  it("open incidents at 'now' match db incidents without a resolvedAt", () => {
    const state = engine.reconstructAt(engine.now());
    const openIds = new Set(state.openIncidentIds);
    for (const incident of db.incidents) {
      const shouldBeOpen = !incident.resolvedAt;
      if (shouldBeOpen) {
        expect(openIds.has(incident.id)).toBe(true);
      }
    }
  });
});
