import {
  DEVICE_HOST_PREFIXES,
  DEVICE_MODELS,
  DEVICE_STATUS_WEIGHTS,
  DEVICE_TAG_POOL,
  OS_CHANNEL_WEIGHTS,
  OS_VERSIONS,
} from "../constants/device.constants";
import { ENTITY_COUNTS } from "../constants/fake-db.constants";
import type { Device, DeviceStatus, EncryptionStatus } from "../types/device.types";
import type { Office } from "../types/office.types";
import type { Policy } from "../types/policy.types";
import type { Team } from "../types/team.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

const buildSerial = (rng: SeededRng): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 10 }, () => chars[rng.int(0, chars.length - 1)]).join("");
};

const chooseTagsForDevice = (rng: SeededRng, team: Team, office: Office): string[] => {
  const tags = new Set<string>();
  if (team.slug === "compliance" || team.slug === "security") {
    tags.add("sox");
    if (rng.bool(0.7)) tags.add("hipaa");
  }
  if (team.slug === "field") {
    tags.add("field");
    tags.add("remote");
  }
  if (team.slug === "platform" || team.slug === "endpoint") {
    if (rng.bool(0.4)) tags.add("engineering");
  }

  if (office.region === "americas" && rng.bool(0.35)) tags.add("finance");
  if (rng.bool(0.15)) tags.add("executive");
  if (rng.bool(0.08)) tags.add("loaner");
  if (rng.bool(0.15)) tags.add("remote");

  // spread of misc pool tags
  if (rng.bool(0.2)) tags.add(rng.pick(DEVICE_TAG_POOL));
  return Array.from(tags);
};

const encryptionForStatus = (
  rng: SeededRng,
  status: DeviceStatus,
  tags: string[],
): EncryptionStatus => {
  const sensitive = tags.some((tag) => ["finance", "hipaa", "sox", "pci"].includes(tag));
  if (status === "non-compliant" && sensitive) return "reverted";
  if (status === "offline" || status === "isolated") return "unknown";
  return sensitive ? (rng.bool(0.02) ? "reverted" : "on") : rng.bool(0.98) ? "on" : "off";
};

export const generateDevices = (
  rng: SeededRng,
  teams: Team[],
  offices: Office[],
  users: User[],
  policies: Policy[],
): Device[] => {
  const devices: Device[] = [];

  for (let index = 0; index < ENTITY_COUNTS.devices; index += 1) {
    const team = rng.pick(teams);
    const office = rng.pick(offices);
    const teamMembers = users.filter((user) => user.teamId === team.id);
    const owner = teamMembers.length > 0 ? rng.pick(teamMembers) : rng.pick(users);
    const statusWeighted = rng.pickWeighted(DEVICE_STATUS_WEIGHTS);
    const channelWeighted = rng.pickWeighted(OS_CHANNEL_WEIGHTS);
    const model = rng.pick(DEVICE_MODELS);
    const tags = chooseTagsForDevice(rng, team, office);
    const encryption = encryptionForStatus(rng, statusWeighted.status, tags);

    // match policies applying to any of the device's tags
    const applicablePolicies = policies.filter(
      (policy) =>
        policy.appliesToTags.length === 0 ||
        policy.appliesToTags.some((tag) => tags.includes(tag)),
    );

    const lastCheckInMinutesAgo =
      statusWeighted.status === "offline"
        ? rng.int(60 * 4, 60 * 20)
        : statusWeighted.status === "isolated"
          ? rng.int(5, 60)
          : rng.int(1, 45);

    const enrolledDaysAgo = rng.int(30, 720);
    const os = rng.pick(OS_VERSIONS);
    const hostPrefix = rng.pick(DEVICE_HOST_PREFIXES);

    devices.push({
      id: `device_${index + 1}`,
      host: `${hostPrefix}-${String(rng.int(100, 9999)).padStart(4, "0")}`,
      serial: buildSerial(rng),
      model,
      os,
      osChannel: channelWeighted.channel,
      status: statusWeighted.status,
      encryption,
      batteryLevel:
        model.category === "laptop" || model.category === "mobile"
          ? rng.int(18, 100)
          : 100,
      cpuLoad: statusWeighted.status === "degraded" ? rng.int(70, 96) : rng.int(4, 55),
      memoryUsage:
        statusWeighted.status === "degraded" ? rng.int(72, 94) : rng.int(30, 78),
      diskUsage: rng.int(28, 92),
      ownerUserId: owner.id,
      officeId: office.id,
      teamId: team.id,
      policyIds: applicablePolicies.map((policy) => policy.id),
      tags,
      lastCheckInAt: isoFromOffset(-lastCheckInMinutesAgo),
      enrolledAt: isoFromOffset(-enrolledDaysAgo * 24 * 60),
    });
  }

  return devices;
};
