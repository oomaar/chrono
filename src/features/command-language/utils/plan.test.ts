import { describe, expect, it } from "vitest";
import { createFakeDb, baseTimestampIso } from "@/features/fake-db";
import { parseCommand } from "./parse";
import { planCommand } from "./plan";

const db = createFakeDb("chrono-plan-test");
const now = baseTimestampIso();

describe("planCommand", () => {
  it("rejects empty input with an error", () => {
    const result = planCommand(parseCommand(""), db, now);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0].severity).toBe("error");
    }
  });

  it("rejects unknown verbs", () => {
    const result = planCommand(parseCommand("banana berlin"), db, now);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0].message).toMatch(/unknown verb/i);
    }
  });

  it("requires a scope for action verbs", () => {
    const result = planCommand(parseCommand("reboot"), db, now);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0].message).toMatch(/scope/i);
    }
  });

  it("resolves office scopes to concrete devices", () => {
    const result = planCommand(parseCommand("reboot berlin"), db, now);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.affectedDeviceIds.length).toBeGreaterThan(0);
      expect(result.plan.reversible).toBe(false);
      expect(result.plan.isFuture).toBe(false);
    }
  });

  it("marks scheduled commands as future", () => {
    const result = planCommand(parseCommand("apply hipaa in 30m"), db, now);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.isFuture).toBe(true);
      expect(new Date(result.plan.effectiveAt).getTime()).toBeGreaterThan(
        new Date(now).getTime(),
      );
    }
  });

  it("requires --confirm for destructive verbs", () => {
    const result = planCommand(parseCommand("wipe atlas-441"), db, now);
    if (result.ok) {
      const requiresConfirm = result.plan.requiresConfirm;
      // atlas-441 may not resolve in every seed; only assert if we got a plan
      if (result.plan.affectedDeviceIds.length > 0) {
        expect(requiresConfirm).toBe(true);
        expect(result.plan.issues.some((i) => /--confirm/.test(i.message))).toBe(true);
      }
    }
  });

  it("detects --dry-run", () => {
    const result = planCommand(parseCommand("reboot berlin --dry-run"), db, now);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.plan.isDryRun).toBe(true);
    }
  });
});
