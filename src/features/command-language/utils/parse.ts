import {
  MODIFIERS,
  SCOPES,
  TIMING_KEYWORDS,
  VERBS,
} from "../constants/grammar.constants";
import type {
  CommandIntent,
  ModifierName,
  ScopeDefinition,
  Token,
  VerbDefinition,
} from "../types/command-language.types";
import { meaningfulTokens, tokenize } from "./tokenize";
import { parseTimingClause } from "./format-timing";

const findVerb = (word: string): VerbDefinition | null => {
  const lower = word.toLowerCase();
  return (
    VERBS.find((verb) => verb.keyword === lower || verb.aliases.includes(lower)) ?? null
  );
};

const findScope = (word: string): ScopeDefinition | null => {
  const lower = word.toLowerCase();
  return (
    SCOPES.find((scope) => scope.keyword === lower || scope.aliases.includes(lower)) ??
    null
  );
};

const parseModifier = (
  token: Token,
): { name: ModifierName; value?: string; matched: string } | null => {
  if (!token.text.startsWith("--")) return null;
  const body = token.text.slice(2);
  const [rawName, rawValue] = body.split("=", 2);
  const lower = rawName.toLowerCase();
  const definition = MODIFIERS.find(
    (mod) => mod.name === lower || mod.aliases.includes(lower),
  );
  if (!definition) return null;
  return {
    name: definition.name,
    value: rawValue?.trim() || undefined,
    matched: definition.name,
  };
};

const isTimingKeyword = (word: string): boolean =>
  TIMING_KEYWORDS.some((keyword) => keyword === word.toLowerCase());

/**
 * Parse raw input into a CommandIntent. This is a lenient parser: it never
 * throws — unknown tokens get flagged but the intent is still returned so the
 * UI can offer suggestions and inline validation.
 */
export const parseCommand = (input: string): CommandIntent => {
  const tokens = tokenize(input);
  const meaningful = meaningfulTokens(tokens);

  const intent: CommandIntent = {
    raw: input,
    tokens: tokens.map((token) => ({ ...token })),
    verb: null,
    verbToken: null,
    scopes: [],
    timing: null,
    modifiers: [],
    unknownTokens: [],
  };

  if (meaningful.length === 0) return intent;

  // First non-whitespace token → verb candidate
  const [firstToken, ...rest] = meaningful;
  const verb = findVerb(firstToken.text);
  const roleFor = new Map<Token, Token["role"]>();

  if (verb) {
    intent.verb = verb;
    intent.verbToken = firstToken;
    roleFor.set(firstToken, "verb");
  } else {
    roleFor.set(firstToken, "unknown");
    intent.unknownTokens.push(firstToken);
  }

  // Walk remaining tokens
  let index = 0;
  while (index < rest.length) {
    const token = rest[index];

    // modifier?
    if (token.text.startsWith("--")) {
      const mod = parseModifier(token);
      if (mod) {
        intent.modifiers.push({ name: mod.name, value: mod.value, token });
        roleFor.set(token, "modifier");
      } else {
        roleFor.set(token, "unknown");
        intent.unknownTokens.push(token);
      }
      index += 1;
      continue;
    }

    // timing clause?
    if (isTimingKeyword(token.text)) {
      const clauseTokens: Token[] = [token];
      let cursor = index + 1;
      while (cursor < rest.length) {
        const next = rest[cursor];
        if (next.text.startsWith("--")) break;
        if (isTimingKeyword(next.text) && next.text.toLowerCase() !== "at") {
          // "tomorrow at" and "in ... at" chain, otherwise a new timing starts
          break;
        }
        clauseTokens.push(next);
        cursor += 1;
      }
      const clauseText = clauseTokens.map((t) => t.text).join(" ");
      const parsed = parseTimingClause(clauseText);
      intent.timing = {
        kind: parsed.kind,
        text: clauseText,
        offsetMinutes: parsed.offsetMinutes,
        tokens: clauseTokens,
      };
      for (const clauseToken of clauseTokens) {
        roleFor.set(
          clauseToken,
          clauseToken === token ? "timing-keyword" : "timing-value",
        );
      }
      index = cursor;
      continue;
    }

    // scope?
    const scope = findScope(token.text);
    if (scope) {
      intent.scopes.push({ token, definition: scope });
      roleFor.set(token, "scope");
      index += 1;
      continue;
    }

    // entity id pattern (e.g. incident_3, update_5, receipt_ab12cd)?
    const entityMatch =
      /^(incident|update|command|receipt|automation|policy|device|team|office|user)_[a-z0-9]+$/i.exec(
        token.text,
      );
    if (entityMatch) {
      const kind = entityMatch[1].toLowerCase() as
        | "incident"
        | "update"
        | "command"
        | "receipt"
        | "automation"
        | "policy"
        | "device"
        | "team"
        | "office"
        | "user";
      const entityScope: ScopeDefinition = {
        keyword: token.text.toLowerCase(),
        aliases: [],
        kind: "entity",
        description: `${kind} ${token.text}`,
        entity: { kind, id: token.text.toLowerCase() },
      };
      intent.scopes.push({ token, definition: entityScope });
      roleFor.set(token, "scope");
      index += 1;
      continue;
    }

    // hostname-style pattern (e.g. atlas-441 or atlas-*)?
    if (/^[a-z][a-z0-9]*(-[a-z0-9*]+)+$/i.test(token.text)) {
      const hostScope: ScopeDefinition = {
        keyword: token.text.toLowerCase(),
        aliases: [],
        kind: "host",
        description: `Device host ${token.text}`,
      };
      intent.scopes.push({ token, definition: hostScope });
      roleFor.set(token, "scope");
      index += 1;
      continue;
    }

    // unknown
    roleFor.set(token, "unknown");
    intent.unknownTokens.push(token);
    index += 1;
  }

  // Reapply roles onto the full token stream (including whitespace)
  intent.tokens = tokens.map((token) => {
    if (token.role === "whitespace") return token;
    const nextRole = roleFor.get(token) ?? "unknown";
    return { ...token, role: nextRole };
  });

  return intent;
};
