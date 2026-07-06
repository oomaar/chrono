import { DataShowcase } from "@/features/design-system/showcase/data-showcase";
import { OverlaysShowcase } from "@/features/design-system/showcase/overlays-showcase";
import { PrimitivesShowcase } from "@/features/design-system/showcase/primitives-showcase";
import { ServerStatesShowcase } from "@/features/design-system/showcase/server-states-showcase";
import { StatesShowcase } from "@/features/design-system/showcase/states-showcase";
import { TimelineShowcase } from "@/features/design-system/showcase/timeline-showcase";
import { ThemeToggle } from "@/features/theme";

export const metadata = {
  title: "Chrono · Design System",
};

export default function DesignSystemPage() {
  return (
    <div className="bg-bg text-ink min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <header className="border-line bg-surface flex flex-col justify-between gap-5 rounded-2xl border p-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-brand font-mono text-[10px] tracking-[0.22em] uppercase">
              Phase 1 · Design System
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              The primitives Chrono is built from.
            </h1>
            <p className="text-ink-2 max-w-2xl text-sm">
              Every component uses the wireframe token palette, respects the theme, and is
              keyboard-accessible via Radix. Overlays animate via data-state; motion
              primitives use Framer Motion.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <PrimitivesShowcase />
        <DataShowcase />
        <TimelineShowcase />
        <OverlaysShowcase />
        <StatesShowcase />
        <ServerStatesShowcase />
      </div>
    </div>
  );
}
