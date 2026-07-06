"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      required,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="text-ink-3 font-mono text-[10px] tracking-[0.16em] uppercase"
          >
            {label}
            {required ? <span className="text-crit ml-1">*</span> : null}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={cn(
            "border-line bg-surface text-ink placeholder:text-ink-3 w-full resize-y rounded-lg border px-3 py-2 text-sm transition-colors",
            "focus:border-line-strong focus:ring-brand/25 focus:ring-2 focus:outline-none",
            hasError && "border-crit focus:border-crit focus:ring-crit/25",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          {...props}
        />

        {hasError ? (
          <p id={errorId} className="text-crit text-xs">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-ink-3 text-xs">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
