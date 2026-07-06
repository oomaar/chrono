import type { Automation } from "./automation.types";
import type { Command } from "./command.types";
import type { Device } from "./device.types";
import type { Incident } from "./incident.types";
import type { Office } from "./office.types";
import type { Policy } from "./policy.types";
import type { Team } from "./team.types";
import type { TimelineEvent } from "./timeline-event.types";
import type { Update } from "./update.types";
import type { User } from "./user.types";

export type FakeDb = {
  seed: string;
  generatedAt: string;
  offices: Office[];
  teams: Team[];
  users: User[];
  devices: Device[];
  policies: Policy[];
  updates: Update[];
  incidents: Incident[];
  commands: Command[];
  automations: Automation[];
  timelineEvents: TimelineEvent[];
};
