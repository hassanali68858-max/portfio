"use client";

import { motion } from "motion/react";

export function SkillBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div className="group">
      <div className="mb-2.5 flex items-baseline justify-between gap-4 text-sm">
        <span className="text-fg/90 transition-colors group-hover:text-fg">{label}</span>
        <span className="font-mono text-xs text-subtle tabular-nums">{value}%</span>
      </div>
      <div className="relative h-[3px] overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/40 via-accent to-accent-2"
          initial={{ width: "0%" }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute top-1/2 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_12px_2px_var(--accent)]" />
        </motion.div>
      </div>
    </div>
  );
}
