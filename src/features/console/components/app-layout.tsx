import type { AppLayoutProps } from "../types/console.types";

/**
 * Top-level flex column: top rail → timeline spine → stage (fills) → dock.
 *
 * Layout strategy:
 *   - lg+ : fixed `h-screen` frame with an inner-scrolling stage, so the top
 *           rail / timeline spine / command dock stay pinned to their edges.
 *   - <lg : whole page scrolls, so on phones and small tablets you can reach
 *           every section without the stage collapsing to 0 height.
 *
 * A11y:
 *   - Skip-to-content link jumps past the top rail + timeline
 *   - `role="region"` + label on the timeline spine
 *   - `<main>` on the stage
 *   - `role="contentinfo"` on the command dock
 */
export function AppLayout({ topRail, spine, stage, dock }: AppLayoutProps) {
  return (
    <div className="bg-bg text-ink flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <a
        href="#chrono-stage"
        className="focus:bg-brand focus:text-bg sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:font-mono focus:text-[11px] focus:font-semibold focus:tracking-[0.14em] focus:uppercase"
      >
        Skip to stage
      </a>
      <div className="flex-none">{topRail}</div>
      <div
        role="region"
        aria-label="Timeline spine"
        className="border-line bg-surface flex-none border-b"
      >
        {spine}
      </div>
      <main
        id="chrono-stage"
        aria-label="Chrono stage"
        className="min-h-0 flex-1 lg:overflow-hidden"
      >
        {stage}
      </main>
      <div
        role="contentinfo"
        aria-label="Command dock"
        className="border-line bg-surface flex-none border-t lg:sticky lg:bottom-0"
      >
        {dock}
      </div>
    </div>
  );
}
