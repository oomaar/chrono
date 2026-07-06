"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Button, EmptyState, LoadingState, ScreenState, cn } from "../";
import {
  DisconnectedTimeline,
  LockedMoment,
  MissingMoment,
  TimelineCollapse,
  TimelineFault,
} from "@/features/illustrations";
import { ShowcaseSection } from "./showcase-section";

type PreviewFrameProps = {
  label: string;
  route: string;
  children: ReactNode;
  className?: string;
};

function PreviewFrame({ label, route, children, className }: PreviewFrameProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-ink-3 font-mono text-[10px] tracking-[0.16em] uppercase">
          {label}
        </p>
        <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">{route}</p>
      </div>
      <div className={cn("border-line-2 overflow-hidden rounded-2xl border", className)}>
        {children}
      </div>
    </div>
  );
}

export function ServerStatesShowcase() {
  const frameHeight = "h-[440px]";

  return (
    <ShowcaseSection
      kicker="Server states"
      title="Every state a route can be in."
      description="Loading, empty, error, 404, unauthorized, forbidden, offline, and fatal — all built on the shared ScreenState primitive so tone, glow, and copy stay consistent."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <PreviewFrame label="Loading" route="loading.tsx" className={frameHeight}>
          <div className="bg-bg h-full overflow-auto p-6">
            <LoadingState />
          </div>
        </PreviewFrame>

        <PreviewFrame label="Empty" route="no data" className={frameHeight}>
          <div className="bg-bg h-full overflow-auto p-6">
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
          </div>
        </PreviewFrame>

        <PreviewFrame label="Not Found" route="not-found.tsx" className={frameHeight}>
          <ScreenState
            tone="brand"
            kicker="No Such Moment · 404"
            title="That moment is not on the timeline."
            description="The route you followed does not resolve to an existing moment."
            illustration={<MissingMoment className="h-24 w-auto" />}
            action={
              <Button asChild size="sm">
                <Link href="/">Return to now</Link>
              </Button>
            }
            footnote="live · reconstructed at the playhead"
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>

        <PreviewFrame label="Error · 500" route="error.tsx" className={frameHeight}>
          <ScreenState
            tone="crit"
            kicker="Timeline Interrupted"
            title="Something derailed the current moment."
            description="Rendering failed while reconstructing the timeline."
            meta="digest · 7a2f9b1c"
            illustration={<TimelineFault className="h-24 w-auto" />}
            action={<Button size="sm">Return to now</Button>}
            footnote="reversible · nothing was committed"
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>

        <PreviewFrame
          label="Global Error"
          route="global-error.tsx"
          className={frameHeight}
        >
          <ScreenState
            tone="crit"
            kicker="Fatal Timeline Fault"
            title="Chrono could not render."
            description="An unrecoverable rendering error occurred."
            meta="digest · fa32d0e1"
            illustration={<TimelineCollapse className="h-24 w-auto" />}
            action={<Button size="sm">Reload</Button>}
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>

        <PreviewFrame
          label="Unauthorized · 401"
          route="unauthorized.tsx"
          className={frameHeight}
        >
          <ScreenState
            tone="warn"
            kicker="Session Expired"
            title="Your credentials no longer match a valid moment."
            description="Sign in again to resume the timeline where you left off."
            illustration={<LockedMoment className="text-warn h-24 w-auto" />}
            action={<Button size="sm">Sign in</Button>}
            footnote="your session was idle for 30 minutes"
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>

        <PreviewFrame
          label="Forbidden · 403"
          route="forbidden.tsx"
          className={frameHeight}
        >
          <ScreenState
            tone="crit"
            kicker="Access Locked"
            title="You cannot view this moment."
            description="Your role does not have permission to observe or act on this part of the timeline."
            illustration={<LockedMoment className="text-crit h-24 w-auto" />}
            action={
              <Button size="sm" variant="secondary">
                Request access
              </Button>
            }
            footnote="admins can grant scoped access from settings"
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>

        <PreviewFrame label="Offline" route="network error" className={frameHeight}>
          <ScreenState
            tone="warn"
            kicker="Timeline Paused"
            title="Chrono lost connection to the fleet."
            description="Waiting for the next heartbeat. The playhead will resume automatically."
            illustration={<DisconnectedTimeline className="h-24 w-auto" />}
            action={
              <Button size="sm" variant="secondary">
                Retry now
              </Button>
            }
            footnote="last event received · 12s ago"
            containerClassName="h-full"
            cardClassName="p-6 gap-5 max-w-md"
          />
        </PreviewFrame>
      </div>
    </ShowcaseSection>
  );
}
