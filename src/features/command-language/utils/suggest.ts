import {
  EXAMPLE_COMMANDS,
  MODIFIERS,
  SCOPES,
  TIMING_KEYWORDS,
  VERBS,
} from "../constants/grammar.constants";
import type { CommandIntent, Suggestion, Token } from "../types/command-language.types";
import { meaningfulTokens } from "./tokenize";

type SuggestOptions = {
  input: string;
  cursor: number;
  intent: CommandIntent;
};

// ---- fuzzy matching -----------------------------------------------------

const scoreMatch = (candidate: string, query: string): number => {
  if (!query) return 40;
  const c = candidate.toLowerCase();
  const q = query.toLowerCase();
  if (c === q) return 100;
  if (c.startsWith(q)) return 90 - (c.length - q.length);
  if (c.includes(q)) return 60 - (c.length - q.length);
  // subsequence match
  let qi = 0;
  for (let i = 0; i < c.length && qi < q.length; i += 1) {
    if (c[i] === q[qi]) qi += 1;
  }
  return qi === q.length ? 30 : -1;
};

// ---- cursor context -----------------------------------------------------

const wordAtCursor = (
  input: string,
  cursor: number,
): { text: string; start: number; end: number } => {
  let start = cursor;
  while (start > 0 && !/\s/.test(input[start - 1])) start -= 1;
  let end = cursor;
  while (end < input.length && !/\s/.test(input[end])) end += 1;
  return { text: input.slice(start, end), start, end };
};

// ---- builders -----------------------------------------------------------

const verbSuggestions = (query: string): Suggestion[] =>
  VERBS.map((verb) => ({
    id: `verb:${verb.keyword}`,
    kind: "verb" as const,
    label: verb.keyword,
    description: verb.description,
    insertText: verb.keyword,
    score: scoreMatch(verb.keyword, query),
  })).filter((s) => s.score > 0);

const scopeSuggestions = (query: string): Suggestion[] =>
  SCOPES.map((scope) => ({
    id: `scope:${scope.keyword}`,
    kind: "scope" as const,
    label: scope.keyword,
    description: scope.description,
    insertText: scope.keyword,
    score: scoreMatch(scope.keyword, query),
  })).filter((s) => s.score > 0);

const modifierSuggestions = (query: string): Suggestion[] =>
  MODIFIERS.map((mod) => ({
    id: `modifier:${mod.name}`,
    kind: "modifier" as const,
    label: `--${mod.name}`,
    description: mod.description,
    insertText: `--${mod.name}`,
    score: scoreMatch(`--${mod.name}`, query),
  })).filter((s) => s.score > 0);

const timingSuggestions = (query: string): Suggestion[] => {
  const options: Array<[string, string, string]> = [
    ["now", "immediately", "now"],
    ["in 30m", "in 30 minutes", "in 30m"],
    ["in 2h", "in 2 hours", "in 2h"],
    ["at 14:00", "today at 14:00 UTC", "at 14:00"],
    ["tomorrow at 02:00", "tomorrow at 02:00 UTC", "tomorrow at 02:00"],
    ["when offline > 5", "watch condition", "when offline > 5"],
  ];
  return options
    .map(([label, description, insertText]) => ({
      id: `timing:${label}`,
      kind: "timing" as const,
      label,
      description,
      insertText,
      score: scoreMatch(label, query),
    }))
    .filter((s) => s.score > 0);
};

const exampleSuggestions = (): Suggestion[] =>
  EXAMPLE_COMMANDS.map((example, index) => ({
    id: `example:${index}`,
    kind: "example" as const,
    label: example,
    description: "example",
    insertText: example,
    score: 50 - index,
  }));

// ---- public API ---------------------------------------------------------

/**
 * Given the current input, cursor position, and parsed intent, produce a
 * ranked list of context-sensitive completions. Applied via `insertText` at
 * the current word span (see `applySuggestion`).
 */
export const suggestCompletions = ({
  input,
  cursor,
  intent,
}: SuggestOptions): Suggestion[] => {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return exampleSuggestions();
  }

  const word = wordAtCursor(input, cursor);
  const meaningful = meaningfulTokens(intent.tokens);
  const cursorAtStart = meaningful.length === 0 || meaningful[0].start > cursor - 1;

  // Modifier query: user is typing "--…"
  if (word.text.startsWith("--")) {
    return modifierSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  // No verb yet → verb suggestions
  if (!intent.verb) {
    return verbSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  // Cursor is on the verb token itself → keep suggesting verbs
  if (
    cursorAtStart &&
    intent.verbToken &&
    cursor >= intent.verbToken.start &&
    cursor <= intent.verbToken.end
  ) {
    return verbSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  // Timing keyword just used → timing values
  const lastMeaningful = meaningful[meaningful.length - 1];
  const previousToken = meaningful[meaningful.length - 2] ?? intent.verbToken ?? null;
  const inTimingClause =
    (lastMeaningful?.role === "timing-keyword" ||
      lastMeaningful?.role === "timing-value") &&
    word.text.length === 0;

  if (inTimingClause) {
    return timingSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  // "when" typed → suggest condition seeds
  if (word.text.startsWith("when")) {
    return timingSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  // After verb, without a timing keyword → suggest scopes (+ timing + modifiers as a tail)
  const scopes = scopeSuggestions(word.text);
  const modifiers = modifierSuggestions(word.text);
  const timing = TIMING_KEYWORDS.map((keyword) => ({
    id: `timing-keyword:${keyword}`,
    kind: "timing" as const,
    label: keyword,
    description: "timing",
    insertText: keyword,
    score: scoreMatch(keyword, word.text),
  })).filter((s) => s.score > 0);

  // If previous token was "in" or "at", surface timing values
  if (
    previousToken &&
    (previousToken.text.toLowerCase() === "in" ||
      previousToken.text.toLowerCase() === "at" ||
      previousToken.text.toLowerCase() === "when")
  ) {
    return timingSuggestions(word.text).sort((a, b) => b.score - a.score);
  }

  return [...scopes, ...timing, ...modifiers]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

/**
 * Apply a suggestion by replacing the token currently under the cursor with
 * the suggestion's `insertText`. Returns the new input and the new cursor
 * position.
 */
export const applySuggestion = (
  input: string,
  cursor: number,
  suggestion: Suggestion,
): { input: string; cursor: number } => {
  const word = wordAtCursor(input, cursor);
  const before = input.slice(0, word.start);
  const after = input.slice(word.end);
  const needsTrailingSpace =
    after.length === 0 || (after[0] !== " " && suggestion.kind !== "example");
  const insertion = needsTrailingSpace
    ? `${suggestion.insertText} `
    : suggestion.insertText;
  const nextInput = `${before}${insertion}${after}`;
  return {
    input: nextInput,
    cursor: (before + insertion).length,
  };
};

/** Convenience: the token under the cursor. Exported for other consumers. */
export const cursorTokenAt = (input: string, cursor: number): Token => {
  const word = wordAtCursor(input, cursor);
  return {
    role: "unknown",
    text: word.text,
    start: word.start,
    end: word.end,
  };
};
