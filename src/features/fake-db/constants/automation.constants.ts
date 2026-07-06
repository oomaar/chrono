import type {
  Automation,
  AutomationActionKind,
  AutomationTrigger,
} from "../types/automation.types";

export type AutomationBlueprint = Pick<
  Automation,
  "name" | "trigger" | "condition" | "action" | "status" | "scope"
> & {
  /** Minutes since last firing (negative = never fired yet). */
  lastFiredMinutesAgo?: number;
  /** Minutes until next scheduled run (negative = past due). */
  nextScheduledInMinutes?: number;
  runCount: number;
};

export const AUTOMATION_BLUEPRINTS: AutomationBlueprint[] = [
  {
    name: "Isolate on outbound anomaly",
    trigger: "on-metric-threshold",
    condition: "outbound connections to unrecognized host > baseline * 4",
    action: "isolate",
    status: "active",
    scope: { tags: [] },
    lastFiredMinutesAgo: 15,
    runCount: 41,
  },
  {
    name: "Re-apply FileVault on drift",
    trigger: "on-compliance-drift",
    condition: "FileVault escrow reports unmanaged for > 15 min",
    action: "reapply-policy",
    status: "active",
    scope: { tags: ["finance", "hipaa", "sox"] },
    lastFiredMinutesAgo: 60 * 8,
    runCount: 12,
  },
  {
    name: "Escalate crit incidents to on-call",
    trigger: "on-incident-severity",
    condition: "severity == crit and open for > 3 min",
    action: "escalate",
    status: "active",
    scope: { tags: [] },
    lastFiredMinutesAgo: 60 * 2,
    runCount: 6,
  },
  {
    name: "Notify on offline > 1h",
    trigger: "on-device-status",
    condition: "device status == offline for > 60 min",
    action: "notify",
    status: "active",
    scope: { tags: ["executive"] },
    lastFiredMinutesAgo: 60 * 5,
    runCount: 84,
  },
  {
    name: "Nightly compliance sweep",
    trigger: "on-schedule",
    condition: "daily at 02:00 UTC",
    action: "reapply-policy",
    status: "active",
    scope: { tags: [] },
    lastFiredMinutesAgo: 60 * 10,
    nextScheduledInMinutes: 60 * 14,
    runCount: 421,
  },
  {
    name: "Rotate service credentials weekly",
    trigger: "on-schedule",
    condition: "weekly on Sunday 03:00 UTC",
    action: "rotate-credentials",
    status: "active",
    scope: { tags: ["executive", "engineering"] },
    lastFiredMinutesAgo: 60 * 60,
    nextScheduledInMinutes: 60 * 108,
    runCount: 58,
  },
  {
    name: "Escalate on backup failure",
    trigger: "on-incident-severity",
    condition: "backup verification fails on > 2 devices",
    action: "escalate",
    status: "active",
    scope: { tags: ["finance"] },
    lastFiredMinutesAgo: 60 * 8,
    runCount: 4,
  },
  {
    name: "Deploy AV refresh on stale defs",
    trigger: "on-compliance-drift",
    condition: "AV definitions age > 48h",
    action: "deploy-update",
    status: "paused",
    scope: { tags: ["remote"] },
    lastFiredMinutesAgo: 60 * 30,
    runCount: 19,
  },
  {
    name: "Notify Berlin on connectivity dip",
    trigger: "on-device-status",
    condition: "office=berlin and offline_count > 5",
    action: "notify",
    status: "active",
    scope: { tags: [] },
    lastFiredMinutesAgo: 60 * 6,
    runCount: 3,
  },
  {
    name: "Draft: escalate on wipe requested",
    trigger: "on-device-status",
    condition: "wipe command queued",
    action: "escalate",
    status: "draft",
    scope: { tags: [] },
    runCount: 0,
  },
];

export const AUTOMATION_TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  "on-schedule": "On schedule",
  "on-metric-threshold": "On metric threshold",
  "on-incident-severity": "On incident severity",
  "on-device-status": "On device status",
  "on-compliance-drift": "On compliance drift",
};

export const AUTOMATION_ACTION_LABELS: Record<AutomationActionKind, string> = {
  isolate: "Isolate device",
  "reapply-policy": "Re-apply policy",
  notify: "Notify owner / on-call",
  escalate: "Escalate to on-call",
  "deploy-update": "Deploy update",
  "rotate-credentials": "Rotate credentials",
};
