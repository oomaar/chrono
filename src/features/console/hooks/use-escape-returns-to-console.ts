"use client";

import { useEffect } from "react";
import { useConsole } from "../console-provider";

/**
 * Global Esc handler for the console. Dismisses the current focus so the
 * stage returns to whichever pane is appropriate (or back to the console).
 * Ignored while an input, textarea, or contenteditable element is focused,
 * so the command composer keeps its own Esc semantics.
 */
export function useEscapeReturnsToConsole(): void {
  const { returnToConsole } = useConsole();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Let any modal / dialog / popover consume Esc first — Radix stops
      // propagation via its own portal-scoped handlers.
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }
      returnToConsole();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [returnToConsole]);
}
