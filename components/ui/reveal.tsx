"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { ease } from "@/lib/utils";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  x?: number;
  blur?: boolean;
}

/** Fade + rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 24, x = 0, blur = true, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: ease.out }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <RevealItem> children */
export function RevealGroup({
  children,
  stagger = 0.08,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: ease.out } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
