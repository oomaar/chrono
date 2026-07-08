import { describe, expect, it } from "vitest";
import { parseCommand } from "./parse";
import { applySuggestion, suggestCompletions } from "./suggest";

describe("suggestCompletions", () => {
  it("returns examples when input is empty", () => {
    const intent = parseCommand("");
    const suggestions = suggestCompletions({ input: "", cursor: 0, intent });
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].kind).toBe("example");
  });

  it("suggests verbs when input has no verb yet", () => {
    const intent = parseCommand("reb");
    const suggestions = suggestCompletions({ input: "reb", cursor: 3, intent });
    expect(suggestions[0].kind).toBe("verb");
    expect(suggestions[0].label).toBe("reboot");
  });

  it("suggests scopes after a verb", () => {
    const input = "reboot ber";
    const intent = parseCommand(input);
    const suggestions = suggestCompletions({
      input,
      cursor: input.length,
      intent,
    });
    expect(suggestions[0].kind).toBe("scope");
    expect(suggestions[0].label).toBe("berlin");
  });

  it("suggests modifiers when the word starts with --", () => {
    const input = "reboot berlin --dr";
    const intent = parseCommand(input);
    const suggestions = suggestCompletions({
      input,
      cursor: input.length,
      intent,
    });
    expect(suggestions[0].kind).toBe("modifier");
    expect(suggestions[0].label).toBe("--dry-run");
  });

  it("applying a suggestion replaces the current word", () => {
    const input = "reb";
    const intent = parseCommand(input);
    const suggestions = suggestCompletions({ input, cursor: 3, intent });
    const chosen = suggestions.find((s) => s.label === "reboot");
    expect(chosen).toBeTruthy();
    if (!chosen) return;
    const next = applySuggestion(input, 3, chosen);
    expect(next.input.startsWith("reboot ")).toBe(true);
    expect(next.cursor).toBe("reboot ".length);
  });
});
