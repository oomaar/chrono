"use client";

import { ConsoleProvider } from "../console-provider";
import { AppLayout } from "./app-layout";
import { CommandDock } from "./command-dock";
import { ConsoleStage } from "./console-stage/console-stage";
import { TimelineSpine } from "./timeline-spine";
import { TopRail } from "./top-rail/top-rail";

/**
 * The Chrono console shell — top rail, timeline spine, stage, command dock.
 * Wraps everything in the ConsoleProvider so all children share the same
 * live engine + timeline state.
 */
export function ConsoleShell() {
  return (
    <ConsoleProvider>
      <AppLayout
        topRail={<TopRail />}
        spine={<TimelineSpine />}
        stage={<ConsoleStage />}
        dock={<CommandDock />}
      />
    </ConsoleProvider>
  );
}
