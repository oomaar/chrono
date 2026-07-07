import type { TimeWindow } from "@/features/fake-db";
import type { PinState } from "../../types/timeline.types";
import { timestampToRatio } from "../../utils/time-scale";

type RibbonPinsProps = {
  pins: PinState;
  window: TimeWindow;
};

/**
 * Two dashed vertical lines at the pinned moments, each capped with a small
 * label chip (A / B). Rendered above markers but below the playhead.
 */
export function RibbonPins({ pins, window }: RibbonPinsProps) {
  const items = (["A", "B"] as const)
    .map((slot) => ({
      slot,
      timestamp: pins[slot],
    }))
    .filter(
      (item): item is { slot: "A" | "B"; timestamp: string } => item.timestamp !== null,
    )
    .map((item) => ({
      slot: item.slot,
      ratio: timestampToRatio(item.timestamp, window),
    }))
    .filter(({ ratio }) => ratio >= 0 && ratio <= 1);

  if (items.length === 0) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {items.map(({ slot, ratio }) => {
        const x = ratio * 100;
        const isA = slot === "A";
        const lineClass = isA ? "text-ink-2" : "text-brand";
        const badgeFill = isA ? "text-ink-2" : "text-brand";
        return (
          <g key={slot}>
            <line
              x1={x}
              y1={4}
              x2={x}
              y2={100}
              className={lineClass}
              stroke="currentColor"
              strokeWidth={0.35}
              strokeDasharray="1 1.5"
              opacity={0.85}
            />
            <g className={badgeFill}>
              <rect
                x={x - 2.4}
                y={0}
                width={4.8}
                height={4.5}
                rx={0.6}
                fill="currentColor"
              />
              <text
                x={x}
                y={3.4}
                textAnchor="middle"
                className="fill-bg font-mono text-[3px] font-semibold"
              >
                {slot}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
