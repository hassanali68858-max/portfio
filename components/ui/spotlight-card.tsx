"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Card with a soft accent spotlight + border highlight that follows the pointer. */
export function SpotlightCard({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, var(--accent-soft), transparent 65%)`;
  const ring = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)`;
  const Comp = motion[as];

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      onPointerMove={(e: React.PointerEvent) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
      className={cn(
        "group/spot relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-strong",
        className
      )}
    >
      {/* border glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: ring,
          WebkitMask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          padding: 1,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </Comp>
  );
}
