"use client";

import { useState } from "react";
import { CommandInput } from "@/features/design-system";
import { useConsole } from "../console-provider";

/**
 * Bottom command bar — the operational language of Chrono. Static input for
 * now; wired to future intent execution in Phase 5.
 */
export function CommandDock() {
  const { timeline } = useConsole();
  const [value, setValue] = useState("");

  const suggestion =
    value.startsWith("re") && value.length < 20 ? " boot berlin fleet" : undefined;

  const scopeLabel =
    timeline.mode === "live"
      ? "fleet · now"
      : timeline.mode === "playback"
        ? "fleet · replay"
        : "fleet · scrub";

  return (
    <div className="px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <CommandInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          scope={scopeLabel}
          suggestion={suggestion}
          hint="try: reboot berlin · investigate outage · compare before deployment"
        />
      </div>
    </div>
  );
}
