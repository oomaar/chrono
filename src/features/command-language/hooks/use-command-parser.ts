"use client";

import { useMemo } from "react";
import { useConsole } from "@/features/console";
import type {
  BlastRadius,
  CommandIntent,
  CommandPlan,
  DryRunPreview,
  PlanResult,
  Suggestion,
  ValidationIssue,
} from "../types/command-language.types";
import { computeBlastRadius } from "../utils/blast-radius";
import { dryRunCommand } from "../utils/dry-run";
import { parseCommand } from "../utils/parse";
import { planCommand } from "../utils/plan";
import { suggestCompletions } from "../utils/suggest";

export type ParsedCommand = {
  input: string;
  cursor: number;
  intent: CommandIntent;
  planResult: PlanResult;
  plan: CommandPlan | null;
  blastRadius: BlastRadius | null;
  dryRun: DryRunPreview | null;
  suggestions: Suggestion[];
  issues: ValidationIssue[];
};

/**
 * Threads raw input through the entire command language pipeline:
 * tokenize → parse → plan → blast → dry-run → suggest. Everything is memoized
 * so re-parsing on each keystroke stays cheap.
 */
export const useCommandParser = (input: string, cursor: number): ParsedCommand => {
  const { db, timeline } = useConsole();
  const nowIso = timeline.now;

  const intent = useMemo(() => parseCommand(input), [input]);
  const planResult = useMemo(() => planCommand(intent, db, nowIso), [intent, db, nowIso]);
  const plan = planResult.ok ? planResult.plan : null;
  const blastRadius = useMemo(
    () => (plan ? computeBlastRadius(plan, db) : null),
    [plan, db],
  );
  const dryRun = useMemo(
    () => (plan && blastRadius ? dryRunCommand(plan, db, nowIso, blastRadius) : null),
    [plan, db, nowIso, blastRadius],
  );
  const suggestions = useMemo(
    () => suggestCompletions({ input, cursor, intent }),
    [input, cursor, intent],
  );

  const issues = planResult.ok ? planResult.plan.issues : planResult.issues;

  return {
    input,
    cursor,
    intent,
    planResult,
    plan,
    blastRadius,
    dryRun,
    suggestions,
    issues,
  };
};
