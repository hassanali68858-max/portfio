"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects, site } from "@/lib/data";
import { ease } from "@/lib/utils";
import { useScrollTo } from "@/lib/hooks/use-scroll-to";
import { Button, ArrowIcon } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { TransitionLink } from "@/components/ui/transition-link";
import { NeuralCore } from "./neural-core";
import { Marquee } from "./marquee";

const annotations = [
  { label: "RAG pipelines", className: "right-[100%] top-[30%] flex-row", inset: "-28%", line: "w-[72px]", delay: 1.5, float: "0s" },
  { label: "Multi-agent systems", className: "left-[100%] top-[40%] flex-row-reverse", inset: "-22%", line: "w-[64px]", delay: 1.65, float: "-2s" },
  { label: "Real-time data", className: "right-[100%] top-[54%] flex-row", inset: "-20%", line: "w-[56px]", delay: 1.8, float: "-4s" },
];

/** "Monolith" hero — giant wordmark with a 3D neural core floating in front of it. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();
  const latest = projects[0];
  const words = site.shortName.toUpperCase().split(" ");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const coreY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pb-16 lg:min-h-[max(100svh,860px)] lg:pb-0"
    >
      {/* Ambient light — soft, no grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[46%] left-1/2 h-[900px] w-[1100px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 20%, transparent), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 70% at 50% 120%, color-mix(in oklab, var(--accent-2) 12%, transparent), transparent 60%)" }}
        />
      </div>

      {/* Eyebrow + wordmark (behind the core) */}
      <motion.div style={{ y: wordY }} className="relative z-[1] pt-28 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: ease.out }}
          className="px-5 text-center font-mono text-[11px] tracking-[0.22em] text-subtle uppercase md:text-xs"
        >
          {site.title} · {site.location}
        </motion.p>
        <h1
          aria-label={site.name}
          className="mt-2 flex justify-center gap-[0.22em] overflow-hidden pb-[0.06em] text-center font-display text-[clamp(56px,15.6vw,232px)] leading-[0.86] font-bold tracking-[-0.065em] whitespace-nowrap"
        >
          {words.map((w, i) => (
            <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.04em]">
              <motion.span
                className="inline-block"
                style={{
                  background: "linear-gradient(180deg, var(--fg) 10%, color-mix(in oklab, var(--fg) 16%, transparent) 92%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, delay: 0.35 + i * 0.1, ease: ease.out }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>

      {/* 3D neural core + annotations */}
      <motion.div
        style={{ y: coreY, scale: coreScale }}
        className="relative z-[2] mx-auto -mt-[14vw] aspect-square w-[min(92vw,520px)] lg:absolute lg:top-[168px] lg:left-1/2 lg:mt-0 lg:w-[min(600px,68svh)] lg:-translate-x-1/2"
      >
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, delay: 0.6, ease: ease.out }}
        >
          <NeuralCore />
        </motion.div>

        {annotations.map((a) => (
          <motion.div
            key={a.label}
            aria-hidden
            className={`absolute hidden items-center lg:flex ${a.className}`}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: a.delay, ease: ease.out }}
            style={{ marginInline: a.inset }}
          >
            <span
              className="animate-float glass rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] whitespace-nowrap text-fg"
              style={{ animationDelay: a.float }}
            >
              {a.label}
            </span>
            <span className={`h-px ${a.line} bg-gradient-to-r from-fg/30 to-accent ${a.className.includes("reverse") ? "rotate-180" : ""}`} />
            <span className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_2px_var(--accent)]" />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom row */}
      <motion.div
        style={{ opacity: fade }}
        className="container-x relative z-[3] mt-4 flex flex-col gap-10 lg:absolute lg:inset-x-0 lg:bottom-[84px] lg:mt-0 lg:max-w-none lg:flex-row lg:items-end lg:justify-between lg:px-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1, ease: ease.out }}
          className="flex max-w-[440px] flex-col gap-5"
        >
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 py-1.5 pr-3 pl-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {site.availability}
          </span>
          <p className="font-display text-[28px] leading-[1.12] font-semibold tracking-[-0.035em] text-fg md:text-[32px]">
            I build AI systems that hold up in <span className="text-accent-gradient">production.</span>
          </p>
          <p className="text-[15px] leading-relaxed text-muted">
            5+ years shipping RAG pipelines, multi-agent orchestration, real-time dashboards and offline-first mobile apps.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="lg" magnetic className="h-12 px-5 sm:px-6" onClick={() => scrollTo("work")} data-cursor="Explore">
              View selected work <ArrowIcon />
            </Button>
            <Button size="lg" variant="secondary" magnetic className="h-12 px-5 sm:px-6" onClick={() => scrollTo("contact")}>
              Get in touch
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.15, ease: ease.out }}
          className="flex w-full flex-col gap-3 sm:max-w-[320px]"
        >
          <TransitionLink
            href={`/work/${latest.slug}`}
            label={latest.title}
            data-cursor="Open"
            className="group glass flex items-center gap-4 rounded-[20px] border border-line p-2.5 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
          >
            <span
              className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[14px] border border-line"
              style={{ background: "radial-gradient(80% 80% at 50% 30%, color-mix(in oklab, var(--accent) 30%, transparent), var(--bg-elevated) 75%)" }}
            >
              <svg viewBox="0 0 76 76" className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-110" aria-hidden>
                <rect x="24" y="12" width="28" height="52" rx="6" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
                <path d="M29 40l5-4 4 2 5-6 5 3" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
                <rect x="29" y="22" width="14" height="3" rx="1.5" fill="var(--fg)" />
                <rect x="29" y="46" width="18" height="2" rx="1" fill="var(--fg-muted)" opacity=".6" />
                <rect x="29" y="51" width="12" height="2" rx="1" fill="var(--fg-muted)" opacity=".4" />
              </svg>
            </span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">Latest · {latest.year}</span>
              <span className="font-display text-base leading-tight font-semibold tracking-tight text-fg">{latest.title}</span>
              <span className="text-xs text-muted">{latest.client} · iOS &amp; Android</span>
            </span>
          </TransitionLink>
          <dl className="grid grid-cols-3 gap-2">
            {site.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end rounded-2xl border border-line bg-surface p-3">
                <dt className="mt-1 text-[11px] leading-tight text-subtle">{s.label}</dt>
                <dd className="font-display text-[22px] font-semibold tracking-tight text-fg">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* Toolbelt strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute inset-x-0 bottom-0 z-[4]"
      >
        <Marquee />
      </motion.div>
    </section>
  );
}
