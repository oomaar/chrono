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
    expect(dbA.incidents).not.toEqual(dbB.incidents);
  });

  it("populates every top-level collection", () => {
    const db = createFakeDb("chrono-links");
    expect(db.offices.length).toBeGreaterThan(0);
    expect(db.teams.length).toBeGreaterThan(0);
    expect(db.users.length).toBeGreaterThan(0);
    expect(db.devices.length).toBeGreaterThan(0);
    expect(db.policies.length).toBeGreaterThan(0);
    expect(db.updates.length).toBeGreaterThan(0);
    expect(db.incidents.length).toBeGreaterThan(0);
    expect(db.commands.length).toBeGreaterThan(0);
    expect(db.automations.length).toBeGreaterThan(0);
    expect(db.timelineEvents.length).toBeGreaterThan(0);
  });

  it("keeps referential integrity across devices/users/teams/offices", () => {
    const db = createFakeDb("chrono-integrity");
    const teamIds = new Set(db.teams.map((team) => team.id));
    const officeIds = new Set(db.offices.map((office) => office.id));
    const userIds = new Set(db.users.map((user) => user.id));
    const policyIds = new Set(db.policies.map((policy) => policy.id));

    for (const device of db.devices) {
      expect(teamIds.has(device.teamId)).toBe(true);
      expect(officeIds.has(device.officeId)).toBe(true);
      expect(userIds.has(device.ownerUserId)).toBe(true);
      for (const policyId of device.policyIds) {
        expect(policyIds.has(policyId)).toBe(true);
      }
    }
  });

  it("links incidents to devices and users that actually exist", () => {
    const db = createFakeDb("chrono-incidents");
    const deviceIds = new Set(db.devices.map((device) => device.id));
    const userIds = new Set(db.users.map((user) => user.id));

    for (const incident of db.incidents) {
      expect(userIds.has(incident.primaryOwnerUserId)).toBe(true);
      for (const deviceId of incident.affectedDeviceIds) {
        expect(deviceIds.has(deviceId)).toBe(true);
      }
    }
  });

  it("orders timeline events newest → oldest", () => {
    const db = createFakeDb("chrono-order");
    for (let index = 1; index < db.timelineEvents.length; index += 1) {
      expect(
        db.timelineEvents[index - 1].timestamp >= db.timelineEvents[index].timestamp,
      ).toBe(true);
    }
  });

  it("marks future timeline events as future", () => {
    const db = createFakeDb("chrono-future");
    const futureEvents = db.timelineEvents.filter((event) => event.future);
    expect(futureEvents.length).toBeGreaterThan(0);
    for (const event of futureEvents) {
      expect(new Date(event.timestamp).getTime()).toBeGreaterThan(
        new Date(db.generatedAt).getTime(),
      );
    }
  });
});
