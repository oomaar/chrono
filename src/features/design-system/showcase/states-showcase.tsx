"use client";

import { Button, EmptyState, LoadingState } from "../";
import { ShowcaseSection } from "./showcase-section";

export function StatesShowcase() {
  return (
    <ShowcaseSection
      kicker="States"
      title="Empty and loading — with illustrations"
      description="Every empty and loading state on Chrono is a moment, not a void."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <EmptyState
          kicker="No moments"
          title="This lane has no moments yet."
          description="Automations, deployments, and commands executed here will surface as moments on the timeline."
          action={
            <Button size="sm" variant="secondary">
              Set up an automation
            </Button>
          }
        />

        <LoadingState
          kicker="Reconstructing state"
          title="Reading the last 24h…"
          description="Chrono is replaying 12,400 events to render this view."
        />
      </div>
    </ShowcaseSection>
  );
}
