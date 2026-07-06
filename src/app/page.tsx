import { designTokens } from "@/features/design-system/tokens";
import { createFakeDb } from "@/features/fake-db";
import { ThemeToggle } from "@/features/theme";

export default function Home() {
  const db = createFakeDb();
  const latestTimeline = db.timelineEvents.slice(0, 8);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-canvas text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(circle_at_90%_0%,rgba(251,191,36,0.15),transparent_35%)]" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <header className="flex flex-col justify-between gap-5 rounded-2xl border border-border-subtle bg-bg-surface/85 p-6 backdrop-blur-md md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
              Phase 0 - Foundation
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Chrono starts from time: deterministic data, tokenized UI, and
              runtime theming.
            </h1>
            <p className="max-w-2xl text-sm text-text-muted sm:text-base">
              Seed: {db.seed} | Devices: {db.devices.length} | Incidents:{" "}
              {db.incidents.length}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-2xl border border-border-subtle bg-bg-surface/85 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Operational Timeline</h2>
            <span className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 font-mono text-xs text-text-muted">
              Tick {designTokens.timeline.majorTickMinutes}m
            </span>
          </div>

          <ol className="space-y-3">
            {latestTimeline.map((event) => (
              <li
                key={event.id}
                className="grid gap-3 rounded-xl border border-border-subtle bg-bg-elevated/70 p-4 md:grid-cols-[180px_1fr]"
              >
                <div className="text-sm text-text-muted">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent-amber">
                    {event.type.replaceAll("-", " ")}
                  </p>
                  <p className="text-sm sm:text-base">{event.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 rounded-2xl border border-border-subtle bg-bg-surface/85 p-6 backdrop-blur-md md:grid-cols-3">
          <article className="rounded-xl border border-border-subtle bg-bg-elevated/60 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Token Depth
            </p>
            <p className="mt-2 text-xl font-semibold">
              {designTokens.depth.modal}
            </p>
          </article>
          <article className="rounded-xl border border-border-subtle bg-bg-elevated/60 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Motion Normal
            </p>
            <p className="mt-2 text-xl font-semibold">
              {designTokens.motion.normal}ms
            </p>
          </article>
          <article className="rounded-xl border border-border-subtle bg-bg-elevated/60 p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Users Linked
            </p>
            <p className="mt-2 text-xl font-semibold">{db.users.length}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
