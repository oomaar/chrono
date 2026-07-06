import { createFakeDb, createTimeEngine } from "@/features/fake-db";
import { LivePulse } from "@/features/fake-db/components/live-pulse";
import { ThemeToggle } from "@/features/theme";

export default function Home() {
  const db = createFakeDb();
  const engine = createTimeEngine(db);
  const state = engine.reconstructAt(engine.now());

  return (
    <div className="bg-bg text-ink relative min-h-screen overflow-hidden">
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <header className="border-line bg-surface flex flex-col justify-between gap-5 rounded-2xl border p-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-brand font-mono text-xs tracking-[0.2em] uppercase">
              Phase 2 · Operating System
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              A deterministic universe with a live clock on top.
            </h1>
            <p className="text-ink-2 max-w-2xl text-sm sm:text-base">
              Seed: {db.seed} · {db.devices.length} devices · {db.incidents.length}{" "}
              incidents · {db.updates.length} updates · {db.commands.length} commands ·{" "}
              {db.automations.length} automations · {db.timelineEvents.length} baseline
              events
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="border-line bg-surface grid gap-3 rounded-2xl border p-6 md:grid-cols-4">
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-brand font-mono text-2xl font-semibold tabular-nums">
              {state.fleet.online.toLocaleString()}
            </p>
            <p className="text-ink-3 mt-1 text-xs">online at anchor</p>
          </article>
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-warn font-mono text-2xl font-semibold tabular-nums">
              {state.fleet.degraded.toLocaleString()}
            </p>
            <p className="text-ink-3 mt-1 text-xs">degraded</p>
          </article>
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-crit font-mono text-2xl font-semibold tabular-nums">
              {state.fleet.offline.toLocaleString()}
            </p>
            <p className="text-ink-3 mt-1 text-xs">offline</p>
          </article>
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-ink font-mono text-2xl font-semibold tabular-nums">
              {state.fleet.total.toLocaleString()}
            </p>
            <p className="text-ink-3 mt-1 text-xs">enrolled</p>
          </article>
        </section>

        <LivePulse />
      </main>
    </div>
  );
}
