"use client";

import { useEscapeReturnsToConsole } from "../hooks/use-escape-returns-to-console";

/**
 * Empty renderless component that mounts global keyboard bindings for the
 * console shell. Lives inside the ConsoleProvider so `useConsole()` works.
 */
export function ConsoleKeybinds() {
  useEscapeReturnsToConsole();
  return null;
}
