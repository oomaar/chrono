import type { Device, Incident, TimelineEvent } from "@/features/fake-db";

// ============================================================================
// GRAMMAR
// ============================================================================

export type VerbCategory = "action" | "past" | "future" | "provider";

export type VerbDefinition = {
  keyword: string;
  aliases: string[];
  category: VerbCategory;
  /** Human-readable description used in suggestions. */
  description: string;
  /** Whether the verb produces reversible commands. */
  reversible: boolean;
  /** Whether the verb is destructive (requires --confirm). */
  dangerous?: boolean;
  /** Whether the verb requires a scope. */
  requiresScope: boolean;
  /** Whether the verb accepts a timing clause. */
  acceptsTiming: boolean;
};

export type ScopeKind =
  "office" | "tag" | "status" | "team" | "host" | "entity" | "all" | "unknown";

export type EntityKind =
  | "incident"
  | "update"
  | "command"
  | "receipt"
  | "automation"
  | "policy"
  | "device"
  | "team"
  | "office"
  | "user";

export type ScopeDefinition = {
  keyword: string;
  aliases: string[];
  kind: ScopeKind;
  description: string;
  /** For entity scopes: parsed kind + id (e.g. { kind: "incident", id: "incident_3" }). */
  entity?: { kind: EntityKind; id: string };
};

export type ModifierName = "dry-run" | "force" | "confirm" | "priority";

export type TimingKind = "now" | "in" | "at" | "tomorrow" | "when";

// ============================================================================
// TOKENS
// ============================================================================

export type TokenRole =
  | "verb"
  | "scope"
  | "modifier"
  | "modifier-value"
  | "timing-keyword"
  | "timing-value"
  | "unknown"
  | "whitespace";

export type Token = {
  role: TokenRole;
  text: string;
  start: number;
  end: number;
  matched?: string;
};

// ============================================================================
// INTENT (parsed AST-lite)
// ============================================================================

export type CommandIntent = {
  raw: string;
  tokens: Token[];
  verb: VerbDefinition | null;
  verbToken: Token | null;
  scopes: Array<{ token: Token; definition: ScopeDefinition }>;
  timing: {
    kind: TimingKind;
    text: string;
    offsetMinutes?: number;
    tokens: Token[];
  } | null;
  modifiers: Array<{ name: ModifierName; value?: string; token: Token }>;
  unknownTokens: Token[];
};

// ============================================================================
// PLAN + VALIDATION
// ============================================================================

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  severity: ValidationSeverity;
  message: string;
  tokenStart?: number;
  tokenEnd?: number;
};

export type TimelineAction =
  | { kind: "scrub-to"; targetIso: string; entityId?: string }
  | {
      kind: "pin-compare";
      pinAIso: string;
      pinBIso: string;
      entityIds: string[];
    }
  | { kind: "explain"; targetIso: string; entityId?: string };

export type ProviderAction =
  | { kind: "undo"; targetReceiptId?: string }
  | { kind: "retry"; targetReceiptId?: string };

export type CommandPlan = {
  intent: CommandIntent;
  verb: VerbDefinition;
  affectedDeviceIds: string[];
  scopeSummary: string;
  effectiveAt: string;
  isFuture: boolean;
  isDryRun: boolean;
  requiresConfirm: boolean;
  reversible: boolean;
  issues: ValidationIssue[];
  /** Populated when the verb is a past verb — instructs the timeline. */
  timelineAction?: TimelineAction;
  /** Populated when the verb is a provider verb (undo/retry). */
  providerAction?: ProviderAction;
};

export type PlanResult =
  | { ok: true; plan: CommandPlan }
  | { ok: false; issues: ValidationIssue[]; intent: CommandIntent };

// ============================================================================
// BLAST RADIUS + DRY RUN
// ============================================================================

export type BlastRadius = {
  deviceCount: number;
  sampleDevices: Device[];
  teams: string[];
  offices: string[];
  policiesTouched: string[];
  reversible: boolean;
};

export type DryRunPreview = {
  summary: string;
  effects: string[];
  warnings: string[];
  reversibility: "reversible" | "irreversible" | "reversible-if-caught";
  affectedIncidents?: Incident[];
};

// ============================================================================
// SUGGESTIONS + AUTOCOMPLETE
// ============================================================================

export type SuggestionKind = "verb" | "scope" | "modifier" | "timing" | "example";

export type Suggestion = {
  id: string;
  kind: SuggestionKind;
  label: string;
  description?: string;
  /** The full text that should replace the current word / cursor context. */
  insertText: string;
  /** Ranking score — higher = better. */
  score: number;
};

// ============================================================================
// EXECUTION
// ============================================================================

export type CommandReceiptStatus =
  "committed" | "scheduled" | "reverted" | "cancelled" | "fired";

export type CommandReceipt = {
  id: string;
  raw: string;
  verb: string;
  scopeSummary: string;
  affectedDeviceIds: string[];
  reversible: boolean;
  status: CommandReceiptStatus;
  createdAt: string;
  effectiveAt: string;
  firedAt?: string;
  revertedAt?: string;
  cancelledAt?: string;
  /** Synthetic timeline event associated with the receipt (for merging). */
  timelineEvent: TimelineEvent;
};

export type ExecuteResult =
  { ok: true; receipt: CommandReceipt } | { ok: false; issues: ValidationIssue[] };
