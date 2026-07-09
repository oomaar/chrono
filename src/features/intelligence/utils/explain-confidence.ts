import type { Incident } from "@/features/fake-db";
import type {
  ConfidenceBand,
  ConfidenceBreakdown,
  ConfidenceFactor,
} from "../types/intelligence.types";

export const confidenceBand = (score: number): ConfidenceBand => {
  if (score >= 88) return "high";
  if (score >= 68) return "medium";
  return "low";
};

/**
 * Break a recommendation's raw confidence score into the factors that
 * "produced" it. This is a fake-intelligence shim — the incident carries a
 * single confidence number, but we derive four contributing factors so the
 * UI can show a meaningful breakdown instead of a naked percentage.
 */
export const explainRecommendationConfidence = (
  incident: Incident,
): ConfidenceBreakdown => {
  const rec = incident.recommendation;
  const score = rec?.confidence ?? 0;
  const factors: ConfidenceFactor[] = [];

  if (rec) {
    factors.push({
      label: "Pattern match",
      detail: "This regression pattern is well-known for this fleet/model combo.",
      contribution: Math.min(40, Math.round(score * 0.42)),
    });
    factors.push({
      label: "Reversibility",
      detail: rec.reversible
        ? "Fix is reversible — safe to try."
        : "Fix is not reversible.",
      contribution: rec.reversible ? 22 : 6,
    });
    factors.push({
      label: "Signal strength",
      detail:
        incident.affectedDeviceIds.length >= 10
          ? "Clear signal across many devices."
          : "Signal seen on a small number of devices.",
      contribution: Math.min(
        24,
        Math.round(Math.log(1 + incident.affectedDeviceIds.length) * 6),
      ),
    });
    factors.push({
      label: "Owner familiarity",
      detail: "Same team has approved this fix before.",
      contribution: Math.max(4, Math.round(score * 0.14)),
    });
  }

  return {
    score,
    band: confidenceBand(score),
    factors,
  };
};
