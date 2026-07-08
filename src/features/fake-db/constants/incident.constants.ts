import type {
  IncidentChainStep,
  IncidentRecommendation,
  IncidentSeverity,
} from "../types/incident.types";
import type { TimelineLane } from "../types/timeline-event.types";

export type IncidentBlueprint = {
  key: string;
  title: string;
  detail: string;
  severity: IncidentSeverity;
  lane: TimelineLane;
  /** How long ago the incident opened, in minutes. */
  openedMinutesAgo: number;
  /**
   * If defined, minutes-since-open when the incident was resolved.
   * Undefined = still open.
   */
  resolvedAfterMinutes?: number;
  affectedTags: string[];
  affectedCount: number;
  chain: IncidentChainStep[];
  recommendation?: IncidentRecommendation;
};

export const INCIDENT_BLUEPRINTS: IncidentBlueprint[] = [
  {
    key: "filevault-drift",
    title: "12 Finance devices lost disk encryption",
    detail:
      "FileVault escrow silently reverted on 12 identical MacBooks in the Finance org after last night's OS security patch. Known regression pattern for this model + patch combination.",
    severity: "crit",
    lane: "compliance",
    openedMinutesAgo: 120,
    affectedTags: ["finance"],
    affectedCount: 12,
    chain: [
      {
        label: "TRIGGER · -6h20m",
        text: "OS security update 14.2 applied to the Finance fleet.",
        tone: "ok",
      },
      {
        label: "SIDE EFFECT",
        text: "FileVault key escrow reverted to unmanaged on 12 units.",
        tone: "warn",
      },
      {
        label: "NOW · -2h",
        text: "12 devices reporting non-compliant. Exposure growing.",
        tone: "crit",
      },
    ],
    recommendation: {
      title: "Re-apply FileVault policy to all 12",
      detail:
        "Pushes the encryption profile and forces a key re-escrow. ~4 min, no user interruption, fully reversible.",
      confidence: 96,
      reversible: true,
      command: "apply finance",
    },
  },
  {
    key: "berlin-partition",
    title: "Berlin office dropped 12 devices offline",
    detail:
      "A 90-second network partition at the Berlin site during the 14.2 rollout left 12 devices unable to check in. Most recovered.",
    severity: "high",
    lane: "connectivity",
    openedMinutesAgo: 360,
    resolvedAfterMinutes: 40,
    affectedTags: [],
    affectedCount: 12,
    chain: [
      {
        label: "TRIGGER · -6h",
        text: "Berlin edge switch failover during patch push.",
        tone: "warn",
      },
      {
        label: "RECOVERED",
        text: "11 devices re-connected within 5 minutes.",
        tone: "ok",
      },
      {
        label: "OUTLIER",
        text: "atlas-441 remains isolated after outbound anomaly.",
        tone: "crit",
      },
    ],
  },
  {
    key: "outbound-anomaly",
    title: "Outbound anomaly quarantined atlas-441",
    detail:
      "Automation isolated atlas-441 after outbound traffic matched a known C2 pattern.",
    severity: "crit",
    lane: "security",
    openedMinutesAgo: 15,
    affectedTags: [],
    affectedCount: 1,
    chain: [
      {
        label: "TRIGGER · -15m",
        text: "Outbound connection volume to unrecognized host.",
        tone: "warn",
      },
      {
        label: "AUTOMATION",
        text: "Isolation rule 'C2-pattern' fired, device quarantined.",
        tone: "brand",
      },
      {
        label: "NOW",
        text: "Awaiting analyst review before releasing isolation.",
        tone: "crit",
      },
    ],
    recommendation: {
      title: "Review packet capture and release isolation",
      detail:
        "Manual review of the outbound signature is needed before returning the device to the network.",
      confidence: 62,
      reversible: true,
      command: "release isolated",
    },
  },
  {
    key: "av-stale",
    title: "AV definitions stale on 34 devices",
    detail: "Anti-virus definitions have not synced in 72h on a subset of the fleet.",
    severity: "medium",
    lane: "compliance",
    openedMinutesAgo: 720,
    affectedTags: ["remote"],
    affectedCount: 34,
    chain: [
      {
        label: "TRIGGER · -12h",
        text: "Compliance check failed AV freshness on 34 devices.",
        tone: "warn",
      },
      {
        label: "NOW",
        text: "Fleet exposure limited to remote workers.",
        tone: "neutral",
      },
    ],
    recommendation: {
      title: "Push AV signature refresh",
      detail: "Force definition sync via management channel. 2 min per device.",
      confidence: 88,
      reversible: false,
      command: "apply remote",
    },
  },
  {
    key: "vpn-flap",
    title: "VPN concentrator flapping",
    detail: "Intermittent VPN drops observed for 30 min across remote fleet.",
    severity: "medium",
    lane: "connectivity",
    openedMinutesAgo: 240,
    resolvedAfterMinutes: 45,
    affectedTags: ["remote", "field"],
    affectedCount: 88,
    chain: [
      {
        label: "TRIGGER · -4h",
        text: "VPN concentrator started dropping sessions.",
        tone: "warn",
      },
      {
        label: "RECOVERED · -3h15m",
        text: "Concentrator failed over to secondary.",
        tone: "ok",
      },
    ],
  },
  {
    key: "backup-fail",
    title: "Backup verification failed on 4 devices",
    detail: "Nightly backup integrity check failed on 4 finance devices.",
    severity: "medium",
    lane: "compliance",
    openedMinutesAgo: 480,
    affectedTags: ["finance"],
    affectedCount: 4,
    chain: [
      {
        label: "TRIGGER · -8h",
        text: "Backup verification returned checksum mismatch.",
        tone: "warn",
      },
    ],
    recommendation: {
      title: "Trigger fresh backup and verify",
      detail: "Run manual backup cycle with integrity check. ~12 min per device.",
      confidence: 82,
      reversible: false,
      command: "apply finance",
    },
  },
  {
    key: "canary-panic",
    title: "Canary 14.3 kernel panic on 2 devices",
    detail: "Two canary-channel devices hit a kernel panic after the 14.3 canary push.",
    severity: "high",
    lane: "updates",
    openedMinutesAgo: 90,
    affectedTags: ["engineering"],
    affectedCount: 2,
    chain: [
      {
        label: "TRIGGER · -1h30m",
        text: "macOS 14.3 canary rollout began.",
        tone: "neutral",
      },
      {
        label: "SIDE EFFECT",
        text: "Kernel panic reported on 2 devices during boot.",
        tone: "crit",
      },
    ],
    recommendation: {
      title: "Pause canary rollout",
      detail: "Halt further devices until root cause is identified.",
      confidence: 91,
      reversible: true,
      command: "notify platform",
    },
  },
  {
    key: "shared-loaner",
    title: "Loaner device policy drift",
    detail: "3 loaner devices missing the shared-account policy after re-imaging.",
    severity: "low",
    lane: "compliance",
    openedMinutesAgo: 1200,
    resolvedAfterMinutes: 180,
    affectedTags: ["loaner"],
    affectedCount: 3,
    chain: [
      {
        label: "TRIGGER · -20h",
        text: "Re-imaged loaners came online without the shared policy.",
        tone: "warn",
      },
      {
        label: "RESOLVED · -17h",
        text: "Policy re-applied via automation.",
        tone: "ok",
      },
    ],
  },
  {
    key: "sso-latency",
    title: "SSO login latency spike",
    detail: "Auth provider p95 latency doubled for 12 minutes.",
    severity: "medium",
    lane: "connectivity",
    openedMinutesAgo: 60,
    resolvedAfterMinutes: 12,
    affectedTags: [],
    affectedCount: 340,
    chain: [
      {
        label: "TRIGGER · -1h",
        text: "SSO p95 crossed 800ms threshold.",
        tone: "warn",
      },
      {
        label: "RECOVERED · -48m",
        text: "Provider capacity scaled up.",
        tone: "ok",
      },
    ],
  },
  {
    key: "credential-rotation-lag",
    title: "Credential rotation lag on 6 devices",
    detail: "6 devices missed their scheduled credential rotation window.",
    severity: "low",
    lane: "security",
    openedMinutesAgo: 300,
    affectedTags: ["executive"],
    affectedCount: 6,
    chain: [
      {
        label: "TRIGGER · -5h",
        text: "Rotation window ended with 6 devices offline.",
        tone: "warn",
      },
    ],
    recommendation: {
      title: "Retry rotation when devices check in",
      detail: "Schedule an automation retry for the next 6h.",
      confidence: 78,
      reversible: true,
      command: "rotate executive in 6h",
    },
  },
];

export const INCIDENT_SEVERITY_ORDER: IncidentSeverity[] = [
  "crit",
  "high",
  "medium",
  "low",
];
