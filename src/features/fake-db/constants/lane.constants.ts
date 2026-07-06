import type {
  TimelineEventKind,
  TimelineEventTone,
  TimelineLane,
} from "../types/timeline-event.types";

export const TIMELINE_LANES: TimelineLane[] = [
  "security",
  "connectivity",
  "updates",
  "automation",
  "compliance",
  "fleet",
];

export const TIMELINE_LANE_LABELS: Record<TimelineLane, string> = {
  security: "Security",
  connectivity: "Connectivity",
  updates: "Updates",
  automation: "Automation",
  compliance: "Compliance",
  fleet: "Fleet",
};

export const TIMELINE_EVENT_KIND_TONE: Record<TimelineEventKind, TimelineEventTone> = {
  "incident-opened": "crit",
  "incident-resolved": "ok",
  "incident-mitigated": "warn",
  "command-executed": "brand",
  "command-reverted": "warn",
  "update-started": "brand",
  "update-progressed": "brand",
  "update-completed": "ok",
  "update-failed": "crit",
  "policy-applied": "ok",
  "policy-drifted": "warn",
  "device-enrolled": "brand",
  "device-online": "ok",
  "device-offline": "warn",
  "automation-fired": "brand",
  "automation-scheduled": "neutral",
};

export const TIMELINE_EVENT_KIND_LABELS: Record<TimelineEventKind, string> = {
  "incident-opened": "Incident opened",
  "incident-resolved": "Incident resolved",
  "incident-mitigated": "Incident mitigated",
  "command-executed": "Command executed",
  "command-reverted": "Command reverted",
  "update-started": "Update started",
  "update-progressed": "Update progressed",
  "update-completed": "Update completed",
  "update-failed": "Update failed",
  "policy-applied": "Policy applied",
  "policy-drifted": "Policy drifted",
  "device-enrolled": "Device enrolled",
  "device-online": "Device online",
  "device-offline": "Device offline",
  "automation-fired": "Automation fired",
  "automation-scheduled": "Automation scheduled",
};
