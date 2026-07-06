export type OfficeRegion = "americas" | "emea" | "apac";

export type Office = {
  id: string;
  name: string;
  city: string;
  region: OfficeRegion;
  timezone: string;
  deviceCapacity: number;
};
