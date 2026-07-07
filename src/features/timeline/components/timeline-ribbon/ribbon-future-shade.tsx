import { PAST_RATIO } from "../../utils/zoom-presets";

/**
 * Diagonal-stripe overlay marking the future half of the ribbon.
 * Only rendered when `visible` is true (i.e. window extends past "now").
 */

type RibbonFutureShadeProps = { visible: boolean };

export function RibbonFutureShade({ visible }: RibbonFutureShadeProps) {
  if (!visible) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern
          id="future-shade"
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            className="text-line-strong"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect
        x={PAST_RATIO * 100}
        y="0"
        width={(1 - PAST_RATIO) * 100}
        height="100"
        fill="url(#future-shade)"
      />
      <line
        x1={PAST_RATIO * 100}
        y1="0"
        x2={PAST_RATIO * 100}
        y2="100"
        className="text-line-strong"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.7"
      />
    </svg>
  );
}
