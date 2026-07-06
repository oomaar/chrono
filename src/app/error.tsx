"use client";

import { useEffect } from "react";
import { Button, ScreenState } from "@/features/design-system";
import { TimelineFault } from "@/features/illustrations";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ScreenState
      tone="crit"
      kicker="Timeline Interrupted"
      title="Something derailed the current moment."
      description={error.message || "An unexpected error occurred while rendering."}
      meta={error.digest ? `digest · ${error.digest}` : undefined}
      illustration={<TimelineFault className="h-32 w-auto" />}
      action={
        <Button onClick={reset} size="md">
          Return to now
        </Button>
      }
      footnote="reversible · nothing was committed"
    />
  );
}
