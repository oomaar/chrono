import { cn } from "@/features/design-system";
import type { Token } from "../../types/command-language.types";

const roleClass = (role: Token["role"]): string => {
  switch (role) {
    case "verb":
      return "text-brand";
    case "scope":
      return "text-ok";
    case "modifier":
      return "text-warn";
    case "modifier-value":
      return "text-ink";
    case "timing-keyword":
      return "text-ink-2";
    case "timing-value":
      return "text-ink";
    case "unknown":
      return "text-crit underline decoration-crit/50 underline-offset-2";
    case "whitespace":
    default:
      return "text-ink";
  }
};

type SyntaxHighlightedOverlayProps = {
  tokens: Token[];
  className?: string;
};

/**
 * Renders parsed tokens with role-based colors. Meant to be layered behind an
 * `<input>` with matching font metrics so the caret sits over the highlighted
 * text. The overlay is `pointer-events-none` so all interaction stays on the
 * input.
 */
export function SyntaxHighlightedOverlay({
  tokens,
  className,
}: SyntaxHighlightedOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none font-mono text-sm leading-6 whitespace-pre",
        className,
      )}
    >
      {tokens.map((token) => (
        <span
          key={`${token.start}-${token.end}-${token.role}`}
          className={roleClass(token.role)}
        >
          {token.text}
        </span>
      ))}
    </div>
  );
}
