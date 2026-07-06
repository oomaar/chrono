export type CommandKind =
  | "reboot"
  | "isolate"
  | "release-isolation"
  | "reapply-policy"
  | "deploy-update"
  | "collect-diagnostics"
  | "wipe"
  | "restart-agent"
  | "rotate-credentials";

export type CommandStatus = "queued" | "running" | "succeeded" | "failed" | "reverted";

export type CommandParameterValue = string | number | boolean;

export type Command = {
  id: string;
  kind: CommandKind;
  actorUserId: string;
  targetDeviceIds: string[];
  targetGroupTag?: string;
  parameters: Record<string, CommandParameterValue>;
  status: CommandStatus;
  executedAt: string;
  reversible: boolean;
  revertedAt?: string;
  receiptId: string;
  summary: string;
};
