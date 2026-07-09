import type { Incident, ReconstructedState } from "@/features/fake-db";
import { differenceInMinutes } from "@/features/fake-db";
import type {
  AttentionFactor,
  AttentionFactorKey,
  AttentionScore,
} from "../types/intelligence.types";

// ---------------------------------------------------------------------------
// Tuning constants — kept as pure exports so tests and UI can display them.
// ---------------------------------------------------------------------------

/** Base severity weights. Together they should feel like ~40% of total. */
const SEVERITY_SCORE: Record<Incident["severity"], number> = {
  crit: 100,
  high: 72,
  medium: 45,
  low: 20,
};

const FACTOR_WEIGHTS: Record<AttentionFactorKey, number> = {
  severity: 0.42,
  recency: 0.14,
  exposure: 0.2,
  blastRadius: 0.12,
  unresolvedTime: 0.08,
  reversibilityBonus: 0.04,
};

// ---------------------------------------------------------------------------
// Component scorers — each returns a 0-100 factor score.
// ---------------------------------------------------------------------------

const severityScore = (incident: Incident): number => SEVERITY_SCORE[incident.severity];

const recencyScore = (incident: Incident, nowIso: string): number => {
  const minutes = Math.max(0, -differenceInMinutes(incident.openedAt, nowIso));
  // fresh events feel urgent; decay over 6h to a floor.
  if (minutes <= 5) return 100;
  if (minutes >= 360) return 20;
  const t = (minutes - 5) / (360 - 5);
  return Math.round(100 - t * 80);
};

const exposureScore = (incident: Incident, state: ReconstructedState): number => {
  const total = Math.max(1, state.fleet.total);
  const ratio = incident.affectedDeviceIds.length / total;
  // A single device on a big fleet still matters — floor at 15, ceiling at 100.
  if (ratio <= 0) return 15;
  if (ratio >= 0.1) return 100;
  return Math.round(15 + (ratio / 0.1) * 85);
};

const blastRadiusScore = (incident: Incident): number => {
  const n = incident.affectedDeviceIds.length;
  if (n <= 0) return 25;
  if (n >= 40) return 100;
  return Math.round(25 + Math.log(1 + n) * 22);
};

const unresolvedTimeScore = (incident: Incident, nowIso: string): number => {
  if (incident.status === "resolved" || incident.status === "mitigated") return 0;
  const minutes = Math.max(0, -differenceInMinutes(incident.openedAt, nowIso));
  // Escalates the longer it sits open. Caps out at 12h.
  if (minutes <= 30) return 20;
  if (minutes >= 720) return 100;
  const t = (minutes - 30) / (720 - 30);
  return Math.round(20 + t * 80);
};

const reversibilityBonusScore = (incident: Incident): number => {
  // If a reversible fix is queued, boost slightly — action is safe to take.
  if (incident.recommendation?.reversible) return 100;
  if (incident.recommendation) return 55;
  return 0;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score how much attention a specific incident deserves right now. The score
 * is a weighted sum of six factors — severity, recency, exposure, blast
 * radius, unresolved time, and reversibility of the queued fix. Deterministic
 * given the same inputs.
 */
export const computeAttentionScore = (
  incident: Incident,
  state: ReconstructedState,
  nowIso: string,
): AttentionScore => {
  const factors: AttentionFactor[] = [
    {
      key: "severity",
      label: "Severity",
      score: severityScore(incident),
      weight: FACTOR_WEIGHTS.severity,
      detail: `${incident.severity} incident`,
    },
    {
      key: "recency",
      label: "Recency",
      score: recencyScore(incident, nowIso),
      weight: FACTOR_WEIGHTS.recency,
      detail: "Opened recently — signal is fresh",
    },
    {
      key: "exposure",
      label: "Exposure",
      score: exposureScore(incident, state),
      weight: FACTOR_WEIGHTS.exposure,
      detail: `${incident.affectedDeviceIds.length} of ${state.fleet.total} devices`,
    },
    {
      key: "blastRadius",
      label: "Blast radius",
      score: blastRadiusScore(incident),
      weight: FACTOR_WEIGHTS.blastRadius,
      detail: `${incident.affectedDeviceIds.length} device${
        incident.affectedDeviceIds.length === 1 ? "" : "s"
      } affected`,
    },
    {
      key: "unresolvedTime",
      label: "Age",
      score: unresolvedTimeScore(incident, nowIso),
      weight: FACTOR_WEIGHTS.unresolvedTime,
      detail: "Time since opened",
    },
    {
      key: "reversibilityBonus",
      label: "Actionable fix",
      score: reversibilityBonusScore(incident),
      weight: FACTOR_WEIGHTS.reversibilityBonus,
      detail: incident.recommendation
        ? incident.recommendation.reversible
          ? "Reversible fix is ready"
          : "Fix ready — not reversible"
        : "No recommended fix",
    },
  ];

  const total = factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0);

  return {
    incidentId: incident.id,
    total: Math.round(total),
    factors,
  };
};

/**
 * Rank a collection of incidents by attention score, highest first.
 * Returns the incidents paired with their attention scores.
 */
export const rankByAttention = (
  incidents: Incident[],
  state: ReconstructedState,
  nowIso: string,
): Array<{ incident: Incident; attention: AttentionScore }> => {
  return incidents
    .map((incident) => ({
      incident,
      attention: computeAttentionScore(incident, state, nowIso),
    }))
    .sort((a, b) => b.attention.total - a.attention.total);
};

export { FACTOR_WEIGHTS, SEVERITY_SCORE };
