"use client";

import { Button, ScreenState } from "@/features/design-system";
import { TimelineCollapse } from "@/features/illustrations";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-bg text-ink min-h-screen antialiased">
        <ScreenState
          tone="crit"
          kicker="Fatal Timeline Fault"
          title="Chrono could not render."
          description={error.message || "An unrecoverable rendering error occurred."}
          meta={error.digest ? `digest · ${error.digest}` : undefined}
          illustration={<TimelineCollapse className="h-32 w-auto" />}
          action={
            <Button onClick={reset} size="md">
              Reload
            </Button>
          }
        />
      </body>
    </html>
  );
}
