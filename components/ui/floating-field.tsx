"use client";

import { forwardRef, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Base = {
  label: string;
  error?: string;
  valid?: boolean;
  multiline?: boolean;
};

type Props = Base &
  (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>);

/** Input / textarea with a floating label and animated validation states. */
export const FloatingField = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(function FloatingField(
  { label, error, valid, multiline, className, ...props },
  ref
) {
  const id = useId();
  const errId = `${id}-err`;
  const field = cn(
    "peer w-full rounded-2xl border bg-surface px-4 pt-6 pb-2.5 text-[15px] text-fg outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent",
    "focus:bg-surface-2 focus:shadow-[0_0_0_4px_var(--accent-soft)]",
    error ? "border-red-500/60 focus:border-red-500" : valid ? "border-emerald-500/40 focus:border-accent" : "border-line hover:border-line-strong focus:border-accent",
    multiline && "min-h-[148px] resize-none",
    className
  );

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          placeholder={label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          className={field}
          data-lenis-prevent
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          placeholder={label}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          className={field}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-2 left-4 origin-left text-xs text-subtle transition-all duration-300 ease-out-expo",
          "peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px]",
          "peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent",
          error && "text-red-500 peer-focus:text-red-500"
        )}
      >
        {label}
      </label>

      <AnimatePresence>
        {valid && !error && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
            className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
            aria-hidden
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errId}
            role="alert"
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden pt-1.5 pl-1 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
