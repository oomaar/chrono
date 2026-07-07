import type { AppLayoutProps } from "../types/console.types";

/**
 * Top-level flex column: top rail → timeline spine → stage (fills) → dock.
 * On small screens the spine drops the lane strip via internal responsive
 * classes; the dock stays sticky at the bottom.
 */
export function AppLayout({ topRail, spine, stage, dock }: AppLayoutProps) {
  return (
    <div className="bg-bg text-ink flex h-screen min-h-0 flex-col overflow-hidden">
      <div className="flex-none">{topRail}</div>
      <div className="border-line bg-surface flex-none border-b">{spine}</div>
      <main className="min-h-0 flex-1 overflow-hidden">{stage}</main>
      <div className="border-line bg-surface flex-none border-t">{dock}</div>
    </div>
  );
}
