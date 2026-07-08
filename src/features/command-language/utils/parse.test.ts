import { describe, expect, it } from "vitest";
import { parseCommand } from "./parse";

describe("parseCommand", () => {
  it("returns an empty intent for blank input", () => {
    const intent = parseCommand("");
    expect(intent.verb).toBeNull();
    expect(intent.tokens).toHaveLength(0);
  });

  it("identifies verb + scope", () => {
    const intent = parseCommand("reboot berlin");
    expect(intent.verb?.keyword).toBe("reboot");
    expect(intent.scopes.map((s) => s.definition.keyword)).toEqual(["berlin"]);
    expect(intent.unknownTokens).toHaveLength(0);
  });

  it("flags unknown verbs", () => {
    const intent = parseCommand("banana berlin");
    expect(intent.verb).toBeNull();
    expect(intent.unknownTokens.length).toBeGreaterThan(0);
  });

  it("parses a modifier with the -- prefix", () => {
    const intent = parseCommand("reboot berlin --dry-run");
    expect(intent.modifiers).toHaveLength(1);
    expect(intent.modifiers[0].name).toBe("dry-run");
  });

  it("parses timing clauses", () => {
    const intent = parseCommand("deploy finance in 30m");
    expect(intent.timing?.kind).toBe("in");
    expect(intent.timing?.offsetMinutes).toBe(30);
  });

  it("collects multiple scopes", () => {
    const intent = parseCommand("apply hipaa finance");
    expect(intent.scopes.map((s) => s.definition.keyword)).toEqual(["hipaa", "finance"]);
  });

  it("recognizes hostname patterns as host scopes", () => {
    const intent = parseCommand("isolate atlas-441");
    expect(intent.scopes[0].definition.kind).toBe("host");
    expect(intent.scopes[0].definition.keyword).toBe("atlas-441");
  });

  it("marks whitespace tokens so highlighting can reconstruct input", () => {
    const intent = parseCommand("reboot   berlin");
    expect(intent.tokens.map((t) => t.role)).toContain("whitespace");
  });
});
