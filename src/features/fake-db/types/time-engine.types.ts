import type {
  TimelineEvent,
  TimelineEventKind,
  TimelineLane,
} from "./timeline-event.types";

export type TimeWindow = {
  start: string;
  end: string;
  durationMinutes: number;
};

export type FleetSnapshot = {
  total: number;
  online: number;
  offline: number;
  degraded: number;
  isolated: number;
  nonCompliant: number;
  maintenance: number;
};

export type ReconstructedIncident = {
  incidentId: string;
  title: string;
  severity: string;
  status: "open" | "resolved-in-window";
  openedAt: string;
  resolvedAt?: string;
};

export type ReconstructedUpdate = {
  updateId: string;
  name: string;
  stage: string;
  progress: number;
};

export type ReconstructedState = {
  atTimestamp: string;
  fleet: FleetSnapshot;
  openIncidentIds: string[];
  rollingUpdateIds: string[];
  activeAutomationIds: string[];
};

export type RibbonBucket = {
  index: number;
  timestamp: string;
  eventCount: number;
  criticalCount: number;
  warnCount: number;
  okCount: number;
  intensity: number;
};

export type LaneActivity = {
  lane: TimelineLane;
  eventCount: number;
  latestEvent?: TimelineEvent;
  toneDistribution: Record<TimelineEventKind, number>;
};

export type TimeEngine = {
  now: () => string;
  reconstructAt: (timestamp: string) => ReconstructedState;
  eventsInWindow: (window: TimeWindow) => TimelineEvent[];
  eventsInLane: (window: TimeWindow, lane: TimelineLane) => TimelineEvent[];
  ribbonBuckets: (window: TimeWindow, bucketCount?: number) => RibbonBucket[];
  nearestEvent: (timestamp: string, thresholdMinutes?: number) => TimelineEvent | null;
  createWindow: (endTimestamp: string, durationMinutes: number) => TimeWindow;
  offsetTimestamp: (timestamp: string, minutes: number) => string;
};
