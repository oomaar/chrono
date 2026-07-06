"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      required,
      disabled,
      leadingIcon,
      trailingIcon,
      id,
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

        <div
          className={cn(
            "border-line bg-surface flex h-9 items-center gap-2 rounded-lg border px-3 transition-colors",
            "focus-within:border-line-strong focus-within:ring-brand/25 focus-within:ring-2",
            hasError && "border-crit focus-within:border-crit focus-within:ring-crit/25",
            disabled && "opacity-50",
          )}
        >
          {leadingIcon ? <span className="text-ink-3 flex">{leadingIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            className={cn(
              "text-ink placeholder:text-ink-3 flex-1 bg-transparent text-sm focus:outline-none disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {trailingIcon ? <span className="text-ink-3 flex">{trailingIcon}</span> : null}
        </div>

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

Input.displayName = "Input";
