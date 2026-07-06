import { DEFAULT_FAKE_DB_SEED } from "../constants/fake-db.constants";
import type { FakeDb } from "../types/fake-db.types";
import { createSeededRng } from "../utils/seeded-rng";
import { baseTimestampIso } from "../utils/timestamp.utils";
import { generateAutomations } from "./automation.generator";
import { generateCommands } from "./command.generator";
import { generateDevices } from "./device.generator";
import { generateIncidents } from "./incident.generator";
import { generateOffices } from "./office.generator";
import { generatePolicies } from "./policy.generator";
import { generateTeams } from "./team.generator";
import { generateTimelineEvents } from "./timeline-event.generator";
import { generateUpdates } from "./update.generator";
import { generateUsers } from "./user.generator";

/**
 * Deterministically create the entire Chrono operational universe from a seed.
 * Same seed → exact same universe, always.
 */
export const createFakeDb = (seed: string = DEFAULT_FAKE_DB_SEED): FakeDb => {
  const rng = createSeededRng(seed);

  const offices = generateOffices();
  const teams = generateTeams(offices);
  const users = generateUsers(rng, teams, offices);
  const policies = generatePolicies(rng, users);
  const devices = generateDevices(rng, teams, offices, users, policies);
  const updates = generateUpdates(rng, devices, users);
  const automations = generateAutomations(rng, users);
  const incidents = generateIncidents(
    rng,
    devices,
    users,
    updates,
    policies,
    automations,
  );
  const commands = generateCommands(rng, devices, users);
  const timelineEvents = generateTimelineEvents(
    rng,
    devices,
    incidents,
    updates,
    commands,
    automations,
  );

  return {
    seed: rng.seed,
    generatedAt: baseTimestampIso(),
    offices,
    teams,
    users,
    devices,
    policies,
    updates,
    incidents,
    commands,
    automations,
    timelineEvents,
  };
};
