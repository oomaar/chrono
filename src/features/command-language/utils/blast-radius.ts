import type { FakeDb } from "@/features/fake-db";
import type { BlastRadius, CommandPlan } from "../types/command-language.types";

const uniqueByKey = <T>(items: T[]): T[] => Array.from(new Set(items));

/**
 * Compute the blast radius of a plan: which devices, teams, offices, and
 * policies will be touched if the plan is committed. Used to render a compact
 * preview so operators know what they're about to change.
 */
export const computeBlastRadius = (plan: CommandPlan, db: FakeDb): BlastRadius => {
  const affectedSet = new Set(plan.affectedDeviceIds);
  const affected = db.devices.filter((device) => affectedSet.has(device.id));

  const teamIds = uniqueByKey(affected.map((device) => device.teamId));
  const officeIds = uniqueByKey(affected.map((device) => device.officeId));
  const policies = uniqueByKey(affected.flatMap((device) => device.policyIds));

  const teamNames = teamIds
    .map((id) => db.teams.find((team) => team.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const officeNames = officeIds
    .map((id) => db.offices.find((office) => office.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const policyNames = policies
    .map((id) => db.policies.find((policy) => policy.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    deviceCount: affected.length,
    sampleDevices: affected.slice(0, 6),
    teams: teamNames,
    offices: officeNames,
    policiesTouched: policyNames,
    reversible: plan.reversible,
  };
};
