import { COMMAND_KIND_LABELS } from "../constants/command.constants";
import { TIMELINE_EVENT_KIND_TONE } from "../constants/lane.constants";
import type { Automation } from "../types/automation.types";
import type { Command } from "../types/command.types";
import type { Device } from "../types/device.types";
import type { Incident } from "../types/incident.types";
import type {
  TimelineEvent,
  TimelineEventKind,
  TimelineLane,
} from "../types/timeline-event.types";
import type { Update } from "../types/update.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

const laneForCommand = (kind: Command["kind"]): TimelineLane => {
  switch (kind) {
    case "isolate":
    case "release-isolation":
    case "rotate-credentials":
    case "wipe":
      return "security";
    case "deploy-update":
      return "updates";
    case "reapply-policy":
      return "compliance";
    case "collect-diagnostics":
    case "reboot":
    case "restart-agent":
    default:
      return "fleet";
  }
};

const laneForUpdate = (): TimelineLane => "updates";

const laneForAutomation = (action: Automation["action"]): TimelineLane => {
  switch (action) {
    case "isolate":
    case "rotate-credentials":
      return "security";
    case "deploy-update":
      return "updates";
    case "reapply-policy":
      return "compliance";
    case "notify":
    case "escalate":
    default:
      return "automation";
  }
};

const buildEvent = (
  rng: SeededRng,
  fields: Omit<TimelineEvent, "id" | "tone">,
): TimelineEvent => ({
  ...fields,
  id: rng.id("evt"),
  tone: TIMELINE_EVENT_KIND_TONE[fields.kind],
});

