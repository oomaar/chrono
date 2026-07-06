"use client";

import { useState } from "react";
import { CommandInput, TimelineMarker } from "../";
import { ShowcaseRow, ShowcaseSection } from "./showcase-section";

export function TimelineShowcase() {
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState<string | undefined>(undefined);

  return (
    <ShowcaseSection
      kicker="Timeline primitives"
      title="Command input and timeline markers"
      description="The core interactive primitives that anchor the timeline console."
    >
      <ShowcaseRow label="Command input">
        <div className="w-full max-w-2xl">
          <CommandInput
            value={value}
            onChange={(event) => {
              const next = event.target.value;
              setValue(next);
              setSuggestion(
                next.startsWith("re") && next.length < 20
                  ? "boot berlin fleet"
                  : undefined,
              );
            }}
            scope="fleet"
            suggestion={suggestion ? " " + suggestion : undefined}
            hint="try: reboot berlin · investigate outage · compare before deployment"
          />
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Timeline marker · tone">
        <TimelineMarker tone="brand" label="Deployment" />
        <TimelineMarker tone="ok" label="Recovery" />
        <TimelineMarker tone="warn" label="Warning" />
        <TimelineMarker tone="crit" label="Critical" />
        <TimelineMarker tone="neutral" label="Info" />
      </ShowcaseRow>

      <ShowcaseRow label="Timeline marker · size + pulse">
        <TimelineMarker size="sm" tone="ok" />
        <TimelineMarker size="md" tone="warn" />
        <TimelineMarker size="lg" tone="crit" pulse />
        <TimelineMarker size="lg" tone="brand" pulse />
      </ShowcaseRow>

      <ShowcaseRow label="Timeline marker · in-context">
        <div className="border-line bg-elev relative w-full max-w-2xl rounded-xl border p-3">
          <div className="bg-surface-2 relative h-2 rounded-full">
            <div className="bg-line-strong/60 absolute inset-y-0 left-0 w-3/4 rounded-full" />
            <div className="absolute -top-1 left-[12%]">
              <TimelineMarker tone="ok" />
            </div>
            <div className="absolute -top-1 left-[38%]">
              <TimelineMarker tone="warn" />
            </div>
            <div className="absolute -top-1 left-[62%]">
              <TimelineMarker tone="crit" pulse />
            </div>
            <div className="absolute -top-1 left-[80%]">
              <TimelineMarker tone="brand" />
            </div>
          </div>
          <div className="text-ink-3 mt-2 flex justify-between font-mono text-[10px] tracking-[0.14em]">
            <span>-24h</span>
            <span>-12h</span>
            <span>-6h</span>
            <span>now</span>
          </div>
        </div>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}
