import type { Incident } from "@/features/fake-db";
import type { CommandReceipt } from "@/features/command-language";
import type {
  IncidentCluster,
  IntelligenceContext,
  NextAction,
} from "../types/intelligence.types";

// ---------------------------------------------------------------------------
// Individual suggestion generators. Each returns 0..N candidate actions; the
// public function picks the top-scoring three so the UI stays uncluttered.
// ---------------------------------------------------------------------------

const retryFailed = (receipts: CommandReceipt[]): NextAction[] => {
  const recent = receipts
    .filter((r) => r.status === "reverted" || r.status === "cancelled")
    .slice(0, 3);
  return recent.map((receipt) => ({
    id: `next_retry_${receipt.id}`,
    kind: "retry-failed",
    headline: `Retry ${receipt.verb} ${receipt.scopeSummary}`,
    detail: `Previous receipt was ${receipt.status}. Retry queues a fresh attempt.`,
    command: receipt.raw,
    confidence: 78,
    tone: "warn",
  }));
};

const verifyRecentFix = (receipts: CommandReceipt[]): NextAction[] => {
  const lastCommit = receipts.find((r) => r.status === "committed" && r.reversible);
  if (!lastCommit) return [];
  return [
    {
      id: `next_verify_${lastCommit.id}`,
      kind: "verify-fix",
      headline: `Verify ${lastCommit.verb} on ${lastCommit.scopeSummary}`,
      detail:
        "Pin the moment before the fix, then compare against now to confirm the effect.",
      confidence: 84,
      tone: "brand",
    },
  ];
};

const investigateHotspot = (
  context: IntelligenceContext,
  clusters: IncidentCluster[],
): NextAction[] => {
  const bigCluster = clusters.find((c) => c.incidentIds.length >= 2);
  if (!bigCluster) return [];
  const first = context.db.incidents.find((i) => i.id === bigCluster.incidentIds[0]);
  return [
    {
      id: `next_hotspot_${bigCluster.id}`,
      kind: "investigate-hotspot",
      headline: bigCluster.headline,
      detail: `${bigCluster.incidentIds.length} incidents share ${bigCluster.reasons
        .slice(0, 2)
        .map((r) => r.label.toLowerCase())
        .join(" + ")}.`,
      incidentId: first?.id,
      confidence: 90,
      tone: "crit",
    },
  ];
};

const escalateAging = (
  context: IntelligenceContext,
  openIncidents: Incident[],
): NextAction[] => {
  const aging = openIncidents.find((incident) => {
    const openedMs = new Date(incident.openedAt).getTime();
    const nowMs = new Date(context.nowIso).getTime();
    return incident.severity !== "low" && nowMs - openedMs >= 6 * 60 * 60 * 1000;
  });
  if (!aging) return [];
  return [
    {
      id: `next_escalate_${aging.id}`,
      kind: "escalate",
      headline: `Escalate "${aging.title}"`,
      detail: "Open for over 6h — page the on-call owner.",
      incidentId: aging.id,
      confidence: 70,
      tone: "warn",
    },
  ];
};

const pinAndCompare = (
  context: IntelligenceContext,
  openIncidents: Incident[],
): NextAction[] => {
  if (openIncidents.length < 2) return [];
  const crit = openIncidents.find((i) => i.severity === "crit");
  if (!crit) return [];
  return [
    {
      id: `next_pin_${crit.id}`,
      kind: "pin-and-compare",
      headline: `Compare fleet before "${crit.title}" vs now`,
      detail:
        "Pin the moment the incident opened as A, keep now as B — see what changed.",
      command: `compare ${crit.id}`,
      incidentId: crit.id,
      confidence: 65,
      tone: "brand",
    },
  ];
};

const batchApplyPolicy = (
  context: IntelligenceContext,
  openIncidents: Incident[],
): NextAction[] => {
  const complianceOpen = openIncidents.filter((i) => i.lane === "compliance");
  if (complianceOpen.length < 2) return [];
  return [
    {
      id: `next_batch_${complianceOpen.map((i) => i.id).join("_")}`,
      kind: "batch-apply",
      headline: `Re-apply policy across ${complianceOpen.length} compliance drifts`,
      detail:
        "Multiple compliance incidents. A single policy push could clear them at once.",
      command: "apply all",
      confidence: 74,
      tone: "brand",
    },
  ];
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Produce up to `limit` next-best-action suggestions given fleet state,
 * discovered clusters, and recent command receipts. Ordered by confidence.
 */
export const suggestNextActions = ({
  context,
  clusters,
  receipts,
  limit = 3,
}: {
  context: IntelligenceContext;
  clusters: IncidentCluster[];
  receipts: CommandReceipt[];
  limit?: number;
}): NextAction[] => {
  const openIncidents = context.db.incidents.filter((incident) =>
    context.state.openIncidentIds.includes(incident.id),
  );

  const suggestions: NextAction[] = [
    ...investigateHotspot(context, clusters),
    ...verifyRecentFix(receipts),
    ...retryFailed(receipts),
    ...escalateAging(context, openIncidents),
    ...batchApplyPolicy(context, openIncidents),
    ...pinAndCompare(context, openIncidents),
  ];

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
};
