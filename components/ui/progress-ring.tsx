"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Counter } from "./counter";

interface ProgressRingProps {
  value: number;
  label: string;
  detail?: string;
  delay?: number;
}

export function ProgressRing({ value, label, detail, delay = 0 }: ProgressRingProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const id = useId();
  const r = 44;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-32 w-32">
        <svg ref={ref} viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
          <defs>
            <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-2)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
          {/* tick marks */}
          {Array.from({ length: 40 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="2"
              x2="50"
              y2={i % 5 === 0 ? 5 : 3.5}
              stroke="var(--border-strong)"
              strokeWidth="0.6"
              transform={`rotate(${i * 9} 50 50)`}
            />
          ))}
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#g${id})`}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? value / 100 : 0 }}
            transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 60%, transparent))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold tracking-tight">
          <Counter value={value} suffix="%" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-fg">{label}</p>
      {detail && <p className="mt-1 font-mono text-[11px] text-subtle">{detail}</p>}
    </div>
  );
}
