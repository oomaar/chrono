import {
  BASE_TIMESTAMP_MS,
  COUNTS,
  DEFAULT_FAKE_DB_SEED,
  DEVICE_PREFIXES,
  DEVICE_STATUSES,
  INCIDENT_SEVERITIES,
  OFFICE_BLUEPRINTS,
  TEAM_NAMES,
  USER_FIRST_NAMES,
  USER_LAST_NAMES,
} from "../constants/fake-db.constants";
import type {
  Deployment,
  Device,
  FakeDb,
  Incident,
  Office,
  Team,
  TimelineEvent,
  User,
} from "../types/fake-db.types";
import { createSeededRng } from "../utils/seeded-rng";

const timestampAt = (minutesAgo: number): string => {
  const value = BASE_TIMESTAMP_MS - minutesAgo * 60_000;
  return new Date(value).toISOString();
};

const createTeamId = (index: number): string => `team_${index + 1}`;
const createOfficeId = (index: number): string => `office_${index + 1}`;
const createUserId = (index: number): string => `user_${index + 1}`;
const createDeviceId = (index: number): string => `device_${index + 1}`;
const createDeploymentId = (index: number): string => `deploy_${index + 1}`;
const createIncidentId = (index: number): string => `incident_${index + 1}`;

export const createFakeDb = (seed = DEFAULT_FAKE_DB_SEED): FakeDb => {
  const rng = createSeededRng(seed);

  const teams: Team[] = TEAM_NAMES.map((name, index) => ({
    id: createTeamId(index),
    name,
  }));

  const offices: Office[] = OFFICE_BLUEPRINTS.map((office, index) => ({
    id: createOfficeId(index),
    name: office.name,
    timezone: office.timezone,
  }));

  const users: User[] = Array.from({ length: COUNTS.users }, (_, index) => {
    const firstName = rng.pick(USER_FIRST_NAMES);
    const lastName = rng.pick(USER_LAST_NAMES);
    const team = rng.pick(teams);
    const office = rng.pick(offices);

    return {
      id: createUserId(index),
      name: `${firstName} ${lastName}`,
      teamId: team.id,
      officeId: office.id,
    };
  });

  const devices: Device[] = Array.from({ length: COUNTS.devices }, (_, index) => {
    const team = rng.pick(teams);
    const office = rng.pick(offices);
    const candidates = users.filter((user) => user.teamId === team.id);
    const owner = candidates.length > 0 ? rng.pick(candidates) : rng.pick(users);
    const prefix = rng.pick(DEVICE_PREFIXES);

    return {
      id: createDeviceId(index),
      name: `${prefix}-${rng.int(100, 999)}`,
      teamId: team.id,
      officeId: office.id,
      ownerUserId: owner.id,
      status: rng.pick(DEVICE_STATUSES),
      batteryLevel: rng.int(12, 100),
      cpuLoad: rng.int(4, 97),
      lastSeenAt: timestampAt(rng.int(1, 180)),
    };
  });

  const deployments: Deployment[] = Array.from(
    { length: COUNTS.deployments },
    (_, index) => {
      const team = rng.pick(teams);
      const actorCandidates = users.filter((user) => user.teamId === team.id);
      const actor =
        actorCandidates.length > 0 ? rng.pick(actorCandidates) : rng.pick(users);

      const teamDevices = devices.filter((device) => device.teamId === team.id);
      const affectedCount = Math.min(teamDevices.length, rng.int(6, 18));
      const affected = rng.shuffle(teamDevices).slice(0, affectedCount);
      const startedMinutesAgo = rng.int(30, 1200);
      const durationMinutes = rng.int(8, 55);

      return {
        id: createDeploymentId(index),
        name: `Wave ${index + 1} patch rollout`,
        teamId: team.id,
        initiatedByUserId: actor.id,
        startedAt: timestampAt(startedMinutesAgo),
        finishedAt: timestampAt(startedMinutesAgo - durationMinutes),
        affectedDeviceIds: affected.map((device) => device.id),
      };
    },
  );

  const incidents: Incident[] = Array.from({ length: COUNTS.incidents }, (_, index) => {
    const team = rng.pick(teams);
    const teamUsers = users.filter((user) => user.teamId === team.id);
    const owner = teamUsers.length > 0 ? rng.pick(teamUsers) : rng.pick(users);

    const teamDevices = devices.filter((device) => device.teamId === team.id);
    const impactedCount = Math.max(1, Math.min(teamDevices.length, rng.int(1, 7)));
    const impacted = rng.shuffle(teamDevices).slice(0, impactedCount);

    const openedMinutesAgo = rng.int(45, 1600);
    const durationMinutes = rng.int(12, 120);

    return {
      id: createIncidentId(index),
      title: `${rng.pick(["Kernel panic", "Network partition", "Policy drift", "Update failure"])} on ${impacted[0]?.name ?? "device cluster"}`,
      severity: rng.pick(INCIDENT_SEVERITIES),
      teamId: team.id,
      deviceIds: impacted.map((device) => device.id),
      openedAt: timestampAt(openedMinutesAgo),
      resolvedAt: timestampAt(openedMinutesAgo - durationMinutes),
      primaryOwnerUserId: owner.id,
    };
  });

  const timelineEvents: TimelineEvent[] = [];

  for (const deployment of deployments) {
    timelineEvents.push({
      id: rng.id("evt"),
      type: "deployment-started",
      timestamp: deployment.startedAt,
      teamId: deployment.teamId,
      deploymentId: deployment.id,
      actorUserId: deployment.initiatedByUserId,
      summary: `${deployment.name} started for ${deployment.affectedDeviceIds.length} devices`,
    });

    timelineEvents.push({
      id: rng.id("evt"),
      type: "deployment-completed",
      timestamp: deployment.finishedAt,
      teamId: deployment.teamId,
      deploymentId: deployment.id,
      actorUserId: deployment.initiatedByUserId,
      summary: `${deployment.name} completed`,
    });
  }

  for (const incident of incidents) {
    timelineEvents.push({
      id: rng.id("evt"),
      type: "incident-opened",
      timestamp: incident.openedAt,
      teamId: incident.teamId,
      incidentId: incident.id,
      deviceId: incident.deviceIds[0],
      actorUserId: incident.primaryOwnerUserId,
      summary: `${incident.severity.toUpperCase()} incident opened: ${incident.title}`,
    });

    timelineEvents.push({
      id: rng.id("evt"),
      type: "incident-resolved",
      timestamp: incident.resolvedAt,
      teamId: incident.teamId,
      incidentId: incident.id,
      deviceId: incident.deviceIds[0],
      actorUserId: incident.primaryOwnerUserId,
      summary: `Incident resolved: ${incident.title}`,
    });
  }

  for (let index = 0; index < COUNTS.randomCommands; index += 1) {
    const team = rng.pick(teams);
    const actorCandidates = users.filter((user) => user.teamId === team.id);
    const actor =
      actorCandidates.length > 0 ? rng.pick(actorCandidates) : rng.pick(users);
    const teamDevices = devices.filter((device) => device.teamId === team.id);
    const device = teamDevices.length > 0 ? rng.pick(teamDevices) : rng.pick(devices);

    timelineEvents.push({
      id: rng.id("evt"),
      type: "command-executed",
      timestamp: timestampAt(rng.int(5, 1440)),
      teamId: team.id,
      deviceId: device.id,
      actorUserId: actor.id,
      summary: `${rng.pick(["Reboot device", "Isolate endpoint", "Restart agent", "Collect diagnostics"])} on ${device.name}`,
    });
  }

  timelineEvents.sort((left, right) => {
    return right.timestamp.localeCompare(left.timestamp);
  });

  return {
    seed: rng.seed,
    generatedAt: new Date(BASE_TIMESTAMP_MS).toISOString(),
    teams,
    offices,
    users,
    devices,
    deployments,
    incidents,
    timelineEvents,
  };
};
