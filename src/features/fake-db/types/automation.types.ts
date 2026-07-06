export type AutomationTrigger =
  | "on-schedule"
  | "on-metric-threshold"
  | "on-incident-severity"
  | "on-device-status"
  | "on-compliance-drift";

export type AutomationActionKind =
  | "isolate"
  | "reapply-policy"
  | "notify"
  | "escalate"
  | "deploy-update"
  | "rotate-credentials";

export type AutomationStatus = "active" | "paused" | "draft";

export type AutomationScope = {
  tags: string[];
  officeIds?: string[];
  policyIds?: string[];
};

export type Automation = {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  condition: string;
  action: AutomationActionKind;
  status: AutomationStatus;
  createdByUserId: string;
  createdAt: string;
  lastFiredAt?: string;
  nextScheduledAt?: string;
  runCount: number;
  scope: AutomationScope;
};
