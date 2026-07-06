import { INCIDENT_BLUEPRINTS } from "../constants/incident.constants";
import type { Automation } from "../types/automation.types";
import type { Device } from "../types/device.types";
import type { Incident } from "../types/incident.types";
import type { Policy } from "../types/policy.types";
import type { Update } from "../types/update.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

export const generateIncidents = (
  rng: SeededRng,
  devices: Device[],
  users: User[],
  updates: Update[],
  policies: Policy[],
  automations: Automation[],
): Incident[] => {
  const responders = users.filter(
    (user) =>
      user.role === "engineer" || user.role === "admin" || user.role === "operator",
  );
  const owners = responders.length > 0 ? responders : users;

  return INCIDENT_BLUEPRINTS.map((blueprint, index) => {
    // pick affected devices matching any blueprint tag; fall back to random
    const candidates =
      blueprint.affectedTags.length === 0
        ? devices
        : devices.filter((device) =>
            device.tags.some((tag) => blueprint.affectedTags.includes(tag)),
          );
    const pool = candidates.length >= blueprint.affectedCount ? candidates : devices;
    const affected = rng.sample(pool, blueprint.affectedCount);

    const owner = rng.pick(owners);
    const openedAt = isoFromOffset(-blueprint.openedMinutesAgo);
    const resolvedAt =
      blueprint.resolvedAfterMinutes !== undefined
        ? isoFromOffset(-blueprint.openedMinutesAgo + blueprint.resolvedAfterMinutes)
        : undefined;
    const status: Incident["status"] = resolvedAt
      ? "resolved"
      : blueprint.chain.some((step) => step.tone === "brand")
        ? "mitigated"
        : blueprint.chain.length > 1
          ? "investigating"
          : "open";

    // opportunistic relational cross-refs
    const relatedUpdate =
      blueprint.key === "filevault-drift"
        ? updates.find((update) => update.name.includes("14.2 security"))
        : blueprint.key === "canary-panic"
          ? updates.find((update) => update.name.includes("14.3 canary"))
          : undefined;
    const relatedPolicy =
      blueprint.key === "filevault-drift"
        ? policies.find((policy) => policy.name === "FileVault encryption")
        : blueprint.key === "av-stale"
          ? policies.find((policy) => policy.name === "AV definitions fresh")
          : blueprint.key === "backup-fail"
            ? policies.find((policy) => policy.name === "Backup verified daily")
            : undefined;
    const relatedAutomation =
      blueprint.key === "outbound-anomaly"
        ? automations.find((a) => a.name === "Isolate on outbound anomaly")
        : blueprint.key === "filevault-drift"
          ? automations.find((a) => a.name === "Re-apply FileVault on drift")
          : undefined;

    return {
      id: `incident_${index + 1}`,
      title: blueprint.title,
      detail: blueprint.detail,
      severity: blueprint.severity,
      status,
      lane: blueprint.lane,
      openedAt,
      resolvedAt,
      primaryOwnerUserId: owner.id,
      affectedDeviceIds: affected.map((device) => device.id),
      chain: blueprint.chain,
      recommendation: blueprint.recommendation,
      relatedUpdateId: relatedUpdate?.id,
      relatedPolicyId: relatedPolicy?.id,
      relatedAutomationId: relatedAutomation?.id,
    };
  });
};
