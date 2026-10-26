"use client";

import { motion } from "motion/react";
import { languages, principles, site, skillBars, skillRings } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SkillBar } from "@/components/ui/skill-bar";
import { Particles } from "@/components/ui/particles";

function PortraitCard() {
  return (
    <TiltCard className="rounded-[32px]" max={7}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-line-strong bg-elevated [transform-style:preserve-3d]">
        {/* Orbit composition — swap for a real photo with next/image if you like */}
        <div aria-hidden className="absolute inset-0 bg-dots opacity-70 [mask-image:radial-gradient(circle_at_50%_45%,#000,transparent_70%)]" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 60% at 50% 42%, var(--accent-soft), transparent 70%)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(40px)" }}>
          {[220, 300, 380].map((s, i) => (
            <motion.div
              key={s}
              aria-hidden
              className="absolute rounded-full border border-line-strong"
              style={{ width: s, height: s }}
              animate={{ rotate: i % 2 ? -360 : 360 }}
              transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
            >
              <span
                className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_2px_var(--accent)]"
                style={{ opacity: 1 - i * 0.25 }}
              />
            </motion.div>
          ))}
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-[36px] border border-line-strong bg-bg/70 font-display text-5xl font-semibold tracking-tight shadow-lift backdrop-blur"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-accent-gradient">{site.initials}</span>
          </div>
        </div>
        <div
          className="glass absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-line p-4"
          style={{ transform: "translateZ(60px)" }}
        >
          <div>
            <p className="font-display text-base font-semibold tracking-tight">{site.shortName}</p>
            <p className="text-xs text-muted">AI Engineer · {site.location}</p>
          </div>
          <div className="flex gap-1.5">
            {languages.map((l) => (
              <span key={l.name} title={`${l.name} — ${l.level}`} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                {l.name.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-28 md:py-40">
      <Particles className="opacity-70" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="container-x relative">
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28">
            <PortraitCard />
          </Reveal>

          <div>
            <SectionHeading index="02" eyebrow="About" title="Engineer first. Pragmatist always." accent={["Pragmatist"]} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted md:text-lg">
              {site.about.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p className={i === 0 ? "text-fg/90" : undefined}>{p}</p>
                </Reveal>
              ))}
            </div>

            <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-3" stagger={0.1}>
              {principles.map((p) => (
                <RevealItem key={p.n} className="h-full">
                  <SpotlightCard className="h-full p-5">
                    <span className="font-mono text-xs text-accent">{p.n}</span>
                    <h3 className="mt-6 font-display text-base font-semibold tracking-tight text-fg">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                  </SpotlightCard>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-28 md:mt-36">
          <Reveal>
            <p className="mb-10 flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-subtle uppercase">
              <span className="text-accent">02.1</span>
              <span className="h-px w-8 bg-line-strong" />
              Capabilities
            </p>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div className="grid h-full grid-cols-2 gap-y-10 rounded-3xl border border-line bg-surface p-8 md:grid-cols-4 md:p-10 lg:grid-cols-2">
                {skillRings.map((s, i) => (
                  <ProgressRing key={s.label} value={s.value} label={s.label} detail={s.detail} delay={i * 0.12} />
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-center gap-7 rounded-3xl border border-line bg-surface p-8 md:p-10">
                {skillBars.map((s, i) => (
                  <SkillBar key={s.label} label={s.label} value={s.value} delay={i * 0.08} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
