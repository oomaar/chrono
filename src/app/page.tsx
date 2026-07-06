import { designTokens } from "@/features/design-system/tokens";
import { createFakeDb } from "@/features/fake-db";
import { ThemeToggle } from "@/features/theme";

export default function Home() {
  const db = createFakeDb();
  const latestTimeline = db.timelineEvents.slice(0, 8);

  return (
    <div className="bg-bg text-ink relative min-h-screen overflow-hidden">
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <header className="border-line bg-surface flex flex-col justify-between gap-5 rounded-2xl border p-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-ink-3 font-mono text-xs tracking-[0.2em] uppercase">
              Phase 0 - Foundation
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Chrono starts from time: deterministic data, tokenized UI, and runtime
              theming.
            </h1>
            <p className="text-ink-2 max-w-2xl text-sm sm:text-base">
              Seed: {db.seed} | Devices: {db.devices.length} | Incidents:{" "}
              {db.incidents.length}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="border-line bg-surface rounded-2xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Operational Timeline</h2>
            <span className="border-line bg-elev text-ink-3 rounded-full border px-3 py-1 font-mono text-xs">
              Tick {designTokens.timeline.majorTickMinutes}m
            </span>
          </div>

          <ol className="space-y-3">
            {latestTimeline.map((event) => (
              <li
                key={event.id}
                className="border-line bg-elev grid gap-3 rounded-xl border p-4 md:grid-cols-[180px_1fr]"
              >
                <div className="text-ink-2 text-sm">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
                <div className="space-y-1">
                  <p className="text-warn font-mono text-xs tracking-[0.18em] uppercase">
                    {event.type.replaceAll("-", " ")}
                  </p>
                  <p className="text-sm sm:text-base">{event.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-line bg-surface grid gap-4 rounded-2xl border p-6 md:grid-cols-3">
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-ink-3 font-mono text-xs tracking-[0.16em] uppercase">
              Token Depth
            </p>
            <p className="mt-2 text-xl font-semibold">{designTokens.depth.modal}</p>
          </article>
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-ink-3 font-mono text-xs tracking-[0.16em] uppercase">
              Motion Normal
            </p>
            <p className="mt-2 text-xl font-semibold">{designTokens.motion.normal}ms</p>
          </article>
          <article className="border-line bg-elev rounded-xl border p-4">
            <p className="text-ink-3 font-mono text-xs tracking-[0.16em] uppercase">
              Users Linked
            </p>
            <p className="mt-2 text-xl font-semibold">{db.users.length}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
