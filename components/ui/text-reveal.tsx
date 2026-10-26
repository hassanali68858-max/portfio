"use client";

import { motion } from "motion/react";
import { cn, ease } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface TextRevealProps {
  text: string;
  as?: Tag;
  className?: string;
  /** Words (exact match, punctuation included) to render with the accent gradient */
  accent?: string[];
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view */
  immediate?: boolean;
  /** Classes applied to every (non-accent) word — e.g. a per-line gradient */
  wordClassName?: string;
}

/** Word-by-word masked reveal. Screen readers get the plain sentence. */
export function TextReveal({
  text,
  as = "h2",
  className,
  accent = [],
  delay = 0,
  stagger = 0.045,
  immediate = false,
  wordClassName,
}: TextRevealProps) {
  const Tag = motion[as];
  const words = text.split(" ");

  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-10% 0px" } };

  return (
    <Tag
      className={className}
      aria-label={text}
      {...trigger}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top"
        >
          <motion.span
            className={cn(
              "inline-block will-change-transform",
              accent.includes(word) ? "text-accent-gradient" : wordClassName
            )}
            variants={{
              hidden: { y: "110%", rotate: 4, opacity: 0 },
              show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1, ease: ease.out } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
