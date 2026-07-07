"use client";

import { useMemo } from "react";
import type { TimelineEvent, TimeWindow } from "@/features/fake-db";
import type { EventCluster } from "../types/timeline.types";
import { clusterEventsByProximity } from "../utils/event-clustering";
import { MARKER_CLUSTER_DISTANCE_PX } from "../utils/zoom-presets";

type Options = {
  events: TimelineEvent[];
  window: TimeWindow;
  ribbonWidthPx: number;
  distancePx?: number;
};

/**
 * Memoized clustering of events into marker groups based on horizontal
 * proximity in pixels. Adjacent events collapse when they'd overlap visually.
 */
export const useEventGroups = ({
  events,
  window,
  ribbonWidthPx,
  distancePx = MARKER_CLUSTER_DISTANCE_PX,
}: Options): EventCluster[] =>
  useMemo(
    () => clusterEventsByProximity(events, window, ribbonWidthPx, distancePx),
    [events, window, ribbonWidthPx, distancePx],
  );
