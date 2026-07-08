"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Input, Kbd, cn, toast } from "@/features/design-system";
import { useConsole } from "@/features/console";
import { useCommandLanguage } from "../command-language.provider";
import { useCommandParser } from "../hooks/use-command-parser";
import { BlastRadiusDotGrid } from "./command-composer/blast-radius-dot-grid";
import { DryRunPreviewCard } from "./command-composer/dry-run-preview";
import { ValidationMessages } from "./command-composer/validation-messages";

/**
 * Inner sheet content — remounted per command via `key` so local state
 * (confirm text) resets without a state-in-effect hop.
 */
function ExecuteSheetContent({ raw }: { raw: string }) {
  const { db } = useConsole();
  const { closeExecute, execute } = useCommandLanguage();
  const parsed = useCommandParser(raw, raw.length);
  const [confirmText, setConfirmText] = useState("");

  const plan = parsed.plan;
  const isDangerous = Boolean(plan?.requiresConfirm);
  const isFuture = Boolean(plan?.isFuture);
  const verbKeyword = plan?.verb.keyword ?? "";

  const affectedDevices = useMemo(() => {
    if (!plan) return [];
    const idSet = new Set(plan.affectedDeviceIds);
    return db.devices.filter((d) => idSet.has(d.id));
  }, [db, plan]);

  const scopeChips = useMemo(() => {
    if (!plan) return [] as string[];
    const chips: string[] = [];
    for (const scope of plan.intent.scopes) {
      chips.push(scope.definition.description);
    }
    return chips.slice(0, 6);
  }, [plan]);

  const confirmSatisfied = useMemo(() => {
    if (!plan) return false;
    if (!isDangerous) return true;
    return confirmText.trim().toLowerCase() === verbKeyword.toLowerCase();
  }, [plan, isDangerous, confirmText, verbKeyword]);

  const canCommit = Boolean(plan) && confirmSatisfied && !plan?.isDryRun;

  const handleCommit = () => {
    if (!plan || !canCommit) return;
    const result = execute(plan);
    if (!result.ok) {
      for (const issue of result.issues) {
        if (issue.severity === "error") toast.error(issue.message);
        else toast(issue.message);
      }
      return;
    }
    toast.success(
      result.receipt.status === "scheduled" ? "Command scheduled" : "Command committed",
      { description: result.receipt.raw },
    );
    closeExecute();
  };

  return (
    <DialogPrimitive.Content
      onOpenAutoFocus={(event) => {
        // Keep the pin/marker/history in view; don't yank focus to the sheet
        // unless a destructive confirmation input is present.
        if (!isDangerous) event.preventDefault();
      }}
      className={cn(
        "border-line-strong bg-surface fixed bottom-2 left-1/2 z-50 -translate-x-1/2",
        "flex max-h-[calc(100vh-24px)] w-[min(820px,calc(100vw-24px))] flex-col",
        "rounded-t-2xl border border-b-0 p-5 shadow-[0_-24px_60px_rgba(0,0,0,0.55)] outline-none",
        "data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down",
      )}
    >
      <DialogPrimitive.Title className="sr-only">Execute command</DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        Review and commit the command plan.
      </DialogPrimitive.Description>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
          Execute · review before commit
        </span>
        {isDangerous ? (
          <Badge tone="crit">destructive</Badge>
        ) : isFuture ? (
          <Badge tone="brand">scheduled</Badge>
        ) : plan ? (
          <Badge tone="outline">reversible</Badge>
        ) : null}
        <span className="text-ink-3 ml-auto font-mono text-[10px] tracking-[0.14em]">
          {plan?.scopeSummary ?? "invalid plan"}
        </span>
        <DialogPrimitive.Close
          aria-label="Close"
          className="text-ink-3 hover:bg-elev hover:text-ink rounded-full p-1 transition-colors"
        >
          <X size={14} />
        </DialogPrimitive.Close>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        <p className="text-ink font-mono text-sm">{raw || "—"}</p>

        {parsed.issues.length > 0 ? <ValidationMessages issues={parsed.issues} /> : null}

        {plan && affectedDevices.length > 0 ? (
          <section className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
                Blast radius
              </span>
              <span
                className={cn(
                  "font-mono text-base font-semibold tabular-nums",
                  isDangerous ? "text-crit" : "text-ink",
                )}
              >
                {affectedDevices.length.toLocaleString()} devices
              </span>
              <span className="text-ink-2 text-xs">
                {plan.verb.description.toLowerCase()}
              </span>
            </div>
            <BlastRadiusDotGrid devices={affectedDevices} />
            {scopeChips.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {scopeChips.map((chip) => (
                  <span
                    key={chip}
                    className="border-line text-ink-2 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {parsed.dryRun ? (
          <DryRunPreviewCard preview={parsed.dryRun} isDryRun={plan?.isDryRun ?? false} />
        ) : null}

        {isDangerous ? (
          <div className="border-crit/30 bg-crit/5 space-y-2 rounded-xl border p-3">
            <p className="text-crit font-mono text-[10px] tracking-[0.14em] uppercase">
              Type <span className="font-semibold">{verbKeyword}</span> to confirm
            </p>
            <Input
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={verbKeyword}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        ) : null}
      </div>

      <div className="border-line-2 mt-4 flex items-center justify-between gap-3 border-t pt-4">
        <div className="text-ink-3 hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase sm:flex">
          <Kbd>Esc</Kbd> cancel
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={closeExecute}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            size="sm"
            disabled={!canCommit}
            onClick={handleCommit}
          >
            <span className="flex items-center gap-2">
              {isFuture ? "Arm rule" : "Commit"}
              <Kbd className="border-white/25 bg-black/20 text-current">⌘↵</Kbd>
            </span>
          </Button>
        </div>
      </div>
    </DialogPrimitive.Content>
  );
}

/**
 * "Confirm before execute" ceremony — a bottom sheet that rises above the
 * current stage, attached to the command bar it grew from. Any surface can
 * open it via `openExecute(rawCommand)`.
 */
export function ExecuteCommandModal() {
  const { pendingExecuteCommand, closeExecute } = useCommandLanguage();
  const isOpen = pendingExecuteCommand !== null;

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeExecute();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-40 bg-(--theme-scrim) backdrop-blur-sm" />
        {isOpen ? (
          <ExecuteSheetContent key={pendingExecuteCommand} raw={pendingExecuteCommand} />
        ) : null}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
