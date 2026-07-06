import type { OfficeRegion } from "../types/office.types";

export type OfficeBlueprint = {
  slug: string;
  name: string;
  city: string;
  region: OfficeRegion;
  timezone: string;
  deviceCapacity: number;
};

export const OFFICE_BLUEPRINTS: OfficeBlueprint[] = [
  {
    slug: "nyc",
    name: "New York Operations",
    city: "New York",
    region: "americas",
    timezone: "America/New_York",
    deviceCapacity: 900,
  },
  {
    slug: "london",
    name: "London Fleet",
    city: "London",
    region: "emea",
    timezone: "Europe/London",
    deviceCapacity: 600,
  },
  {
    slug: "berlin",
    name: "Berlin Command",
    city: "Berlin",
    region: "emea",
    timezone: "Europe/Berlin",
    deviceCapacity: 800,
  },
  {
    slug: "singapore",
    name: "Singapore Ops",
    city: "Singapore",
    region: "apac",
    timezone: "Asia/Singapore",
    deviceCapacity: 400,
  },
];
