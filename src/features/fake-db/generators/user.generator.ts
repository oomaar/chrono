import { ENTITY_COUNTS } from "../constants/fake-db.constants";
import {
  USER_FIRST_NAMES,
  USER_LAST_NAMES,
  USER_ROLE_WEIGHTS,
} from "../constants/user.constants";
import type { Office } from "../types/office.types";
import type { Team } from "../types/team.types";
import type { OnCallStatus, User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";

const buildInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

const buildEmail = (name: string, index: number): string => {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, ".");
  return `${slug}.${index + 1}@chrono.local`;
};

export const generateUsers = (
  rng: SeededRng,
  teams: Team[],
  offices: Office[],
): User[] => {
  const users: User[] = [];

  for (let index = 0; index < ENTITY_COUNTS.users; index += 1) {
    const firstName = rng.pick(USER_FIRST_NAMES);
    const lastName = rng.pick(USER_LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const team = rng.pick(teams);
    const primaryOffice = offices.find((office) => office.id === team.primaryOfficeId);
    // most users at the team's primary office, some scatter
    const office = primaryOffice && rng.bool(0.7) ? primaryOffice : rng.pick(offices);
    const roleWeight = rng.pickWeighted(USER_ROLE_WEIGHTS);
    const onCall: OnCallStatus =
      roleWeight.role === "operator" || roleWeight.role === "engineer"
        ? rng.bool(0.25)
          ? "on-call"
          : "off-duty"
        : "off-duty";

    users.push({
      id: `user_${index + 1}`,
      name,
      initials: buildInitials(name),
      email: buildEmail(`${firstName} ${lastName}`, index),
      role: roleWeight.role,
      teamId: team.id,
      officeId: office.id,
      onCall,
    });
  }

  // Assign managers within teams (admins manage engineers/operators)
  const admins = users.filter((user) => user.role === "admin");
  return users.map((user) => {
    if (user.role === "admin" || admins.length === 0) return user;
    const teamAdmins = admins.filter((admin) => admin.teamId === user.teamId);
    const manager = teamAdmins.length > 0 ? rng.pick(teamAdmins) : rng.pick(admins);
    return { ...user, managerUserId: manager.id };
  });
};
