"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  /** 0–1 — how far the element follows the pointer */
  strength?: number;
  className?: string;
}

/** Pulls its child toward the pointer; inner content moves a little further for depth. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 16, mass: 0.4 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);
  const innerX = useTransform(x, (v) => v * 0.35);
  const innerY = useTransform(y, (v) => v * 0.35);

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div className="inline-flex w-full" style={{ x: innerX, y: innerY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
