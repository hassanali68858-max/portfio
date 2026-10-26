"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium whitespace-nowrap select-none transition-[background-color,color,box-shadow,border-color] duration-300 ease-out-expo focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg shadow-[0_0_0_1px_var(--border-strong),0_8px_24px_-8px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:shadow-[0_0_0_1px_var(--accent),0_12px_36px_-8px_color-mix(in_oklab,var(--accent)_80%,transparent)]",
  secondary:
    "glass border border-line-strong text-fg hover:border-fg/30 hover:bg-surface-2",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Sheen that sweeps across the button on hover */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover/btn:translate-x-full dark:via-black/10"
    />
  );
}

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", magnetic = false, className, children, ...props },
  ref
) {
  const el = (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {variant === "primary" && <Sheen />}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
});

type LinkButtonProps = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >;

export function LinkButton({
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  children,
  href,
  ...props
}: LinkButtonProps) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {variant === "primary" && <Sheen />}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );
  const el = external ? (
    <a href={href} className={cls} {...props}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} {...props}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

/** Arrow that nudges diagonally on parent hover */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-4 w-4 overflow-hidden", className)} aria-hidden>
      <svg
        viewBox="0 0 16 16"
        className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-4 group-hover/btn:-translate-y-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
      </svg>
      <svg
        viewBox="0 0 16 16"
        className="absolute inset-0 h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
      </svg>
    </span>
  );
}
