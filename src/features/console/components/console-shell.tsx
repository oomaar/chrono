"use client";

import {
  CommandLanguageProvider,
  ExecuteCommandModal,
} from "@/features/command-language";
import { ConsoleProvider } from "../console-provider";
import { AppLayout } from "./app-layout";
import { CommandDock } from "./command-dock";
import { ConsoleKeybinds } from "./console-keybinds";
import { KeyboardShortcutsSheet } from "./keyboard-shortcuts-sheet";
import { StageSwitcher } from "./stage/stage-switcher";
import { TimelineSpine } from "./timeline-spine";
import { TopRail } from "./top-rail/top-rail";

/**
 * The Chrono console shell — top rail, timeline spine, stage, command dock.
 * Wraps everything in the ConsoleProvider (fake-db + timeline state) and the
 * CommandLanguageProvider (history + scheduler + executor). The stage is a
 * switcher that routes to the active pane (console / investigate / compare /
 * device) based on focus state. The ExecuteCommandModal is mounted once at
 * the root so any nested surface can open it via `openExecute()`.
 */
export function ConsoleShell() {
  return (
    <ConsoleProvider>
      <CommandLanguageProvider>
        <ConsoleKeybinds />
        <AppLayout
          topRail={<TopRail />}
          spine={<TimelineSpine />}
          stage={<StageSwitcher />}
          dock={<CommandDock />}
        />
        <ExecuteCommandModal />
        <KeyboardShortcutsSheet />
      </CommandLanguageProvider>
    </ConsoleProvider>
  );
}
