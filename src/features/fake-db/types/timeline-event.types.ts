export type TimelineLane =
  "security" | "connectivity" | "updates" | "automation" | "compliance" | "fleet";

export type TimelineEventTone = "ok" | "warn" | "crit" | "brand" | "neutral";

export type TimelineEventKind =
  | "incident-opened"
  | "incident-resolved"
  | "incident-mitigated"
  | "command-executed"
  | "command-reverted"
  | "update-started"
  | "update-progressed"
  | "update-completed"
  | "update-failed"
  | "policy-applied"
  | "policy-drifted"
  | "device-enrolled"
  | "device-online"
  | "device-offline"
  | "automation-fired"
  | "automation-scheduled";

export type TimelineEvent = {
  id: string;
  kind: TimelineEventKind;
  lane: TimelineLane;
  tone: TimelineEventTone;
  timestamp: string;
  summary: string;
  actorUserId?: string;
  deviceIds: string[];
  incidentId?: string;
  updateId?: string;
  commandId?: string;
  policyId?: string;
  automationId?: string;
  reversible: boolean;
  future: boolean;
};
