import {
  COMMAND_KIND_LABELS,
  COMMAND_KIND_WEIGHTS,
  REVERSIBLE_COMMAND_KINDS,
} from "../constants/command.constants";
import { ENTITY_COUNTS } from "../constants/fake-db.constants";
import type { Command, CommandStatus } from "../types/command.types";
import type { Device } from "../types/device.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

const buildSummary = (kind: Command["kind"], targetLabel: string): string => {
  return `${COMMAND_KIND_LABELS[kind]} on ${targetLabel}`;
};

const pickStatus = (rng: SeededRng, kind: Command["kind"]): CommandStatus => {
  if (kind === "wipe") {
    return rng.bool(0.9) ? "succeeded" : "failed";
  }
  const roll = rng.float();
  if (roll < 0.82) return "succeeded";
  if (roll < 0.9) return "failed";
  if (roll < 0.95) return "running";
  return rng.bool(0.5) ? "queued" : "reverted";
};

export const generateCommands = (
  rng: SeededRng,
  devices: Device[],
  users: User[],
): Command[] => {
  const operators = users.filter(
    (user) =>
      user.role === "operator" || user.role === "engineer" || user.role === "admin",
  );
  const actors = operators.length > 0 ? operators : users;
  const commands: Command[] = [];

  for (let index = 0; index < ENTITY_COUNTS.commands; index += 1) {
    const kindWeighted = rng.pickWeighted(COMMAND_KIND_WEIGHTS);
    const actor = rng.pick(actors);
    const groupTarget = rng.bool(0.35);
    const targets = groupTarget
      ? rng.sample(devices, rng.int(3, 20))
      : rng.sample(devices, 1);
    const targetLabel =
      targets.length === 1 ? targets[0].host : `${targets.length} devices`;

    const status = pickStatus(rng, kindWeighted.kind);
    const executedAt = isoFromOffset(-rng.int(1, 24 * 60));
    const reversible = REVERSIBLE_COMMAND_KINDS.includes(kindWeighted.kind);
    const revertedAt =
      reversible && status === "reverted"
        ? isoFromOffset(-rng.int(0, 12 * 60))
        : undefined;

    const targetGroupTag =
      groupTarget && targets.length > 0 ? targets[0].tags[0] : undefined;

    commands.push({
      id: `command_${index + 1}`,
      kind: kindWeighted.kind,
      actorUserId: actor.id,
      targetDeviceIds: targets.map((device) => device.id),
      targetGroupTag,
      parameters:
        kindWeighted.kind === "deploy-update"
          ? { channel: "stable" }
          : kindWeighted.kind === "collect-diagnostics"
            ? { verbose: rng.bool(0.4) }
            : {},
      status,
      executedAt,
      reversible,
      revertedAt,
      receiptId: rng.id("receipt"),
      summary: buildSummary(kindWeighted.kind, targetLabel),
    });
  }

  return commands;
};
