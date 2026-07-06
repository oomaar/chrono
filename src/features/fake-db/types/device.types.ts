export type DeviceCategory = "laptop" | "desktop" | "server" | "mobile";

export type DeviceStatus =
  "online" | "offline" | "degraded" | "isolated" | "non-compliant" | "maintenance";

export type EncryptionStatus = "on" | "off" | "reverted" | "unknown";

export type OsChannel = "stable" | "beta" | "canary";

export type DeviceModel = {
  name: string;
  category: DeviceCategory;
};

export type Device = {
  id: string;
  host: string;
  serial: string;
  model: DeviceModel;
  os: string;
  osChannel: OsChannel;
  status: DeviceStatus;
  encryption: EncryptionStatus;
  batteryLevel: number;
  cpuLoad: number;
  memoryUsage: number;
  diskUsage: number;
  ownerUserId: string;
  officeId: string;
  teamId: string;
  policyIds: string[];
  tags: string[];
  lastCheckInAt: string;
  enrolledAt: string;
};
