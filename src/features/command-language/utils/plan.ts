import type { Device, FakeDb } from "@/features/fake-db";
import type {
  CommandIntent,
  PlanResult,
  ProviderAction,
  ScopeDefinition,
  TimelineAction,
  ValidationIssue,
} from "../types/command-language.types";
import { parseTimingClause, resolveEffectiveAt } from "./format-timing";

const OFFICE_ID_BY_KEYWORD: Record<string, string> = {
  berlin: "office_berlin",
  london: "office_london",
  nyc: "office_nyc",
  singapore: "office_singapore",
};

const TEAM_ID_BY_KEYWORD: Record<string, string> = {
  endpoint: "team_endpoint",
  platform: "team_platform",
  security: "team_security",
  compliance: "team_compliance",
  field: "team_field",
};

/** Resolve one scope to concrete devices. Entity scopes return the devices
 *  attached to the entity (e.g. an incident's affected devices). */
const resolveScope = (scope: ScopeDefinition, db: FakeDb): Device[] => {
  switch (scope.kind) {
    case "all":
      return db.devices;
    case "office": {
      const officeId = OFFICE_ID_BY_KEYWORD[scope.keyword];
      if (!officeId) return [];
      return db.devices.filter((device) => device.officeId === officeId);
    }
    case "team": {
      const teamId = TEAM_ID_BY_KEYWORD[scope.keyword];
      if (!teamId) return [];
      return db.devices.filter((device) => device.teamId === teamId);
    }
    case "tag":
      return db.devices.filter((device) => device.tags.includes(scope.keyword));
    case "status":
      return db.devices.filter((device) => device.status === scope.keyword);
    case "host": {
      const pattern = scope.keyword.replace("*", ".*");
      const regex = new RegExp(`^${pattern}$`, "i");
      return db.devices.filter((device) => regex.test(device.host));
    }
    case "entity": {
      if (!scope.entity) return [];
      if (scope.entity.kind === "incident") {
        const incident = db.incidents.find((i) => i.id === scope.entity!.id);
        if (!incident) return [];
        return db.devices.filter((d) => incident.affectedDeviceIds.includes(d.id));
      }
      if (scope.entity.kind === "device") {
        const device = db.devices.find((d) => d.id === scope.entity!.id);
        return device ? [device] : [];
      }
      return [];
    }
    default:
      return [];
  }
};

/** Resolve an entity id to a (timestamp, entityId) anchor for past verbs. */
const resolveEntityAnchor = (
  scope: ScopeDefinition,
  db: FakeDb,
): { targetIso: string; entityId: string } | null => {
  if (scope.kind !== "entity" || !scope.entity) return null;
  const { kind, id } = scope.entity;
  switch (kind) {
    case "incident": {
      const incident = db.incidents.find((i) => i.id === id);
      return incident ? { targetIso: incident.openedAt, entityId: incident.id } : null;
    }
    case "update": {
      const update = db.updates.find((u) => u.id === id);
      return update ? { targetIso: update.startedAt, entityId: update.id } : null;
    }
    case "command": {
      const command = db.commands.find((c) => c.id === id);
      return command ? { targetIso: command.executedAt, entityId: command.id } : null;
    }
    case "automation": {
      const automation = db.automations.find((a) => a.id === id);
      return automation
        ? {
            targetIso: automation.lastFiredAt ?? automation.createdAt,
            entityId: automation.id,
          }
        : null;
    }
    case "policy": {
      const policy = db.policies.find((p) => p.id === id);
      return policy ? { targetIso: policy.createdAt, entityId: policy.id } : null;
    }
    default:
      return null;
  }
};

