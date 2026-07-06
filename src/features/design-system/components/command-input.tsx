"use client";

import { Search } from "lucide-react";
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Kbd } from "./kbd";

type CommandInputProps = InputHTMLAttributes<HTMLInputElement> & {
  scope?: string;
  suggestion?: string;
  hint?: string;
  leadingIcon?: ReactNode;
  hotkeys?: string[];
};

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  (
    {
      className,
      scope,
      suggestion,
      hint,
      leadingIcon,
      hotkeys = ["⌘", "K"],
      id,
      placeholder = "Tell the fleet what to do — or ask what happened…",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "group border-line bg-surface flex h-11 items-center gap-3 rounded-full border pr-2 pl-4 transition-colors",
            "focus-within:border-line-strong focus-within:ring-brand/25 focus-within:ring-2",
            className,
          )}
        >
          <span className="text-ink-3 flex">{leadingIcon ?? <Search size={14} />}</span>

          {scope ? (
            <span className="border-line bg-surface-2 text-ink-2 flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase">
              {scope}
            </span>
          ) : null}

          <div className="relative flex-1">
            <input
              ref={ref}
              id={inputId}
              placeholder={placeholder}
              className="text-ink placeholder:text-ink-3 w-full bg-transparent text-sm focus:outline-none"
              {...props}
            />
            {suggestion ? (
              <span className="text-ink-3 pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm">
                <span className="invisible">{props.value ?? ""}</span>
                <span>{suggestion}</span>
              </span>
            ) : null}
          </div>

          <Kbd keys={hotkeys} />
        </div>

        {hint ? (
          <p className="text-ink-3 pl-4 font-mono text-[10px] tracking-[0.16em]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

CommandInput.displayName = "CommandInput";
