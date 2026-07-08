"use client";

import { CommandLanguageProvider } from "@/features/command-language";
import { ConsoleProvider } from "../console-provider";
import { AppLayout } from "./app-layout";
import { CommandDock } from "./command-dock";
import { ConsoleStage } from "./console-stage/console-stage";
import { TimelineSpine } from "./timeline-spine";
import { TopRail } from "./top-rail/top-rail";

/**
 * The Chrono console shell — top rail, timeline spine, stage, command dock.
 * Wraps everything in the ConsoleProvider (fake-db + timeline state) and the
 * CommandLanguageProvider (history + scheduler + executor).
 */
export function ConsoleShell() {
  return (
    <ConsoleProvider>
      <CommandLanguageProvider>
        <AppLayout
          topRail={<TopRail />}
          spine={<TimelineSpine />}
          stage={<ConsoleStage />}
          dock={<CommandDock />}
        />
      </CommandLanguageProvider>
    </ConsoleProvider>
  );
}
