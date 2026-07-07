"use client";

import { useMemo } from "react";
import { differenceInMinutes } from "@/features/fake-db";
import { useConsole } from "../console-provider";
import type { RecentMomentItem } from "../types/console.types";

/**
 * The last N timeline events strictly before the playhead, hydrated with an
 * age-in-minutes value for display.
 */
export function useRecentMoments(count = 8): RecentMomentItem[] {
  const { timeline } = useConsole();

  return useMemo(() => {
    const items: RecentMomentItem[] = [];
    for (const event of timeline.events) {
      if (event.timestamp > timeline.playhead) continue;
      items.push({
        event,
        ageMinutes: Math.max(0, -differenceInMinutes(event.timestamp, timeline.playhead)),
      });
      if (items.length >= count) break;
    }
    return items;
  }, [timeline.events, timeline.playhead, count]);
}
