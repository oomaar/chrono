import { TEAM_BLUEPRINTS } from "../constants/user.constants";
import type { Office } from "../types/office.types";
import type { Team } from "../types/team.types";

export const generateTeams = (offices: Office[]): Team[] => {
  const officeBySlug = new Map(
    offices.map((office) => [office.id.replace(/^office_/, ""), office]),
  );

  return TEAM_BLUEPRINTS.map((blueprint) => {
    const office = officeBySlug.get(blueprint.office) ?? offices[0];
    return {
      id: `team_${blueprint.slug}`,
      name: blueprint.name,
      slug: blueprint.slug,
      primaryOfficeId: office.id,
    };
  });
};
