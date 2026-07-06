export type UpdateChannel = "stable" | "beta" | "canary";

export type UpdateStage = "queued" | "rolling" | "completed" | "paused" | "failed";

export type UpdateKind = "os" | "security" | "app";

export type Update = {
  id: string;
  name: string;
  kind: UpdateKind;
  channel: UpdateChannel;
  fromVersion: string;
  toVersion: string;
  stage: UpdateStage;
  progress: number;
  targetCount: number;
  completedCount: number;
  failedCount: number;
  startedAt: string;
  finishedAt?: string;
  initiatedByUserId: string;
  affectedTags: string[];
};