const uniqueBy = <T, K>(items: T[], keyOf: (item: T) => K): T[] => {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyOf(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
};

const summarizeScopes = (intent: CommandIntent, deviceCount: number): string => {
  if (intent.scopes.length === 0) return `${deviceCount} devices`;
  const parts = intent.scopes.map(({ definition }) => definition.keyword);
  return `${parts.join(" · ")} (${deviceCount} devices)`;
};

// ---------------------------------------------------------------------------
// Provider verbs (undo / retry) — don't touch the fake-db, don't require scope.
// ---------------------------------------------------------------------------

const planProviderVerb = (intent: CommandIntent, nowIso: string): PlanResult => {
  const verb = intent.verb!;
  const receiptScope = intent.scopes.find((s) => s.definition.entity?.kind === "receipt");
  const providerAction: ProviderAction =
    verb.keyword === "undo"
      ? { kind: "undo", targetReceiptId: receiptScope?.definition.entity?.id }
      : { kind: "retry", targetReceiptId: receiptScope?.definition.entity?.id };

  return {
    ok: true,
    plan: {
      intent,
      verb,
      affectedDeviceIds: [],
      scopeSummary: receiptScope ? receiptScope.definition.entity!.id : "most recent",
      effectiveAt: nowIso,
      isFuture: false,
      isDryRun: false,
      requiresConfirm: false,
      reversible: false,
      issues: [],
      providerAction,
    },
  };
};

// ---------------------------------------------------------------------------
// Past verbs (investigate / compare / explain) — navigate the timeline.
// ---------------------------------------------------------------------------

const planPastVerb = (intent: CommandIntent, db: FakeDb, nowIso: string): PlanResult => {
  const verb = intent.verb!;
  const issues: ValidationIssue[] = [];

  const entityAnchors = intent.scopes
    .map((s) => resolveEntityAnchor(s.definition, db))
    .filter((anchor): anchor is { targetIso: string; entityId: string } =>
      Boolean(anchor),
    );

  let timelineAction: TimelineAction | undefined;
  let effectiveAt = nowIso;
  let scopeSummary = "playhead";
  let affectedDeviceIds: string[] = [];

  if (verb.keyword === "compare") {
    if (entityAnchors.length < 2) {
      issues.push({
        severity: "error",
        message: `compare needs two entity references (e.g. compare incident_3 incident_5).`,
      });
      return { ok: false, issues, intent };
    }
    const [a, b] = entityAnchors;
    timelineAction = {
      kind: "pin-compare",
      pinAIso: a.targetIso,
      pinBIso: b.targetIso,
      entityIds: [a.entityId, b.entityId],
    };
    effectiveAt = a.targetIso;
    scopeSummary = `${a.entityId} → ${b.entityId}`;
  } else if (entityAnchors.length > 0) {
    const [first] = entityAnchors;
    timelineAction = {
      kind: verb.keyword === "explain" ? "explain" : "scrub-to",
      targetIso: first.targetIso,
      entityId: first.entityId,
    };
    effectiveAt = first.targetIso;
    scopeSummary = first.entityId;
    // For incident scopes, surface affected devices for the blast radius panel
    const scoped = intent.scopes.flatMap((s) => resolveScope(s.definition, db));
    affectedDeviceIds = uniqueBy(scoped, (d) => d.id).map((d) => d.id);
  } else if (intent.unknownTokens.length > 0) {
    // Fuzzy topic like "investigate outage" — best-match against incident titles.
    const keyword = intent.unknownTokens
      .map((t) => t.text)
      .join(" ")
      .toLowerCase();
    const match = db.incidents.find((incident) =>
      incident.title.toLowerCase().includes(keyword),
    );
    if (match) {
      timelineAction = {
        kind: verb.keyword === "explain" ? "explain" : "scrub-to",
        targetIso: match.openedAt,
        entityId: match.id,
      };
      effectiveAt = match.openedAt;
      scopeSummary = `${match.id} · "${keyword}"`;
      affectedDeviceIds = match.affectedDeviceIds;
    } else {
      issues.push({
        severity: "warning",
        message: `No moment matched "${keyword}". Targeting the current playhead.`,
      });
    }
  } else {
    issues.push({
      severity: "warning",
      message: `${verb.keyword} without a target will focus the current playhead.`,
    });
  }

  return {
    ok: true,
    plan: {
      intent,
      verb,
      affectedDeviceIds,
      scopeSummary,
      effectiveAt,
      isFuture: false,
      isDryRun: intent.modifiers.some((m) => m.name === "dry-run"),
      requiresConfirm: false,
      reversible: verb.reversible,
      issues,
      timelineAction,
    },
  };
};

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

/**
 * Resolve a CommandIntent into an executable CommandPlan, or return a list of
 * validation issues explaining why not. Validation is *never* silent — every
 * problem produces a targeted issue with token positions when possible.
 */
export const planCommand = (
  intent: CommandIntent,
  db: FakeDb,
  nowIso: string,
): PlanResult => {
  const issues: ValidationIssue[] = [];

  if (!intent.verb) {
    if (intent.raw.trim().length > 0) {
      issues.push({
        severity: "error",
        message: `Unknown verb "${intent.unknownTokens[0]?.text ?? intent.raw.trim()}"`,
        tokenStart: intent.unknownTokens[0]?.start,
        tokenEnd: intent.unknownTokens[0]?.end,
      });
    } else {
      issues.push({ severity: "error", message: "Start with a verb." });
    }
    return { ok: false, issues, intent };
  }

  const verb = intent.verb;

  if (verb.category === "provider") {
    return planProviderVerb(intent, nowIso);
  }

  if (verb.category === "past") {
    return planPastVerb(intent, db, nowIso);
  }

  if (verb.requiresScope && intent.scopes.length === 0) {
    issues.push({
      severity: "error",
      message: `${verb.keyword} needs a scope (office, tag, status, hostname, or "all").`,
      tokenStart: intent.verbToken?.end,
      tokenEnd: intent.verbToken?.end,
    });
    return { ok: false, issues, intent };
  }

  for (const unknown of intent.unknownTokens) {
    issues.push({
      severity: "warning",
      message: `"${unknown.text}" is not a recognized scope, modifier, or timing keyword.`,
      tokenStart: unknown.start,
      tokenEnd: unknown.end,
    });
  }

  const affected = uniqueBy(
    intent.scopes.flatMap(({ definition }) => resolveScope(definition, db)),
    (device) => device.id,
  );

  if (verb.requiresScope && affected.length === 0) {
    issues.push({
      severity: "error",
      message: `Scope resolved to zero devices.`,
    });
    return { ok: false, issues, intent };
  }

  const timingParsed = intent.timing
    ? parseTimingClause(intent.timing.text)
    : { kind: "now" as const, offsetMinutes: 0 };
  const effectiveAt = resolveEffectiveAt(nowIso, timingParsed);
  const isFuture = new Date(effectiveAt).getTime() > new Date(nowIso).getTime();
  const isDryRun = intent.modifiers.some((m) => m.name === "dry-run");
  const requiresConfirm =
    Boolean(verb.dangerous) && !intent.modifiers.some((m) => m.name === "confirm");

  if (requiresConfirm) {
    issues.push({
      severity: "warning",
      message: `${verb.keyword} is destructive. Add --confirm to commit.`,
    });
  }

  return {
    ok: true,
    plan: {
      intent,
      verb,
      affectedDeviceIds: affected.map((d) => d.id),
      scopeSummary: summarizeScopes(intent, affected.length),
      effectiveAt,
      isFuture,
      isDryRun,
      requiresConfirm,
      reversible: verb.reversible,
      issues,
    },
  };
};
