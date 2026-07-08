"use client";

import { ConsoleStage } from "../console-stage/console-stage";

/**
 * The default "console" pane — kept as a thin wrapper so `StageSwitcher` can
 * route to it symmetrically alongside the other three panes.
 */
export function ConsolePane() {
  return <ConsoleStage />;
}
