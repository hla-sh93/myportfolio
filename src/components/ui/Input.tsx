"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Rendered as a <label> above the field */
  label?: string;
  /** Error message rendered below the field (also sets aria-invalid) */
  error?: string;
  /** An optional leading icon rendered inside the input */
  icon?: React.ReactNode;
  className?: string;
  /** Extra class applied to the outer wrapper div */
  wrapperClassName?: string;
  /** "line": Drake underline-only field with uppercase label */
  variant?: "default" | "line";
}

// ─── Component ──────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      className,
      wrapperClassName,
      disabled,
      type = "text",
      variant = "default",
      ...rest
    },
    ref
  ) => {
    // Stable id for label association — prefer the field name so the id is
    // identical on server and client (useId can drift across environments)
    const generatedId = useId();
    const id = rest.id ?? (rest.name ? `field-${rest.name}` : generatedId);

    const hasError = Boolean(error);

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={
              variant === "line"
                ? "text-xs font-semibold uppercase tracking-[0.14em] text-text-primary"
                : "text-sm font-medium text-text-secondary"
            }
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Leading icon */}
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 flex items-center text-text-tertiary"
            >
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={cn(
              variant === "line"
                ? "input-line"
                : cn(
                    // Base glass style
                    "w-full rounded-xl border border-border bg-glass-bg",
                    "px-4 py-2.5 text-sm text-text-primary",
                    "placeholder:text-text-tertiary",
                    "backdrop-blur-sm",
                    // Focus ring
                    "outline-none transition-all duration-200",
                    "focus:border-accent focus:ring-2 focus:ring-accent/30"
                  ),
              // Leading icon padding offset
              icon && "pl-10",
              // Error state
              hasError &&
                (variant === "line"
                  ? "border-red-500/70"
                  : "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"),
              // Disabled
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            {...rest}
          />
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
