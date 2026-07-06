import type { DeviceModel, DeviceStatus, OsChannel } from "../types/device.types";

export const DEVICE_MODELS: DeviceModel[] = [
  { name: 'MBP 14" M3', category: "laptop" },
  { name: 'MBP 16" M3', category: "laptop" },
  { name: 'MBA 13" M2', category: "laptop" },
  { name: 'iMac 24" M3', category: "desktop" },
  { name: "Mac mini M2", category: "desktop" },
  { name: "Mac Studio M2 Max", category: "server" },
  { name: "iPad Pro 12.9", category: "mobile" },
];

export const DEVICE_HOST_PREFIXES = [
  "atlas",
  "aurora",
  "ember",
  "solace",
  "vector",
  "prism",
  "terra",
  "nova",
  "flint",
  "haven",
  "lyra",
  "orion",
] as const;

/**
 * Weighted status distribution — most devices healthy, small tail of issues.
 */
export const DEVICE_STATUS_WEIGHTS: Array<{
  status: DeviceStatus;
  weight: number;
}> = [
  { status: "online", weight: 78 },
  { status: "degraded", weight: 10 },
  { status: "offline", weight: 5 },
  { status: "non-compliant", weight: 4 },
  { status: "isolated", weight: 1 },
  { status: "maintenance", weight: 2 },
];

export const OS_VERSIONS = ["14.0", "14.1", "14.2"] as const;

export const OS_CHANNEL_WEIGHTS: Array<{
  channel: OsChannel;
  weight: number;
}> = [
  { channel: "stable", weight: 85 },
  { channel: "beta", weight: 12 },
  { channel: "canary", weight: 3 },
];

export const DEVICE_TAG_POOL = [
  "finance",
  "sales",
  "engineering",
  "design",
  "executive",
  "field",
  "hipaa",
  "sox",
  "pci",
  "remote",
  "shared",
  "loaner",
] as const;
