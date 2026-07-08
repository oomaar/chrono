"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TIMELINE_EVENT_KIND_TONE } from "@/features/fake-db";
import type { TimelineEvent } from "@/features/fake-db";
import { useConsole } from "@/features/console";
import type {
  CommandPlan,
  CommandReceipt,
  ExecuteResult,
  ValidationIssue,
} from "./types/command-language.types";

// ---------------------------------------------------------------------------

export type CommandLanguageContextValue = {
  history: CommandReceipt[];
  scheduled: CommandReceipt[];
  timelineEvents: TimelineEvent[];
  execute: (plan: CommandPlan) => ExecuteResult;
  undo: (receiptId: string) => void;
  cancelScheduled: (receiptId: string) => void;
  clearHistory: () => void;
  isUndoable: (receiptId: string) => boolean;
  /** Currently pending "review before execute" prompt, if any. */
  pendingExecuteCommand: string | null;
  /** Open the execute modal seeded with a canonical command string. */
  openExecute: (raw: string) => void;
  /** Close the execute modal (cancel). */
  closeExecute: () => void;
};

const CommandLanguageContext = createContext<CommandLanguageContextValue | null>(null);

// ---------------------------------------------------------------------------

const receiptToTimelineEvent = (receipt: CommandReceipt): TimelineEvent =>
  receipt.timelineEvent;

const buildTimelineEvent = (
  plan: CommandPlan,
  status: "committed" | "scheduled",
  timestamp: string,
): TimelineEvent => {
  const kind =
    plan.verb.category === "past"
      ? "command-executed"
      : status === "scheduled"
        ? "automation-scheduled"
        : "command-executed";
  return {
    id: `receipt_${Math.random().toString(36).slice(2, 10)}`,
    kind,
    lane:
      plan.verb.keyword === "isolate" ||
      plan.verb.keyword === "release" ||
      plan.verb.keyword === "wipe" ||
      plan.verb.keyword === "rotate"
        ? "security"
        : plan.verb.keyword === "deploy"
          ? "updates"
          : plan.verb.keyword === "apply"
            ? "compliance"
            : plan.verb.category === "future"
              ? "automation"
              : "fleet",
    tone: TIMELINE_EVENT_KIND_TONE[kind],
    timestamp,
    summary: `${plan.verb.keyword} ${plan.scopeSummary}`,
    deviceIds: plan.affectedDeviceIds.slice(0, 3),
    reversible: plan.reversible,
    future: status === "scheduled",
  };
};

const missingReceiptIssue = (message: string): ValidationIssue => ({
  severity: "error",
  message,
});

// ---------------------------------------------------------------------------

