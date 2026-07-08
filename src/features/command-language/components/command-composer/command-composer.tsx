"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { Kbd, cn, toast } from "@/features/design-system";
import { useConsole } from "@/features/console";
import { useCommandLanguage } from "../../command-language.provider";
import { useCommandParser } from "../../hooks/use-command-parser";
import type { Suggestion } from "../../types/command-language.types";
import { applySuggestion } from "../../utils/suggest";
import { BlastRadiusPreview } from "./blast-radius-preview";
import { DryRunPreviewCard } from "./dry-run-preview";
import { SuggestionList } from "./suggestion-list";
import { SyntaxHighlightedOverlay } from "./syntax-highlighted-overlay";
import { ValidationMessages } from "./validation-messages";

/**
 * The command language composer. Wraps an <input> in a syntax-highlighted
 * overlay, ranks context-sensitive suggestions above it, and renders live
 * preview cards (blast radius + dry-run) below. Pressing Enter commits the
 * plan through the executor.
 */
export function CommandComposer({ onClose }: { onClose?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(0);
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const { timeline } = useConsole();
  const { execute } = useCommandLanguage();
  const parsed = useCommandParser(input, cursor);

  const applyAndFocus = useCallback(
    (suggestion: Suggestion) => {
      const next = applySuggestion(input, cursor, suggestion);
      setInput(next.input);
      setActiveSuggestion(0);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(next.cursor, next.cursor);
        setCursor(next.cursor);
      });
    },
    [input, cursor],
  );

  const handleCommit = useCallback(() => {
    if (!parsed.plan) return;
    const result = execute(parsed.plan);
    if (!result.ok) {
      for (const issue of result.issues) {
        if (issue.severity === "error") toast.error(issue.message);
        else toast(issue.message);
      }
      return;
    }
    const receipt = result.receipt;
    const isFuture = receipt.status === "scheduled";
    toast.success(isFuture ? "Command scheduled" : "Command committed", {
      description: receipt.raw,
    });
    setInput("");
    setCursor(0);
    setActiveSuggestion(0);
    onClose?.();
  }, [execute, onClose, parsed.plan]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { suggestions } = parsed;

      if (event.key === "ArrowDown" && suggestions.length > 0) {
        event.preventDefault();
        setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
        return;
      }

      if (event.key === "ArrowUp" && suggestions.length > 0) {
        event.preventDefault();
        setActiveSuggestion((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === "Tab" && suggestions.length > 0) {
        event.preventDefault();
        applyAndFocus(suggestions[activeSuggestion]);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleCommit();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (input.length > 0) {
          setInput("");
          setCursor(0);
          setActiveSuggestion(0);
          return;
        }
        onClose?.();
        inputRef.current?.blur();
      }
    },
    [activeSuggestion, applyAndFocus, handleCommit, input, onClose, parsed],
  );

  const scopeLabel =
    timeline.mode === "live"
      ? "fleet · now"
      : timeline.mode === "playback"
        ? "fleet · replay"
        : "fleet · scrub";

  const showPreviews = focused && (parsed.plan || parsed.issues.length > 0);
  const suggestionsVisible = focused && parsed.suggestions.length > 0;
  const commitLabel = parsed.plan?.isDryRun
    ? "Dry-run"
    : parsed.plan?.isFuture
      ? "Schedule"
      : "Commit";
  const commitDisabled =
    !parsed.plan ||
    parsed.plan.requiresConfirm ||
    (parsed.plan.affectedDeviceIds.length === 0 &&
      parsed.plan.verb.category === "action");

  return (
    <div className="relative">
      {suggestionsVisible ? (
        <SuggestionList
          suggestions={parsed.suggestions}
          activeIndex={activeSuggestion}
          onHover={setActiveSuggestion}
          onSelect={applyAndFocus}
        />
      ) : null}

      <div
        className={cn(
          "bg-bg group flex h-14 items-center gap-3 rounded-2xl border px-4 transition-colors",
          focused
            ? "border-brand/60 ring-brand/25 ring-2"
            : "border-line hover:border-line-strong",
        )}
      >
        <span className="text-brand flex-none font-mono text-2xl leading-none font-semibold select-none">
          ›
        </span>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <SyntaxHighlightedOverlay tokens={parsed.intent.tokens} />
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setCursor(event.target.selectionStart ?? event.target.value.length);
              setActiveSuggestion(0);
            }}
            onSelect={(event) => {
              setCursor(event.currentTarget.selectionStart ?? 0);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Tell the fleet what to do — or ask what happened…"
            spellCheck={false}
            autoComplete="off"
            className="placeholder:text-ink-3 caret-brand relative w-full bg-transparent font-mono text-[17px] leading-7 text-transparent placeholder:font-sans placeholder:text-[15px] focus:outline-none"
          />
        </div>

        <span className="border-line bg-surface-2 text-ink-2 hidden flex-none items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase sm:flex">
          {scopeLabel}
        </span>
        <Kbd keys={["⌘", "K"]} />
        <button
          type="button"
          onClick={handleCommit}
          disabled={commitDisabled}
          className={cn(
            "flex-none rounded-xl px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.12em] uppercase transition-opacity",
            commitDisabled
              ? "bg-elev text-ink-3 cursor-not-allowed"
              : "bg-brand text-bg hover:opacity-90",
          )}
        >
          {commitLabel}
        </button>
      </div>

      {showPreviews ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {parsed.blastRadius ? <BlastRadiusPreview blast={parsed.blastRadius} /> : null}
          {parsed.dryRun ? (
            <DryRunPreviewCard
              preview={parsed.dryRun}
              isDryRun={Boolean(parsed.plan?.isDryRun)}
            />
          ) : null}
        </div>
      ) : null}

      {parsed.issues.length > 0 && focused ? (
        <div className="mt-2">
          <ValidationMessages issues={parsed.issues} />
        </div>
      ) : null}
    </div>
  );
}
