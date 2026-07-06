import { AUTOMATION_BLUEPRINTS } from "../constants/automation.constants";
import type { Automation } from "../types/automation.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

export const generateAutomations = (rng: SeededRng, users: User[]): Automation[] => {
  const candidates = users.filter(
    (user) =>
      user.role === "admin" || user.role === "engineer" || user.role === "operator",
  );
  const owners = candidates.length > 0 ? candidates : users;

  return AUTOMATION_BLUEPRINTS.map((blueprint, index) => {
    const owner = rng.pick(owners);
    const createdDaysAgo = rng.int(20, 720);

    return {
      id: `automation_${index + 1}`,
      name: blueprint.name,
      trigger: blueprint.trigger,
      condition: blueprint.condition,
      action: blueprint.action,
      status: blueprint.status,
      createdByUserId: owner.id,
      createdAt: isoFromOffset(-createdDaysAgo * 24 * 60),
      lastFiredAt:
        blueprint.lastFiredMinutesAgo === undefined
          ? undefined
          : isoFromOffset(-blueprint.lastFiredMinutesAgo),
      nextScheduledAt:
        blueprint.nextScheduledInMinutes === undefined
          ? undefined
          : isoFromOffset(blueprint.nextScheduledInMinutes),
      runCount: blueprint.runCount,
      scope: {
        tags: [...blueprint.scope.tags],
        officeIds: blueprint.scope.officeIds ? [...blueprint.scope.officeIds] : undefined,
        policyIds: blueprint.scope.policyIds ? [...blueprint.scope.policyIds] : undefined,
      },
    };
  });
};
