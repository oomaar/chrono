"use client";

import { CommandComposer } from "@/features/command-language";

/**
 * Bottom command bar — Chrono's operational language. Owns nothing; the
 * composer is fully driven by the CommandLanguageProvider.
 */
export function CommandDock() {
  return (
    <div className="px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <CommandComposer />
      </div>
    </div>
  );
}
