import type { FakeDb } from "@/features/fake-db";
import type {
  BlastRadius,
  CommandPlan,
  DryRunPreview,
} from "../types/command-language.types";
import { formatTimingOffset } from "./format-timing";

const VERB_VERBIAGE: Record<
  string,
  (args: { deviceCount: number; scope: string }) => string
> = {
  reboot: ({ deviceCount, scope }) => `Reboot ${deviceCount} ${scope} devices.`,
  isolate: ({ deviceCount, scope }) =>
    `Quarantine ${deviceCount} ${scope} devices from the network.`,
  release: ({ deviceCount, scope }) =>
    `Release isolation on ${deviceCount} ${scope} devices.`,
  deploy: ({ deviceCount, scope }) =>
    `Deploy an update to ${deviceCount} ${scope} devices.`,
  restart: ({ deviceCount, scope }) =>
    `Restart the endpoint agent on ${deviceCount} ${scope} devices.`,
  wipe: ({ deviceCount, scope }) => `Wipe ${deviceCount} ${scope} devices.`,
  rotate: ({ deviceCount, scope }) =>
    `Rotate credentials for ${deviceCount} ${scope} devices.`,
  apply: ({ deviceCount, scope }) =>
    `Re-apply the applicable policy on ${deviceCount} ${scope} devices.`,
  investigate: () => `Jump the timeline to the referenced moment.`,
  compare: () => `Pin the two most recent references as A and B for comparison.`,
  explain: () => `Explain what happened at the referenced moment.`,
  notify: ({ scope }) => `Watch ${scope} and notify when the condition matches.`,
  schedule: ({ scope }) => `Schedule the described action against ${scope}.`,
};

/**
 * Produce a human-readable narration of what a plan would do. This drives the
 * dry-run preview card below the command bar.
 */
export const dryRunCommand = (
  plan: CommandPlan,
  db: FakeDb,
  nowIso: string,
  blast: BlastRadius,
): DryRunPreview => {
  const scopeText =
    plan.intent.scopes.map((s) => s.definition.keyword).join(" · ") || "playhead";
  const build = VERB_VERBIAGE[plan.verb.keyword];
  const baseSentence = build
    ? build({ deviceCount: blast.deviceCount, scope: scopeText })
    : `${plan.verb.keyword} ${scopeText}.`;

  const timingText = plan.isFuture
    ? `Scheduled ${formatTimingOffset(plan.effectiveAt, nowIso)}.`
    : "Runs immediately.";

  const effects: string[] = [];
  if (blast.deviceCount > 0) {
    effects.push(`${blast.deviceCount} devices affected.`);
  }
  if (blast.teams.length > 0) {
    effects.push(
      `Spans ${blast.teams.length} team${blast.teams.length === 1 ? "" : "s"}.`,
    );
  }
  if (blast.offices.length > 0) {
    effects.push(
      `Spans ${blast.offices.length} office${blast.offices.length === 1 ? "" : "s"}.`,
    );
  }
  if (plan.reversible) {
    effects.push("Drops a receipt on the timeline · reversible.");
  } else {
    effects.push("Drops a receipt on the timeline · not reversible.");
  }

  const warnings: string[] = [];
  for (const issue of plan.issues) {
    if (issue.severity === "warning") warnings.push(issue.message);
  }
  if (plan.verb.dangerous) {
    warnings.push("This is a destructive action.");
  }

  const affectedIncidents =
    plan.verb.keyword === "investigate" || plan.verb.keyword === "explain"
      ? db.incidents.filter((incident) => !incident.resolvedAt).slice(0, 3)
      : undefined;

  return {
    summary: `${baseSentence} ${timingText}`.trim(),
    effects,
    warnings,
    reversibility: plan.reversible
      ? "reversible"
      : plan.isFuture
        ? "reversible-if-caught"
        : "irreversible",
    affectedIncidents,
  };
};
