// Types
export type {
  AttentionFactor,
  AttentionFactorKey,
  AttentionScore,
  ClusterReason,
  ClusterReasonKey,
  ConfidenceBand,
  ConfidenceBreakdown,
  ConfidenceFactor,
  DecisionItem,
  IncidentCluster,
  IntelligenceContext,
  NextAction,
  NextActionKind,
  SmartSummary,
  SummaryHighlight,
} from "./types/intelligence.types";

// Utils
export {
  computeAttentionScore,
  rankByAttention,
  FACTOR_WEIGHTS,
  SEVERITY_SCORE,
} from "./utils/attention-rank";
export { clusterIncidents, findClusterForIncident } from "./utils/cluster-incidents";
export { buildSmartSummary } from "./utils/build-smart-summary";
export { suggestNextActions } from "./utils/suggest-next-actions";
export {
  confidenceBand,
  explainRecommendationConfidence,
} from "./utils/explain-confidence";

// Hooks
export { useIntelligence } from "./hooks/use-intelligence";

// Components
export { ConfidenceMeter } from "./components/confidence-meter";
export { ClusterBadge } from "./components/cluster-badge";
export { AttentionBar } from "./components/attention-bar";
export { DecisionQueue } from "./components/decision-queue";
export { DecisionQueueItem } from "./components/decision-queue-item";
export { SmartSummaryCard } from "./components/smart-summary-card";
export { NextActionsRail } from "./components/next-actions-rail";
