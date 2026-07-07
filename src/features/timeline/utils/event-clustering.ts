import type { TimelineEvent, TimeWindow } from "@/features/fake-db";
import type { EventCluster } from "../types/timeline.types";
import { timestampToRatio } from "./time-scale";

const toneCounts = () => ({
  criticalCount: 0,
  warnCount: 0,
  okCount: 0,
  brandCount: 0,
});

const bumpTone = (counts: ReturnType<typeof toneCounts>, event: TimelineEvent): void => {
  if (event.tone === "crit") counts.criticalCount += 1;
  else if (event.tone === "warn") counts.warnCount += 1;
  else if (event.tone === "ok") counts.okCount += 1;
  else if (event.tone === "brand") counts.brandCount += 1;
};

const chooseRepresentative = (events: TimelineEvent[]): TimelineEvent => {
  const order = { crit: 0, warn: 1, brand: 2, ok: 3, neutral: 4 } as const;
  return [...events].sort((a, b) => (order[a.tone] ?? 5) - (order[b.tone] ?? 5))[0];
};

/**
 * Cluster events whose horizontal distance on the ribbon (in pixels) is less
 * than `distancePx`. Events must already be filtered to the window.
 *
 * Returns clusters sorted by ratio ascending.
 */
export const clusterEventsByProximity = (
  events: TimelineEvent[],
  window: TimeWindow,
  widthPx: number,
  distancePx: number,
): EventCluster[] => {
  if (events.length === 0 || widthPx <= 0) return [];

  const withRatios = events
    .map((event) => ({
      event,
      ratio: timestampToRatio(event.timestamp, window),
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const threshold = distancePx / widthPx;
  const clusters: EventCluster[] = [];
  let current: TimelineEvent[] = [];
  let currentAnchorRatio = withRatios[0].ratio;

  for (const { event, ratio } of withRatios) {
    if (current.length === 0) {
      current.push(event);
      currentAnchorRatio = ratio;
      continue;
    }

    if (ratio - currentAnchorRatio <= threshold) {
      current.push(event);
    } else {
      clusters.push(finalizeCluster(current, window));
      current = [event];
      currentAnchorRatio = ratio;
    }
  }

  if (current.length > 0) {
    clusters.push(finalizeCluster(current, window));
  }

  return clusters;
};

const finalizeCluster = (events: TimelineEvent[], window: TimeWindow): EventCluster => {
  const counts = toneCounts();
  for (const event of events) bumpTone(counts, event);
  const representative = chooseRepresentative(events);
  return {
    id: `cluster_${representative.id}_${events.length}`,
    representative,
    events,
    timestamp: representative.timestamp,
    ratio: timestampToRatio(representative.timestamp, window),
    ...counts,
  };
};
