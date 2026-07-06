import { OFFICE_BLUEPRINTS } from "../constants/office.constants";
import type { Office } from "../types/office.types";

export const generateOffices = (): Office[] =>
  OFFICE_BLUEPRINTS.map((blueprint) => ({
    id: `office_${blueprint.slug}`,
    name: blueprint.name,
    city: blueprint.city,
    region: blueprint.region,
    timezone: blueprint.timezone,
    deviceCapacity: blueprint.deviceCapacity,
  }));
