import type { DeviceStatus, IncidentSeverity } from "../types/fake-db.types";

export const DEFAULT_FAKE_DB_SEED = "chrono-v1";

export const BASE_TIMESTAMP_MS = Date.UTC(2026, 6, 1, 12, 0, 0);

export const TEAM_NAMES = [
  "Endpoint Reliability",
  "Client Platform",
  "Field Operations",
  "Security Response",
] as const;

export const OFFICE_BLUEPRINTS = [
  { name: "New York Operations", timezone: "America/New_York" },
  { name: "Berlin Command", timezone: "Europe/Berlin" },
  { name: "Singapore Fleet", timezone: "Asia/Singapore" },
] as const;

export const USER_FIRST_NAMES = [
  "Avery",
  "Jordan",
  "Noah",
  "Mina",
  "Reese",
  "Kai",
  "Taylor",
  "Cameron",
  "Harper",
  "Quinn",
  "Logan",
  "Riley",
] as const;

export const USER_LAST_NAMES = [
  "Patel",
  "Miller",
  "Nguyen",
  "Ali",
  "Khan",
  "Diaz",
  "Chen",
  "Singh",
  "Silva",
  "Wong",
] as const;

export const DEVICE_PREFIXES = [
  "atlas",
  "aurora",
  "ember",
  "solace",
  "vector",
  "prism",
  "terra",
  "nova",
] as const;

export const DEVICE_STATUSES: DeviceStatus[] = [
  "healthy",
  "degraded",
  "offline",
  "maintenance",
];

export const INCIDENT_SEVERITIES: IncidentSeverity[] = [
  "critical",
  "high",
  "medium",
  "low",
];

export const COUNTS = {
  users: 20,
  devices: 64,
  deployments: 10,
  incidents: 14,
  randomCommands: 20,
} as const;
