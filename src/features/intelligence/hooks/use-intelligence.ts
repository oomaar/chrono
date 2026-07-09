"use client";

import { useMemo } from "react";
import { useCommandLanguage } from "@/features/command-language";
import { differenceInMinutes } from "@/features/fake-db";
import { useConsole } from "@/features/console";
import type {
  DecisionItem,
  IncidentCluster,
  IntelligenceContext,
  NextAction,
  SmartSummary,
} from "../types/intelligence.types";
import { rankByAttention } from "../utils/attention-rank";
import { buildSmartSummary } from "../utils/build-smart-summary";
import { clusterIncidents, findClusterForIncident } from "../utils/cluster-incidents";
import { suggestNextActions } from "../utils/suggest-next-actions";

export type IntelligenceView = {
  context: IntelligenceContext;
  clusters: IncidentCluster[];
  decisions: DecisionItem[];
  summary: SmartSummary;
  nextActions: NextAction[];
};

/**
 * The one hook the console reaches for. Runs the full intelligence pipeline
 * against the current playhead state — clustering, attention ranking, smart
 * summary, next actions — and returns a stable view. All computations are
 * memoized on the inputs that actually matter, so scrubbing the playhead
 * re-runs but idle re-renders don't.
 */
export function useIntelligence(): IntelligenceView {
  const { db, engine, timeline } = useConsole();
  const { history } = useCommandLanguage();

  const context: IntelligenceContext = useMemo(
    () => ({
      db,
      state: timeline.state,
      events: timeline.events,
      nowIso: timeline.playhead,
    }),
    [db, timeline.state, timeline.events, timeline.playhead],
  );

  const openIncidents = useMemo(
    () =>
      db.incidents.filter((incident) =>
        context.state.openIncidentIds.includes(incident.id),
      ),
    [db.incidents, context.state.openIncidentIds],
  );

  const clusters = useMemo(
    () => clusterIncidents(openIncidents, db),
    [openIncidents, db],
  );

  const ranked = useMemo(
    () => rankByAttention(openIncidents, context.state, context.nowIso),
    [openIncidents, context.state, context.nowIso],
  );

  const decisions: DecisionItem[] = useMemo(
    () =>
      ranked.map(({ incident, attention }) => {
        const cluster = findClusterForIncident(incident.id, clusters);
        return {
          incident,
          attention,
          recommendation: incident.recommendation ?? null,
          cluster,
          clusterSiblings: cluster ? Math.max(0, cluster.incidentIds.length - 1) : 0,
          ageMinutes: Math.max(
            0,
            -differenceInMinutes(incident.openedAt, context.nowIso),
          ),
        };
      }),
    [ranked, clusters, context.nowIso],
  );

  const summary = useMemo(() => buildSmartSummary(context), [context]);
  const nextActions = useMemo(
    () => suggestNextActions({ context, clusters, receipts: history }),
    [context, clusters, history],
  );

  // touch engine to keep react-hooks/exhaustive-deps happy — the events on
  // context already come from the engine via the timeline state, but a
  // reference lets consumers derive further ad-hoc queries if they want.
  void engine;

  return { context, clusters, decisions, summary, nextActions };
}
