type IllustrationProps = {
  className?: string;
};

export function TimelineCollapse({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-crit">
        <circle
          cx="160"
          cy="90"
          r="46"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.12"
        />
        <circle
          cx="160"
          cy="90"
          r="30"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.22"
        />
        <circle
          cx="160"
          cy="90"
          r="16"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.5"
        />
        <circle cx="160" cy="90" r="4" fill="currentColor" />
      </g>

      <g
        className="text-ink-3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <line x1="12" y1="94" x2="80" y2="88" opacity="0.6" />
        <line x1="90" y1="70" x2="132" y2="82" opacity="0.7" />
        <line x1="188" y1="82" x2="230" y2="70" opacity="0.7" />
        <line x1="240" y1="88" x2="308" y2="94" opacity="0.6" />
        <line x1="80" y1="122" x2="138" y2="118" opacity="0.5" />
        <line x1="182" y1="118" x2="240" y2="122" opacity="0.5" />
      </g>

      <g className="text-ink-2" opacity="0.9">
        <circle cx="12" cy="94" r="1.75" fill="currentColor" />
        <circle cx="90" cy="70" r="1.75" fill="currentColor" />
        <circle cx="132" cy="82" r="1.75" fill="currentColor" />
        <circle cx="188" cy="82" r="1.75" fill="currentColor" />
        <circle cx="230" cy="70" r="1.75" fill="currentColor" />
        <circle cx="308" cy="94" r="1.75" fill="currentColor" />
        <circle cx="80" cy="122" r="1.75" fill="currentColor" />
        <circle cx="138" cy="118" r="1.75" fill="currentColor" />
        <circle cx="182" cy="118" r="1.75" fill="currentColor" />
        <circle cx="240" cy="122" r="1.75" fill="currentColor" />
      </g>

      <g
        className="text-brand"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="160" y1="90" x2="160" y2="72" />
        <line x1="160" y1="90" x2="174" y2="96" />
      </g>
    </svg>
  );
}