export const generateTimelineEvents = (
  rng: SeededRng,
  devices: Device[],
  incidents: Incident[],
  updates: Update[],
  commands: Command[],
  automations: Automation[],
): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const deviceById = new Map(devices.map((device) => [device.id, device]));

  // --- Incidents produce open/mitigate/resolve receipts ---
  for (const incident of incidents) {
    events.push(
      buildEvent(rng, {
        kind: "incident-opened",
        lane: incident.lane,
        timestamp: incident.openedAt,
        summary: `${incident.severity.toUpperCase()} · ${incident.title}`,
        actorUserId: incident.primaryOwnerUserId,
        deviceIds: incident.affectedDeviceIds.slice(0, 3),
        incidentId: incident.id,
        reversible: false,
        future: false,
      }),
    );

    if (incident.status === "mitigated") {
      events.push(
        buildEvent(rng, {
          kind: "incident-mitigated",
          lane: incident.lane,
          timestamp: incident.openedAt,
          summary: `Automation mitigated: ${incident.title}`,
          actorUserId: incident.primaryOwnerUserId,
          deviceIds: incident.affectedDeviceIds.slice(0, 3),
          incidentId: incident.id,
          reversible: false,
          future: false,
        }),
      );
    }

    if (incident.resolvedAt) {
      events.push(
        buildEvent(rng, {
          kind: "incident-resolved",
          lane: incident.lane,
          timestamp: incident.resolvedAt,
          summary: `Resolved: ${incident.title}`,
          actorUserId: incident.primaryOwnerUserId,
          deviceIds: incident.affectedDeviceIds.slice(0, 3),
          incidentId: incident.id,
          reversible: false,
          future: false,
        }),
      );
    }
  }

  // --- Updates emit start / progress / complete|fail ---
  for (const update of updates) {
    const isFuture = update.stage === "queued";
    events.push(
      buildEvent(rng, {
        kind: "update-started",
        lane: laneForUpdate(),
        timestamp: update.startedAt,
        summary: `${update.name} → ${update.targetCount} devices${
          isFuture ? " (scheduled)" : ""
        }`,
        actorUserId: update.initiatedByUserId,
        deviceIds: [],
        updateId: update.id,
        reversible: !isFuture,
        future: isFuture,
      }),
    );

    if (update.stage === "rolling") {
      events.push(
        buildEvent(rng, {
          kind: "update-progressed",
          lane: laneForUpdate(),
          timestamp: update.startedAt,
          summary: `${update.name} · ${update.progress}% · ${update.completedCount}/${update.targetCount}`,
          actorUserId: update.initiatedByUserId,
          deviceIds: [],
          updateId: update.id,
          reversible: false,
          future: false,
        }),
      );
    }

    if (
      (update.stage === "completed" || update.stage === "failed") &&
      update.finishedAt
    ) {
      const failed = update.stage === "failed";
      events.push(
        buildEvent(rng, {
          kind: failed ? "update-failed" : "update-completed",
          lane: laneForUpdate(),
          timestamp: update.finishedAt,
          summary: `${update.name} ${failed ? "failed" : "completed"} · ${update.completedCount}/${update.targetCount}`,
          actorUserId: update.initiatedByUserId,
          deviceIds: [],
          updateId: update.id,
          reversible: !failed,
          future: false,
        }),
      );
    }
  }

  // --- Commands emit execute + optional revert ---
  for (const command of commands) {
    const primaryDevice = deviceById.get(command.targetDeviceIds[0]);
    events.push(
      buildEvent(rng, {
        kind: "command-executed",
        lane: laneForCommand(command.kind),
        timestamp: command.executedAt,
        summary: command.summary,
        actorUserId: command.actorUserId,
        deviceIds: command.targetDeviceIds.slice(0, 3),
        commandId: command.id,
        reversible: command.reversible,
        future: false,
      }),
    );

    if (command.revertedAt) {
      events.push(
        buildEvent(rng, {
          kind: "command-reverted",
          lane: laneForCommand(command.kind),
          timestamp: command.revertedAt,
          summary: `${COMMAND_KIND_LABELS[command.kind]} reverted on ${primaryDevice?.host ?? "device"}`,
          actorUserId: command.actorUserId,
          deviceIds: command.targetDeviceIds.slice(0, 3),
          commandId: command.id,
          reversible: false,
          future: false,
        }),
      );
    }
  }

  // --- Automations that recently fired ---
  for (const automation of automations) {
    if (automation.status !== "active" || !automation.lastFiredAt) continue;
    events.push(
      buildEvent(rng, {
        kind: "automation-fired",
        lane: laneForAutomation(automation.action),
        timestamp: automation.lastFiredAt,
        summary: `${automation.name} fired`,
        actorUserId: automation.createdByUserId,
        deviceIds: [],
        automationId: automation.id,
        reversible: false,
        future: false,
      }),
    );
    if (automation.nextScheduledAt) {
      events.push(
        buildEvent(rng, {
          kind: "automation-scheduled",
          lane: laneForAutomation(automation.action),
          timestamp: automation.nextScheduledAt,
          summary: `${automation.name} scheduled`,
          actorUserId: automation.createdByUserId,
          deviceIds: [],
          automationId: automation.id,
          reversible: false,
          future: true,
        }),
      );
    }
  }

  // --- Ambient fleet events (online/offline flapping, policy drift) ---
  const ambientCount = 60;
  for (let i = 0; i < ambientCount; i += 1) {
    const device = rng.pick(devices);
    const minutesAgo = rng.int(2, 24 * 60);
    const roll = rng.float();
    let kind: TimelineEventKind;
    let lane: TimelineLane;
    let summary: string;

    if (roll < 0.35) {
      kind = "device-offline";
      lane = "connectivity";
      summary = `${device.host} went offline`;
    } else if (roll < 0.75) {
      kind = "device-online";
      lane = "connectivity";
      summary = `${device.host} came back online`;
    } else if (roll < 0.9) {
      kind = "policy-drifted";
      lane = "compliance";
      summary = `${device.host} drifted on ${device.tags[0] ?? "policy"} baseline`;
    } else {
      kind = "policy-applied";
      lane = "compliance";
      summary = `Policy re-applied to ${device.host}`;
    }

    events.push(
      buildEvent(rng, {
        kind,
        lane,
        timestamp: isoFromOffset(-minutesAgo),
        summary,
        deviceIds: [device.id],
        reversible: false,
        future: false,
      }),
    );
  }

  // --- Device enrollment (older, ambient) ---
  const enrollmentSample = rng.sample(devices, 8);
  for (const device of enrollmentSample) {
    events.push(
      buildEvent(rng, {
        kind: "device-enrolled",
        lane: "fleet",
        timestamp: device.enrolledAt,
        summary: `${device.host} enrolled`,
        deviceIds: [device.id],
        reversible: false,
        future: false,
      }),
    );
  }

  events.sort((a, b) =>
    a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0,
  );
  return events;
};
