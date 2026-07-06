import type { CommandKind } from "../types/command.types";

export const COMMAND_KIND_LABELS: Record<CommandKind, string> = {
  reboot: "Reboot device",
  isolate: "Isolate endpoint",
  "release-isolation": "Release isolation",
  "reapply-policy": "Re-apply policy",
  "deploy-update": "Deploy update",
  "collect-diagnostics": "Collect diagnostics",
  wipe: "Wipe device",
  "restart-agent": "Restart agent",
  "rotate-credentials": "Rotate credentials",
};

export const REVERSIBLE_COMMAND_KINDS: readonly CommandKind[] = [
  "isolate",
  "release-isolation",
  "reapply-policy",
  "deploy-update",
];

/**
 * Weighted distribution for command kinds — reboots and diagnostics dominate,
 * destructive ones are rare.
 */
export const COMMAND_KIND_WEIGHTS: Array<{
  kind: CommandKind;
  weight: number;
}> = [
  { kind: "reboot", weight: 22 },
  { kind: "collect-diagnostics", weight: 18 },
  { kind: "restart-agent", weight: 14 },
  { kind: "reapply-policy", weight: 12 },
  { kind: "deploy-update", weight: 12 },
  { kind: "isolate", weight: 6 },
  { kind: "release-isolation", weight: 5 },
  { kind: "rotate-credentials", weight: 8 },
  { kind: "wipe", weight: 3 },
];
