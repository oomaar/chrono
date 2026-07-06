export type DeviceStatus = "healthy" | "degraded" | "offline" | "maintenance";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export type TimelineEventType =
  | "incident-opened"
  | "incident-resolved"
  | "deployment-started"
  | "deployment-completed"
  | "command-executed";

export type Team = {
  id: string;
  name: string;
};

export type Office = {
  id: string;
  name: string;
  timezone: string;
};

export type User = {
  id: string;
  name: string;
  teamId: string;
  officeId: string;
};

export type Device = {
  id: string;
  name: string;
  teamId: string;
  officeId: string;
  ownerUserId: string;
  status: DeviceStatus;
  batteryLevel: number;
  cpuLoad: number;
  lastSeenAt: string;
};

export type Deployment = {
  id: string;
  name: string;
  teamId: string;
  initiatedByUserId: string;
  startedAt: string;
  finishedAt: string;
  affectedDeviceIds: string[];
};

export type Incident = {
  id: string;
  title: string;
  severity: IncidentSeverity;
  teamId: string;
  deviceIds: string[];
  openedAt: string;
  resolvedAt: string;
  primaryOwnerUserId: string;
};

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  teamId: string;
  deviceId?: string;
  incidentId?: string;
  deploymentId?: string;
  actorUserId?: string;
  summary: string;
};

export type FakeDb = {
  seed: string;
  generatedAt: string;
  teams: Team[];
  offices: Office[];
  users: User[];
  devices: Device[];
  deployments: Deployment[];
  incidents: Incident[];
  timelineEvents: TimelineEvent[];
};
