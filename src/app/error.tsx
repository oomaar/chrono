"use client";

import { useEffect } from "react";
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
    <div className="bg-bg text-ink relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(242,106,111,0.09),transparent_55%)]" />

      <section className="border-line bg-surface relative flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <TimelineFault className="h-32 w-auto" />

        <div className="space-y-3">
          <p className="text-crit font-mono text-[11px] tracking-[0.22em] uppercase">
            Timeline Interrupted
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Something derailed the current moment.
          </h1>
          <p className="text-ink-2 text-sm">
            {error.message || "An unexpected error occurred while rendering."}
          </p>
          {error.digest ? (
            <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">
              digest · {error.digest}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="bg-brand text-bg rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Return to now
          </button>
          <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">
            reversible · nothing was committed
          </p>
        </div>
      </section>
    </div>
  );
}
