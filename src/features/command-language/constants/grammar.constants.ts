import type {
  ModifierName,
  ScopeDefinition,
  VerbDefinition,
} from "../types/command-language.types";

// ---------------------------------------------------------------------------
// Verbs
// ---------------------------------------------------------------------------

export const VERBS: VerbDefinition[] = [
  // ---- Present (actions) ----
  {
    keyword: "reboot",
    aliases: ["restart-device"],
    category: "action",
    description: "Reboot devices",
    reversible: false,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "isolate",
    aliases: ["quarantine"],
    category: "action",
    description: "Quarantine devices from the network",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "release",
    aliases: ["unquarantine"],
    category: "action",
    description: "Release isolated devices",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "deploy",
    aliases: ["push"],
    category: "action",
    description: "Deploy an update to devices",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "restart",
    aliases: [],
    category: "action",
    description: "Restart the endpoint agent",
    reversible: false,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "wipe",
    aliases: [],
    category: "action",
    description: "Wipe devices (destructive)",
    reversible: false,
    dangerous: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "rotate",
    aliases: [],
    category: "action",
    description: "Rotate device credentials",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "apply",
    aliases: ["reapply"],
    category: "action",
    description: "Re-apply a policy to devices",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },

  // ---- Past (investigation) ----
  {
    keyword: "investigate",
    aliases: ["inspect"],
    category: "past",
    description: "Jump the timeline to a past moment",
    reversible: false,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "compare",
    aliases: [],
    category: "past",
    description: "Compare two moments on the timeline",
    reversible: false,
    requiresScope: true,
    acceptsTiming: false,
  },
  {
    keyword: "explain",
    aliases: [],
    category: "past",
    description: "Explain what happened at a moment",
    reversible: false,
    requiresScope: true,
    acceptsTiming: true,
  },

  // ---- Future (automation) ----
  {
    keyword: "notify",
    aliases: [],
    category: "future",
    description: "Notify when a condition is met",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },
  {
    keyword: "schedule",
    aliases: [],
    category: "future",
    description: "Schedule an action for later",
    reversible: true,
    requiresScope: true,
    acceptsTiming: true,
  },

  // ---- Provider (operate on the command language itself) ----
  {
    keyword: "undo",
    aliases: ["revert"],
    category: "provider",
    description: "Undo the most recent reversible command",
    reversible: false,
    requiresScope: false,
    acceptsTiming: false,
  },
  {
    keyword: "retry",
    aliases: [],
    category: "provider",
    description: "Re-run the most recent committed command",
    reversible: false,
    requiresScope: false,
    acceptsTiming: false,
  },
];

// ---------------------------------------------------------------------------
// Scopes
// ---------------------------------------------------------------------------

export const SCOPES: ScopeDefinition[] = [
  // offices
  { keyword: "berlin", aliases: [], kind: "office", description: "Berlin office" },
  { keyword: "london", aliases: [], kind: "office", description: "London office" },
  {
    keyword: "nyc",
    aliases: ["new-york"],
    kind: "office",
    description: "New York office",
  },
  { keyword: "singapore", aliases: [], kind: "office", description: "Singapore office" },

  // tags
  { keyword: "finance", aliases: [], kind: "tag", description: "Finance devices" },
  {
    keyword: "engineering",
    aliases: [],
    kind: "tag",
    description: "Engineering devices",
  },
  { keyword: "sales", aliases: [], kind: "tag", description: "Sales devices" },
  { keyword: "design", aliases: [], kind: "tag", description: "Design devices" },
  { keyword: "executive", aliases: [], kind: "tag", description: "Executive devices" },
  { keyword: "field", aliases: [], kind: "tag", description: "Field devices" },
  { keyword: "remote", aliases: [], kind: "tag", description: "Remote workers" },
  { keyword: "hipaa", aliases: [], kind: "tag", description: "HIPAA-scoped devices" },
  { keyword: "sox", aliases: [], kind: "tag", description: "SOX-scoped devices" },
  { keyword: "pci", aliases: [], kind: "tag", description: "PCI-scoped devices" },
  { keyword: "shared", aliases: [], kind: "tag", description: "Shared devices" },
  { keyword: "loaner", aliases: [], kind: "tag", description: "Loaner devices" },

  // statuses
  { keyword: "offline", aliases: [], kind: "status", description: "Offline devices" },
  { keyword: "online", aliases: [], kind: "status", description: "Online devices" },
  { keyword: "degraded", aliases: [], kind: "status", description: "Degraded devices" },
  { keyword: "isolated", aliases: [], kind: "status", description: "Isolated devices" },
  {
    keyword: "non-compliant",
    aliases: ["noncompliant"],
    kind: "status",
    description: "Non-compliant devices",
  },
  {
    keyword: "maintenance",
    aliases: [],
    kind: "status",
    description: "Devices in maintenance",
  },

  // teams
  {
    keyword: "endpoint",
    aliases: ["endpoint-reliability"],
    kind: "team",
    description: "Endpoint Reliability team",
  },
  { keyword: "platform", aliases: [], kind: "team", description: "Client Platform team" },
  {
    keyword: "security",
    aliases: [],
    kind: "team",
    description: "Security Response team",
  },
  { keyword: "compliance", aliases: [], kind: "team", description: "Compliance team" },

  // all
  {
    keyword: "all",
    aliases: ["fleet", "everything"],
    kind: "all",
    description: "All devices",
  },
];

// ---------------------------------------------------------------------------
// Modifiers
// ---------------------------------------------------------------------------

export const MODIFIERS: Array<{
  name: ModifierName;
  aliases: string[];
  description: string;
  acceptsValue: boolean;
}> = [
  {
    name: "dry-run",
    aliases: ["dry", "preview"],
    description: "Preview without committing",
    acceptsValue: false,
  },
  {
    name: "force",
    aliases: [],
    description: "Bypass warnings",
    acceptsValue: false,
  },
  {
    name: "confirm",
    aliases: [],
    description: "Confirm a destructive command",
    acceptsValue: false,
  },
  {
    name: "priority",
    aliases: ["prio"],
    description: "Set priority (high | medium | low)",
    acceptsValue: true,
  },
];

// ---------------------------------------------------------------------------
// Timing keywords
// ---------------------------------------------------------------------------

export const TIMING_KEYWORDS = ["now", "in", "at", "tomorrow", "when"] as const;

// ---------------------------------------------------------------------------
// Suggestion examples (shown when input is empty)
// ---------------------------------------------------------------------------

export const EXAMPLE_COMMANDS: string[] = [
  "reboot berlin",
  "isolate atlas-441",
  "deploy finance in 30m",
  "investigate outage",
  "schedule apply hipaa tomorrow at 02:00",
  "notify when offline > 5",
];
