import type { FakeDb } from "../types/fake-db.types";
import type {
  FleetSnapshot,
  ReconstructedState,
  RibbonBucket,
  TimeEngine,
  TimeWindow,
} from "../types/time-engine.types";
import type { TimelineEvent, TimelineLane } from "../types/timeline-event.types";
import {
  baseTimestampIso,
  differenceInMinutes,
  offsetIso,
  parseIso,
} from "../utils/timestamp.utils";

const DEFAULT_BUCKET_COUNT = 84;

const emptyFleet = (): FleetSnapshot => ({
  total: 0,
  online: 0,
  offline: 0,
  degraded: 0,
  isolated: 0,
  nonCompliant: 0,
  maintenance: 0,
});

/**
 * Create the time engine bound to a specific FakeDb snapshot.
 * All time math is deterministic and derived from event/entity timestamps.
 */
export const createTimeEngine = (db: FakeDb): TimeEngine => {
  const sortedEvents = [...db.timelineEvents].sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
  );

  const now = () => baseTimestampIso();

  const createWindow = (endTimestamp: string, durationMinutes: number): TimeWindow => {
    const start = offsetIso(endTimestamp, -Math.abs(durationMinutes));
    return {
      start,
      end: endTimestamp,
      durationMinutes: Math.abs(durationMinutes),
    };
  };

  const eventsInWindow = (window: TimeWindow): TimelineEvent[] => {
    const startMs = parseIso(window.start);
    const endMs = parseIso(window.end);
    return sortedEvents.filter((event) => {
      const value = parseIso(event.timestamp);
      return value >= startMs && value <= endMs;
    });
  };

  const eventsInLane = (window: TimeWindow, lane: TimelineLane): TimelineEvent[] =>
    eventsInWindow(window).filter((event) => event.lane === lane);

  /**
   * Reconstruct fleet state at a given timestamp.
   *
   * Strategy:
   *  1. Start from the "current" device statuses (the fake-db anchor).
   *  2. Replay device-online / device-offline events that occurred *after*
   *     the requested timestamp *in reverse* to undo them.
   * This gives an approximate historical fleet snapshot without needing full
   * event sourcing for every entity.
   */
  const reconstructAt = (timestamp: string): ReconstructedState => {
    const targetMs = parseIso(timestamp);
    const fleet = emptyFleet();
    const deviceStatus = new Map(db.devices.map((device) => [device.id, device.status]));

    // Undo online/offline transitions that happened after the target time.
    const forwardEvents = sortedEvents.filter(
      (event) => parseIso(event.timestamp) > targetMs,
    );
    for (const event of forwardEvents) {
      const [deviceId] = event.deviceIds;
      if (!deviceId) continue;
      if (event.kind === "device-offline") {
        deviceStatus.set(deviceId, "online");
      } else if (event.kind === "device-online") {
        deviceStatus.set(deviceId, "offline");
      }
    }

    for (const status of deviceStatus.values()) {
      fleet.total += 1;
      if (status === "online") fleet.online += 1;
      else if (status === "offline") fleet.offline += 1;
      else if (status === "degraded") fleet.degraded += 1;
      else if (status === "isolated") fleet.isolated += 1;
      else if (status === "non-compliant") fleet.nonCompliant += 1;
      else if (status === "maintenance") fleet.maintenance += 1;
    }

    const openIncidentIds = db.incidents
      .filter((incident) => {
        const openedMs = parseIso(incident.openedAt);
        if (openedMs > targetMs) return false;
        if (!incident.resolvedAt) return true;
        return parseIso(incident.resolvedAt) > targetMs;
      })
      .map((incident) => incident.id);

    const rollingUpdateIds = db.updates
      .filter((update) => {
        const startedMs = parseIso(update.startedAt);
        if (startedMs > targetMs) return false;
        if (update.stage === "rolling" || update.stage === "paused") return true;
        if (!update.finishedAt) return update.stage !== "queued";
        return parseIso(update.finishedAt) > targetMs;
      })
      .map((update) => update.id);

    const activeAutomationIds = db.automations
      .filter((automation) => {
        if (automation.status !== "active") return false;
        const createdMs = parseIso(automation.createdAt);
        return createdMs <= targetMs;
      })
      .map((automation) => automation.id);

    return {
      atTimestamp: timestamp,
      fleet,
      openIncidentIds,
      rollingUpdateIds,
      activeAutomationIds,
    };
  };

  const ribbonBuckets = (
    window: TimeWindow,
    bucketCount: number = DEFAULT_BUCKET_COUNT,
  ): RibbonBucket[] => {
    const startMs = parseIso(window.start);
    const endMs = parseIso(window.end);
    const spanMs = Math.max(1, endMs - startMs);
    const bucketMs = spanMs / bucketCount;

    const buckets: RibbonBucket[] = Array.from({ length: bucketCount }, (_, index) => ({
      index,
      timestamp: new Date(startMs + (index + 0.5) * bucketMs).toISOString(),
      eventCount: 0,
      criticalCount: 0,
      warnCount: 0,
      okCount: 0,
      intensity: 0,
    }));

    for (const event of eventsInWindow(window)) {
      const eventMs = parseIso(event.timestamp);
      const rawIndex = Math.floor((eventMs - startMs) / bucketMs);
      const index = Math.max(0, Math.min(bucketCount - 1, rawIndex));
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

  const nearestEvent = (
    timestamp: string,
    thresholdMinutes?: number,
  ): TimelineEvent | null => {
    if (sortedEvents.length === 0) return null;
    let best: TimelineEvent | null = null;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (const event of sortedEvents) {
      const delta = Math.abs(differenceInMinutes(event.timestamp, timestamp));
      if (delta < bestDelta) {
        bestDelta = delta;
        best = event;
      }
    }
    if (thresholdMinutes !== undefined && bestDelta > thresholdMinutes) {
      return null;
    }
    return best;
  };

  return {
    now,
    reconstructAt,
    eventsInWindow,
    eventsInLane,
    ribbonBuckets,
    nearestEvent,
    createWindow,
    offsetTimestamp: (timestamp, minutes) => offsetIso(timestamp, minutes),
  };
};
