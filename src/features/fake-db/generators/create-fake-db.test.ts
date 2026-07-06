import { describe, expect, it } from "vitest";
import { createFakeDb } from "./create-fake-db";

describe("createFakeDb", () => {
  it("produces the same universe for the same seed", () => {
    const dbA = createFakeDb("chrono-fixed");
    const dbB = createFakeDb("chrono-fixed");

    expect(dbA).toEqual(dbB);
  });

  it("produces different universes for different seeds", () => {
    const dbA = createFakeDb("chrono-alpha");
    const dbB = createFakeDb("chrono-beta");

    expect(dbA.devices).not.toEqual(dbB.devices);
  });

  it("links devices to real teams, offices, and owners", () => {
    const db = createFakeDb("chrono-links");
    const teamIds = new Set(db.teams.map((t) => t.id));
    const officeIds = new Set(db.offices.map((o) => o.id));
    const userIds = new Set(db.users.map((u) => u.id));

    for (const device of db.devices) {
      expect(teamIds.has(device.teamId)).toBe(true);
      expect(officeIds.has(device.officeId)).toBe(true);
      expect(userIds.has(device.ownerUserId)).toBe(true);
    }
  });

  it("orders timeline events from newest to oldest", () => {
    const db = createFakeDb("chrono-order");
    const timestamps = db.timelineEvents.map((event) => event.timestamp);
    const sorted = [...timestamps].sort((a, b) => b.localeCompare(a));

    expect(timestamps).toEqual(sorted);
  });
});