export function CommandLanguageProvider({ children }: { children: ReactNode }) {
  const { engine, timeline } = useConsole();
  const [receipts, setReceipts] = useState<CommandReceipt[]>([]);
  const [pendingExecuteCommand, setPendingExecuteCommand] = useState<string | null>(null);

  const openExecute = useCallback((raw: string) => {
    setPendingExecuteCommand(raw);
  }, []);

  const closeExecute = useCallback(() => {
    setPendingExecuteCommand(null);
  }, []);

  const undo = useCallback(
    (receiptId: string) => {
      const nowIso = engine.clock.now();
      setReceipts((current) =>
        current.map((receipt) => {
          if (receipt.id !== receiptId) return receipt;
          if (!receipt.reversible || receipt.status === "reverted") return receipt;
          return { ...receipt, status: "reverted", revertedAt: nowIso };
        }),
      );
    },
    [engine.clock],
  );

  const executeDirect = useCallback(
    (plan: CommandPlan): ExecuteResult => {
      // Provider verbs — undo / retry — operate on the history queue itself.
      if (plan.providerAction) {
        const action = plan.providerAction;

        if (action.kind === "undo") {
          const target =
            action.targetReceiptId ??
            receipts.find(
              (r) => r.reversible && (r.status === "committed" || r.status === "fired"),
            )?.id;
          if (!target) {
            return {
              ok: false,
              issues: [missingReceiptIssue("No reversible command to undo.")],
            };
          }
          undo(target);
        } else if (action.kind === "retry") {
          const target =
            action.targetReceiptId ??
            receipts.find((r) => r.status === "committed" || r.status === "fired")?.id;
          const source = receipts.find((r) => r.id === target);
          if (!source) {
            return {
              ok: false,
              issues: [missingReceiptIssue("No command to retry.")],
            };
          }
          // Re-emit a copy with a new id + timestamp.
          const nowIso = engine.clock.now();
          const cloned: CommandReceipt = {
            ...source,
            id: `receipt_${Math.random().toString(36).slice(2, 10)}`,
            status: "committed",
            createdAt: nowIso,
            firedAt: nowIso,
            effectiveAt: nowIso,
            revertedAt: undefined,
            cancelledAt: undefined,
            timelineEvent: {
              ...source.timelineEvent,
              id: `receipt_${Math.random().toString(36).slice(2, 10)}`,
              timestamp: nowIso,
              future: false,
            },
          };
          setReceipts((current) => [cloned, ...current]);
          return { ok: true, receipt: cloned };
        }

        // Emit a receipt for the provider action so it shows in history.
        const nowIso = engine.clock.now();
        const receipt: CommandReceipt = {
          id: `receipt_${Math.random().toString(36).slice(2, 10)}`,
          raw: plan.intent.raw,
          verb: plan.verb.keyword,
          scopeSummary: plan.scopeSummary,
          affectedDeviceIds: [],
          reversible: false,
          status: "committed",
          createdAt: nowIso,
          effectiveAt: nowIso,
          firedAt: nowIso,
          timelineEvent: buildTimelineEvent(plan, "committed", nowIso),
        };
        setReceipts((current) => [receipt, ...current]);
        return { ok: true, receipt };
      }

      if (plan.requiresConfirm) {
        return {
          ok: false,
          issues: [
            {
              severity: "error",
              message: `${plan.verb.keyword} is destructive. Add --confirm to commit.`,
            },
          ],
        };
      }
      if (plan.isDryRun) {
        return {
          ok: false,
          issues: [{ severity: "warning", message: `Dry-run — nothing committed.` }],
        };
      }

      // Past verbs — navigate the timeline.
      if (plan.timelineAction) {
        const action = plan.timelineAction;
        if (action.kind === "scrub-to" || action.kind === "explain") {
          timeline.setPlayhead(action.targetIso, { mode: "scrubbing" });
        } else if (action.kind === "pin-compare") {
          timeline.pinAt("A", action.pinAIso);
          timeline.pinAt("B", action.pinBIso);
          timeline.setPlayhead(action.pinAIso, { mode: "scrubbing" });
        }
      }

      const nowIso = engine.clock.now();
      const status: CommandReceipt["status"] = plan.isFuture ? "scheduled" : "committed";
      const timelineEvent = buildTimelineEvent(
        plan,
        status === "scheduled" ? "scheduled" : "committed",
        plan.effectiveAt,
      );
      const receipt: CommandReceipt = {
        id: timelineEvent.id,
        raw: plan.intent.raw,
        verb: plan.verb.keyword,
        scopeSummary: plan.scopeSummary,
        affectedDeviceIds: plan.affectedDeviceIds,
        reversible: plan.reversible,
        status,
        createdAt: nowIso,
        effectiveAt: plan.effectiveAt,
        firedAt: status === "committed" ? nowIso : undefined,
        timelineEvent,
      };
      setReceipts((current) => [receipt, ...current]);
      return { ok: true, receipt };
    },
    [engine.clock, receipts, timeline, undo],
  );

  const cancelScheduled = useCallback(
    (receiptId: string) => {
      const nowIso = engine.clock.now();
      setReceipts((current) =>
        current.map((receipt) => {
          if (receipt.id !== receiptId) return receipt;
          if (receipt.status !== "scheduled") return receipt;
          return { ...receipt, status: "cancelled", cancelledAt: nowIso };
        }),
      );
    },
    [engine.clock],
  );

  const clearHistory = useCallback(() => {
    setReceipts([]);
  }, []);

  // Fire scheduled commands when the clock crosses their effectiveAt.
  useEffect(() => {
    const clock = engine.clock;
    const check = (now: string) => {
      setReceipts((current) => {
        let changed = false;
        const next = current.map((receipt) => {
          if (receipt.status !== "scheduled") return receipt;
          if (receipt.effectiveAt > now) return receipt;
          changed = true;
          return {
            ...receipt,
            status: "fired" as const,
            firedAt: now,
            timelineEvent: {
              ...receipt.timelineEvent,
              future: false,
              timestamp: now,
            },
          };
        });
        return changed ? next : current;
      });
    };
    check(clock.now());
    return clock.subscribe(check);
  }, [engine.clock]);

  const scheduled = useMemo(
    () => receipts.filter((receipt) => receipt.status === "scheduled"),
    [receipts],
  );

  const timelineEvents = useMemo(
    () =>
      receipts
        .filter(
          (receipt) => receipt.status !== "cancelled" && receipt.status !== "reverted",
        )
        .map(receiptToTimelineEvent),
    [receipts],
  );

  const isUndoable = useCallback(
    (receiptId: string) => {
      const receipt = receipts.find((r) => r.id === receiptId);
      return Boolean(
        receipt &&
        receipt.reversible &&
        (receipt.status === "committed" || receipt.status === "fired"),
      );
    },
    [receipts],
  );

  const value = useMemo<CommandLanguageContextValue>(
    () => ({
      history: receipts,
      scheduled,
      timelineEvents,
      execute: executeDirect,
      undo,
      cancelScheduled,
      clearHistory,
      isUndoable,
      pendingExecuteCommand,
      openExecute,
      closeExecute,
    }),
    [
      receipts,
      scheduled,
      timelineEvents,
      executeDirect,
      undo,
      cancelScheduled,
      clearHistory,
      isUndoable,
      pendingExecuteCommand,
      openExecute,
      closeExecute,
    ],
  );

  return (
    <CommandLanguageContext.Provider value={value}>
      {children}
    </CommandLanguageContext.Provider>
  );
}

export function useCommandLanguage(): CommandLanguageContextValue {
  const context = useContext(CommandLanguageContext);
  if (!context) {
    throw new Error("useCommandLanguage must be used within a CommandLanguageProvider");
  }
  return context;
}
