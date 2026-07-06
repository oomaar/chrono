type IllustrationProps = {
  className?: string;
};

export function MissingMoment({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-ink-3" opacity="0.35">
        {Array.from({ length: 9 }).map((_, column) =>
          Array.from({ length: 3 }).map((__, row) => (
            <circle
              key={`${column}-${row}`}
              cx={20 + column * 35}
              cy={40 + row * 40}
              r="1"
              fill="currentColor"
            />
          )),
        )}
      </g>

      <g className="text-ink-3">
        <line
          x1="20"
          x2="300"
          y1="96"
          y2="96"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.6"
        />
      </g>

      <g className="text-ink-2">
        <circle cx="45" cy="96" r="3.5" fill="currentColor" />
        <circle cx="90" cy="96" r="3.5" fill="currentColor" />
        <circle cx="135" cy="96" r="3.5" fill="currentColor" />
        <circle cx="225" cy="96" r="3.5" fill="currentColor" />
        <circle cx="270" cy="96" r="3.5" fill="currentColor" />
      </g>

      <g className="text-ink-3">
        <circle
          cx="180"
          cy="96"
          r="14"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          fill="none"
        />
        <text
          x="180"
          y="101"
          textAnchor="middle"
          fill="currentColor"
          fontSize="14"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight="500"
        >
          ?
        </text>
      </g>

      <g className="text-brand">
        <line
          x1="180"
          y1="60"
          x2="180"
          y2="76"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M174 60 L186 60 L180 54 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
