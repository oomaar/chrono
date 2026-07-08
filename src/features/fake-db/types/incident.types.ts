import type { TimelineLane } from "./timeline-event.types";

export type IncidentSeverity = "crit" | "high" | "medium" | "low";

export type IncidentStatus = "open" | "investigating" | "mitigated" | "resolved";

export type IncidentChainTone = "ok" | "warn" | "crit" | "brand" | "neutral";

export type IncidentChainStep = {
  label: string;
  text: string;
  tone: IncidentChainTone;
  linkedEventId?: string;
};

export type IncidentRecommendation = {
  title: string;
  detail: string;
  confidence: number;
  reversible: boolean;
  /** Optional canonical command to feed the composer when the user approves. */
  command?: string;
};

export type Incident = {
  id: string;
  title: string;
  detail: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  lane: TimelineLane;
  openedAt: string;
  resolvedAt?: string;
  primaryOwnerUserId: string;
  affectedDeviceIds: string[];
  chain: IncidentChainStep[];
  recommendation?: IncidentRecommendation;
  relatedUpdateId?: string;
  relatedPolicyId?: string;
  relatedAutomationId?: string;
};
