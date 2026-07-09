import type {
  FakeDb,
  Incident,
  IncidentRecommendation,
  Office,
  ReconstructedState,
  Team,
  TimelineEvent,
  TimelineLane,
} from "@/features/fake-db";

// ---------------------------------------------------------------------------
// ATTENTION
// ---------------------------------------------------------------------------

export type AttentionFactorKey =
  | "severity"
  | "recency"
  | "exposure"
  | "blastRadius"
  | "unresolvedTime"
  | "reversibilityBonus";

export type AttentionFactor = {
  key: AttentionFactorKey;
  label: string;
  score: number;
  weight: number;
  detail: string;
};

export type AttentionScore = {
  incidentId: string;
  total: number;
  factors: AttentionFactor[];
};

// ---------------------------------------------------------------------------
// CLUSTERING
// ---------------------------------------------------------------------------

export type ClusterReasonKey =
  "same-lane" | "same-office" | "shared-devices" | "shared-update" | "shared-policy";

export type ClusterReason = {
  key: ClusterReasonKey;
  label: string;
  detail: string;
};

export type IncidentCluster = {
  id: string;
  headline: string;
  incidentIds: string[];
  reasons: ClusterReason[];
  primaryLane: TimelineLane;
  worstSeverity: Incident["severity"];
  affectedDeviceCount: number;
  offices: string[];
};

// ---------------------------------------------------------------------------
// SMART SUMMARY
// ---------------------------------------------------------------------------

export type SummaryHighlight = {
  kicker: string;
  text: string;
  tone: "ok" | "warn" | "crit" | "brand" | "neutral";
};

export type SmartSummary = {
  headline: string;
  windowMinutes: number;
  openIncidentCount: number;
  rollingUpdateCount: number;
  hotspotOffice: string | null;
  trend: "improving" | "steady" | "deteriorating";
  highlights: SummaryHighlight[];
};

// ---------------------------------------------------------------------------
// SUGGESTED NEXT ACTIONS
// ---------------------------------------------------------------------------

export type NextActionKind =
  | "retry-failed"
  | "escalate"
  | "verify-fix"
  | "pin-and-compare"
  | "investigate-hotspot"
  | "batch-apply";

export type NextAction = {
  id: string;
  kind: NextActionKind;
  headline: string;
  detail: string;
  /** Optional canonical command to feed the execute sheet on approval. */
  command?: string;
  /** Optional incident id if the action relates to a specific moment. */
  incidentId?: string;
  /** 0-100. */
  confidence: number;
  tone: "brand" | "warn" | "crit" | "neutral";
};

// ---------------------------------------------------------------------------
// DECISION QUEUE
// ---------------------------------------------------------------------------

export type DecisionItem = {
  incident: Incident;
  attention: AttentionScore;
  recommendation: IncidentRecommendation | null;
  cluster: IncidentCluster | null;
  clusterSiblings: number;
  ageMinutes: number;
};

// ---------------------------------------------------------------------------
// CONFIDENCE
// ---------------------------------------------------------------------------

export type ConfidenceBand = "high" | "medium" | "low";

export type ConfidenceFactor = {
  label: string;
  detail: string;
  contribution: number;
};

export type ConfidenceBreakdown = {
  score: number;
  band: ConfidenceBand;
  factors: ConfidenceFactor[];
};

// ---------------------------------------------------------------------------
// SHARED INPUTS
// ---------------------------------------------------------------------------

export type IntelligenceContext = {
  db: FakeDb;
  state: ReconstructedState;
  events: TimelineEvent[];
  nowIso: string;
};

export type OfficeSummary = Pick<Office, "id" | "name">;
export type TeamSummary = Pick<Team, "id" | "name">;
