import type { ReactNode } from "react";
import type { FakeDb, Incident, LiveEngine, TimelineEvent } from "@/features/fake-db";
import type { TimelineEngineApi } from "@/features/timeline";

export type ConsoleContextValue = {
  db: FakeDb;
  engine: LiveEngine;
  timeline: TimelineEngineApi;
  focusedMomentId: string | null;
  focusedDeviceId: string | null;
  currentStage: StagePane;
  setFocusedMoment: (id: string | null) => void;
  setFocusedDevice: (id: string | null) => void;
  returnToConsole: () => void;
};

export type NeedItem = {
  incident: Incident;
  hasRecommendation: boolean;
  confidence: number | null;
  ageMinutes: number;
};

export type RecentMomentItem = {
  event: TimelineEvent;
  ageMinutes: number;
};

export type StagePane = "console" | "investigate" | "compare" | "device";

export type AppLayoutProps = {
  topRail: ReactNode;
  spine: ReactNode;
  stage: ReactNode;
  dock: ReactNode;
};
