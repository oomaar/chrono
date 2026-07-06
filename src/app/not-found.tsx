import Link from "next/link";
import { MissingMoment } from "@/features/illustrations";

export default function NotFound() {
  return (
    <div className="bg-bg text-ink relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(198,242,78,0.07),transparent_55%)]" />

      <section className="border-line bg-surface relative flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <MissingMoment className="h-32 w-auto" />

        <div className="space-y-3">
          <p className="text-ink-3 font-mono text-[11px] tracking-[0.22em] uppercase">
            No Such Moment · 404
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            That moment is not on the timeline.
          </h1>
          <p className="text-ink-2 text-sm">
            The route you followed does not resolve to an existing moment. Return to the
            live console to continue.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="bg-brand text-bg rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Return to now
          </Link>
          <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">
            live · reconstructed at the playhead
          </p>
        </div>
      </section>
    </div>
  );
}
