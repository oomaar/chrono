import { describe, expect, it } from "vitest";
import { baseTimestampIso, createFakeDb } from "@/features/fake-db";
import { parseCommand } from "./parse";
import { planCommand } from "./plan";

const db = createFakeDb("chrono-language-test");
const now = baseTimestampIso();

describe("parser + plan: entity references", () => {
  it("recognizes incident_N as an entity scope", () => {
    const intent = parseCommand("investigate incident_3");
    expect(intent.scopes[0].definition.kind).toBe("entity");
    expect(intent.scopes[0].definition.entity).toEqual({
      kind: "incident",
      id: "incident_3",
    });
  });

  it("investigate resolves an incident to a scrub-to timelineAction", () => {
    const intent = parseCommand("investigate incident_1");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.timelineAction?.kind).toBe("scrub-to");
    const target = db.incidents.find((i) => i.id === "incident_1");
    expect(
      result.plan.timelineAction?.kind === "scrub-to" &&
        result.plan.timelineAction.targetIso,
    ).toBe(target?.openedAt);
  });

  it("investigate with a keyword fuzzy-matches an incident title", () => {
    // Pick a word that appears in an incident title but is NOT a known scope
    // (so it lands in unknownTokens and triggers the fuzzy branch).
    const intent = parseCommand("investigate encryption");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.timelineAction?.kind).toBe("scrub-to");
  });

  it("compare needs two entity references", () => {
    const oneEntity = planCommand(parseCommand("compare incident_1"), db, now);
    expect(oneEntity.ok).toBe(false);
    if (!oneEntity.ok) {
      expect(oneEntity.issues[0].message).toMatch(/two/i);
    }
  });

  it("compare pins two entities and jumps to A", () => {
    const intent = parseCommand("compare incident_1 incident_2");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.timelineAction?.kind).toBe("pin-compare");
    if (result.plan.timelineAction?.kind !== "pin-compare") return;
    expect(result.plan.timelineAction.entityIds).toHaveLength(2);
  });

  it("explain resolves an entity to an explain timelineAction", () => {
    const intent = parseCommand("explain incident_1");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.timelineAction?.kind).toBe("explain");
  });
});

describe("parser + plan: provider verbs", () => {
  it("undo without scope creates a providerAction with no target", () => {
    const intent = parseCommand("undo");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.providerAction?.kind).toBe("undo");
    expect(result.plan.providerAction?.targetReceiptId).toBeUndefined();
  });

  it("undo with a receipt id targets it explicitly", () => {
    const intent = parseCommand("undo receipt_abc123");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.providerAction?.targetReceiptId).toBe("receipt_abc123");
  });

  it("retry is a provider verb with no scope requirement", () => {
    const intent = parseCommand("retry");
    const result = planCommand(intent, db, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan.providerAction?.kind).toBe("retry");
  });
});
