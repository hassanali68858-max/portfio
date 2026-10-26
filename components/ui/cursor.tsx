"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, [data-cursor]";

/**
 * Two-part cursor: a precise dot plus a soft trailing ring.
 * - grows over interactive elements
 * - shows a label for elements with [data-cursor="Label"]
 * - disabled on touch devices and with reduced motion
 */
export function Cursor() {
  const enabled = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isText, setIsText] = useState(false);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.classList.remove("has-custom-cursor");
      return;
    }
    root.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest<HTMLElement>(INTERACTIVE);
      setHover(Boolean(el));
      setLabel(el?.dataset.cursor ?? null);
      setIsText(Boolean(t?.closest("input, textarea")));
    };
    const leave = () => setVisible(false);
    const pDown = () => setDown(true);
    const pUp = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pDown);
    window.addEventListener("pointerup", pUp);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pDown);
      window.removeEventListener("pointerup", pUp);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hover ? 44 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible && !isText ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={cn(
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border",
            label
              ? "border-transparent bg-accent text-accent-fg"
              : hover
                ? "border-accent/60 bg-accent/10"
                : "border-fg/25"
          )}
          animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                className="text-[11px] font-medium tracking-wide"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
        style={{ x, y }}
        animate={{ opacity: visible && !label && !isText ? 1 : 0, scale: hover ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
