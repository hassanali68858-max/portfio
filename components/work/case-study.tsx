"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/lib/data";
import { filters } from "@/lib/data";
import { ease } from "@/lib/utils";
import { TextReveal } from "@/components/ui/text-reveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TransitionLink } from "@/components/ui/transition-link";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ArrowIcon } from "@/components/ui/button";
import { ProjectArt } from "./project-art";

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.02]);
  const artY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const categoryLabels = project.categories.map((c) => filters.find((f) => f.id === c)?.label).join(" · ");

  return (
    <article className="relative">
      {/* Header */}
      <header className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 60% at 50% 0%, var(--accent-soft), transparent 70%)" }} />
        <div aria-hidden className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent_75%)]" />
        <div className="container-x relative">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: ease.out }}>
            <TransitionLink
              href="/#work"
              label="Selected work"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-0.5" />
              All work
            </TransitionLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.18em] text-subtle uppercase"
          >
            <span className="text-accent">{categoryLabels}</span>
            <span className="h-px w-8 bg-line-strong" />
            {project.client}
            {project.status && <span className="rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">{project.status}</span>}
          </motion.p>

          <TextReveal
            as="h1"
            immediate
            delay={0.35}
            text={project.title}
            wordClassName="text-gradient"
            className="mt-6 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1] font-semibold tracking-[-0.045em]"
          />
          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7, ease: ease.out }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {project.summary}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: ease.out }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4"
          >
            {[
              { k: "Role", v: project.role },
              { k: "Client", v: project.client },
              { k: "Timeline", v: project.year },
              { k: "Stack", v: project.stack.slice(0, 3).join(", ") },
            ].map((m) => (
              <div key={m.k}>
                <dt className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">{m.k}</dt>
                <dd className="mt-2 text-sm text-fg">{m.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </header>

      {/* Cover */}
      <div className="container-x">
        <motion.div
          ref={coverRef}
          style={{ scale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: ease.out }}
          className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line bg-elevated shadow-lift md:aspect-[16/8]"
        >
          <motion.div style={{ y: artY }} className="absolute -inset-8">
            <ProjectArt project={project} priority />
          </motion.div>
        </motion.div>
      </div>

      {/* Body */}
      <div className="container-x py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-[0.35fr_0.65fr] md:gap-20">
          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-subtle uppercase md:sticky md:top-28">Overview</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-display text-2xl leading-snug font-medium tracking-tight text-fg md:text-3xl">{project.overview}</p>
          </Reveal>

          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-subtle uppercase md:sticky md:top-28">The challenge</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-lg leading-relaxed text-muted">{project.challenge}</p>
          </Reveal>

          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-subtle uppercase md:sticky md:top-28">Approach</h2>
          </Reveal>
          <RevealGroup className="space-y-px overflow-hidden rounded-3xl border border-line bg-line" stagger={0.08}>
            {project.approach.map((step, i) => (
              <RevealItem key={i}>
                <div className="group flex gap-5 bg-bg p-6 transition-colors duration-500 hover:bg-surface md:p-7">
                  <span className="font-mono text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] leading-relaxed text-fg/85">{step}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-subtle uppercase md:sticky md:top-28">Outcome</h2>
          </Reveal>
          <RevealGroup className="grid gap-3 sm:grid-cols-3" stagger={0.1}>
            {project.outcomes.map((o) => (
              <RevealItem key={o.label} className="h-full">
                <SpotlightCard className="h-full">
                  <p className="font-display text-4xl font-semibold tracking-tight text-accent-gradient">{o.value}</p>
                  <p className="mt-3 text-sm text-muted">{o.label}</p>
                </SpotlightCard>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <h2 className="font-mono text-xs tracking-[0.18em] text-subtle uppercase">Stack</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Next project */}
      <div className="container-x pb-24">
        <Reveal>
          <TransitionLink
            href={`/work/${next.slug}`}
            label={next.title}
            data-cursor="Next"
            className="group/btn relative block overflow-hidden rounded-[28px] border border-line bg-elevated transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-lift"
          >
            <div className="grid items-center md:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="font-mono text-xs tracking-[0.18em] text-subtle uppercase">Next project</p>
                <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-fg md:text-5xl">{next.title}</p>
                <p className="mt-4 max-w-md text-sm text-muted">{next.summary}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg">
                  View case study <ArrowIcon />
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden border-t border-line md:aspect-auto md:h-full md:border-t-0 md:border-l">
                <div className="h-full w-full transition-transform duration-[1.2s] ease-out-expo group-hover/btn:scale-105">
                  <ProjectArt project={next} />
                </div>
              </div>
            </div>
          </TransitionLink>
        </Reveal>
      </div>
    </article>
  );
}
