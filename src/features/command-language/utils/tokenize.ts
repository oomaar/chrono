import type { Token } from "../types/command-language.types";

const WHITESPACE = /\s+/y;
const WORD = /[^\s]+/y;

/**
 * Split raw input into positioned tokens. Whitespace runs are preserved as
 * "whitespace" tokens so downstream reconstruction (e.g. syntax highlighting)
 * can render the input exactly as typed.
 */
export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    WHITESPACE.lastIndex = cursor;
    const ws = WHITESPACE.exec(input);
    if (ws && ws.index === cursor) {
      tokens.push({
        role: "whitespace",
        text: ws[0],
        start: cursor,
        end: cursor + ws[0].length,
      });
      cursor += ws[0].length;
      continue;
    }

    WORD.lastIndex = cursor;
    const word = WORD.exec(input);
    if (!word) break;
    tokens.push({
      role: "unknown",
      text: word[0],
      start: cursor,
      end: cursor + word[0].length,
    });
    cursor += word[0].length;
  }

  return tokens;
};

/** Non-whitespace tokens only, preserving order. */
export const meaningfulTokens = (tokens: Token[]): Token[] =>
  tokens.filter((token) => token.role !== "whitespace");
