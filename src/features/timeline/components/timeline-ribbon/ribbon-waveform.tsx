import type { RibbonBucket } from "@/features/fake-db";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 100;
const BAR_GAP = 1.4;
const MIN_BAR_HEIGHT = 4;

type RibbonWaveformProps = {
  buckets: RibbonBucket[];
};

/** Histogram of activity across the current window. */
export function RibbonWaveform({ buckets }: RibbonWaveformProps) {
  const count = buckets.length || 1;
  const barWidth = Math.max(1, VIEWBOX_WIDTH / count - BAR_GAP);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {buckets.map((bucket, index) => {
        const x = (index / count) * VIEWBOX_WIDTH + BAR_GAP / 2;
        const height =
          MIN_BAR_HEIGHT + bucket.intensity * (VIEWBOX_HEIGHT - MIN_BAR_HEIGHT);
        const y = VIEWBOX_HEIGHT - height;
        const toneClass =
          bucket.criticalCount > 0
            ? "text-crit"
            : bucket.warnCount > 0
              ? "text-warn"
              : bucket.okCount > 0
                ? "text-brand"
                : "text-ink-3";
        return (
          <rect
            key={bucket.index}
            x={x}
            y={y}
            width={barWidth}
            height={height}
            rx={1}
            className={toneClass}
            fill="currentColor"
            opacity={0.35 + bucket.intensity * 0.6}
          />
        );
      })}
    </svg>
  );
}
