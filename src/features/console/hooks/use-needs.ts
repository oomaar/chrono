"use client";

import { useMemo } from "react";
import { differenceInMinutes } from "@/features/fake-db";
import { useConsole } from "../console-provider";
import type { NeedItem } from "../types/console.types";

const SEVERITY_ORDER = { crit: 0, high: 1, medium: 2, low: 3 } as const;

/**
 * Derives "moments that need a decision" from the state reconstructed at the
 * current playhead: open incidents that carry a recommendation, sorted by
 * severity then by age.
 */
export function useNeeds(): NeedItem[] {
  const { db, timeline } = useConsole();
  const openIds = timeline.state.openIncidentIds;

  return useMemo(() => {
    const openSet = new Set(openIds);
    const items: NeedItem[] = [];
    for (const incident of db.incidents) {
      if (!openSet.has(incident.id)) continue;
      items.push({
        incident,
        hasRecommendation: Boolean(incident.recommendation),
        confidence: incident.recommendation?.confidence ?? null,
        ageMinutes: Math.max(
          0,
          -differenceInMinutes(incident.openedAt, timeline.playhead),
        ),
      });
    }
    return items.sort((a, b) => {
      const bySeverity =
        SEVERITY_ORDER[a.incident.severity] - SEVERITY_ORDER[b.incident.severity];
      if (bySeverity !== 0) return bySeverity;
      return b.ageMinutes - a.ageMinutes;
    });
  }, [db.incidents, openIds, timeline.playhead]);
}
