import { describe, expect, it } from "vitest";
import { createFakeDb, baseTimestampIso } from "@/features/fake-db";
import { computeBlastRadius } from "./blast-radius";
import { dryRunCommand } from "./dry-run";
import { parseCommand } from "./parse";
import { planCommand } from "./plan";

const db = createFakeDb("chrono-blast-test");
const now = baseTimestampIso();

describe("computeBlastRadius + dryRunCommand", () => {
  it("counts affected devices and includes sample hosts", () => {
    const result = planCommand(parseCommand("reboot berlin"), db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const blast = computeBlastRadius(result.plan, db);
    expect(blast.deviceCount).toBe(result.plan.affectedDeviceIds.length);
    expect(blast.sampleDevices.length).toBeGreaterThan(0);
    expect(blast.sampleDevices.length).toBeLessThanOrEqual(6);
    expect(blast.offices.length).toBeGreaterThan(0);
  });

  it("dry-run summary describes the action and reversibility", () => {
    const result = planCommand(parseCommand("isolate finance"), db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const blast = computeBlastRadius(result.plan, db);
    const preview = dryRunCommand(result.plan, db, now, blast);
    expect(preview.summary).toMatch(/quarantine/i);
    expect(preview.reversibility).toBe("reversible");
    expect(preview.effects.length).toBeGreaterThan(0);
  });

  it("future-scheduled commands mention scheduling", () => {
    const result = planCommand(parseCommand("apply hipaa in 60m"), db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const blast = computeBlastRadius(result.plan, db);
    const preview = dryRunCommand(result.plan, db, now, blast);
    expect(preview.summary.toLowerCase()).toContain("scheduled");
  });
});
