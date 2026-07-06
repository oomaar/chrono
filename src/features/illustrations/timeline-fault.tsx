type IllustrationProps = {
  className?: string;
};

export function TimelineFault({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <defs>
        <linearGradient id="tf-fade-left" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="tf-fade-right" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="text-ink-3">
        <line
          x1="10"
          x2="140"
          y1="96"
          y2="96"
          stroke="url(#tf-fade-left)"
          strokeWidth="1.25"
        />
        <line
          x1="180"
          x2="310"
          y1="96"
          y2="96"
          stroke="url(#tf-fade-right)"
          strokeWidth="1.25"
        />

        <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
          <line x1="30" y1="88" x2="30" y2="104" opacity="0.35" />
          <line x1="60" y1="88" x2="60" y2="104" opacity="0.5" />
          <line x1="90" y1="88" x2="90" y2="104" opacity="0.7" />
          <line x1="120" y1="88" x2="120" y2="104" opacity="0.9" />
          <line x1="200" y1="88" x2="200" y2="104" opacity="0.9" />
          <line x1="230" y1="88" x2="230" y2="104" opacity="0.7" />
          <line x1="260" y1="88" x2="260" y2="104" opacity="0.5" />
          <line x1="290" y1="88" x2="290" y2="104" opacity="0.35" />
        </g>
      </g>

      <g className="text-crit">
        <path
          d="M148 72 L156 96 L142 108 L172 108 L158 120"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="160" cy="96" r="3.5" fill="currentColor" />
        <circle
          cx="160"
          cy="96"
          r="10"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.35"
        />
        <circle
          cx="160"
          cy="96"
          r="18"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.15"
        />
      </g>

      <g className="text-brand">
        <line
          x1="160"
          y1="46"
          x2="160"
          y2="70"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M154 46 L166 46 L160 40 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
