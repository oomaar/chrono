"use client";

import { CommandComposer, CommandHints } from "@/features/command-language";

/**
 * Bottom command bar — Chrono's operational language. Owns nothing; the
 * composer is fully driven by the CommandLanguageProvider. The hints row
 * below the bar demonstrates the four verb categories at a glance.
 */
export function CommandDock() {
  return (
    <div className="px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <CommandComposer />
        <CommandHints />
      </div>
    </div>
  );
}
