"use client";

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
        <div className="relative flex min-h-screen items-center justify-center px-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(242,106,111,0.12),transparent_55%)]" />

          <section className="border-line bg-surface relative flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <TimelineCollapse className="h-32 w-auto" />

            <div className="space-y-3">
              <p className="text-crit font-mono text-[11px] tracking-[0.22em] uppercase">
                Fatal Timeline Fault
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Chrono could not render.
              </h1>
              <p className="text-ink-2 text-sm">
                {error.message || "An unrecoverable rendering error occurred."}
              </p>
              {error.digest ? (
                <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">
                  digest · {error.digest}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={reset}
              className="bg-brand text-bg rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Reload
            </button>
          </section>
        </div>
      </body>
    </html>
  );
}
