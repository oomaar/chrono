import { UPDATE_BLUEPRINTS } from "../constants/update.constants";
import type { Device } from "../types/device.types";
import type { Update } from "../types/update.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

export const generateUpdates = (
  rng: SeededRng,
  devices: Device[],
  users: User[],
): Update[] => {
  const engineers = users.filter(
    (user) => user.role === "engineer" || user.role === "admin",
  );
  const actors = engineers.length > 0 ? engineers : users;

  return UPDATE_BLUEPRINTS.map((blueprint, index) => {
    const initiator = rng.pick(actors);
    const scopedDevices =
      blueprint.affectedTags.length === 0
        ? devices
        : devices.filter((device) =>
            device.tags.some((tag) => blueprint.affectedTags.includes(tag)),
          );

    const target = Math.max(1, Math.floor(scopedDevices.length * blueprint.targetPct));

    const isFuture = blueprint.startMinutesAgo < 0;
    const startedAt = isoFromOffset(-blueprint.startMinutesAgo);
    const completed = Math.floor(target * blueprint.successPct);
    const failed = Math.floor(target * blueprint.failurePct);
    const inFlight = Math.max(0, target - completed - failed);

    let stage: Update["stage"];
    let progress: number;
    let finishedAt: string | undefined;

    if (isFuture) {
      stage = "queued";
      progress = 0;
    } else if (inFlight === 0 && completed + failed === target) {
      stage = failed > 0 && completed === 0 ? "failed" : "completed";
      progress = 100;
      finishedAt = isoFromOffset(
        -Math.max(0, blueprint.startMinutesAgo - rng.int(15, 90)),
      );
    } else if (inFlight > 0) {
      stage = "rolling";
      progress = Math.round(((completed + failed) / target) * 100);
    } else {
      stage = "paused";
      progress = Math.round((completed / target) * 100);
    }

    return {
      id: `update_${index + 1}`,
      name: blueprint.name,
      kind: blueprint.kind,
      channel: blueprint.channel,
      fromVersion: blueprint.fromVersion,
      toVersion: blueprint.toVersion,
      stage,
      progress,
      targetCount: target,
      completedCount: completed,
      failedCount: failed,
      startedAt,
      finishedAt,
      initiatedByUserId: initiator.id,
      affectedTags: [...blueprint.affectedTags],
    };
  });
};
