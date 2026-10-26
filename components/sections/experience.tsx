"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "motion/react";
import { GraduationCap, Trophy } from "lucide-react";
import { awards, education, experience } from "@/lib/data";
import { cn, ease } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";

type Job = (typeof experience)[number];

function TimelineItem({ job, index }: { job: Job; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: false, margin: "-45% 0px -45% 0px" });
  const passed = useInView(ref, { once: true, margin: "0px 0px -45% 0px" });
  const left = index % 2 === 0;

  return (
    <li ref={ref} className={cn("relative grid md:grid-cols-2 md:gap-16", index > 0 && "md:-mt-24")}>
      {/* node */}
      <span className="absolute top-8 left-4 z-10 -translate-x-1/2 md:left-1/2" aria-hidden>
        <span
          className={cn(
            "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-500",
            passed ? "border-accent bg-accent" : "border-line-strong bg-bg"
          )}
        >
          {inView && <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />}
        </span>
      </span>

      <motion.div
        initial={{ opacity: 0, x: left ? -60 : 60, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, ease: ease.out }}
        className={cn("pl-12 md:pl-0", left ? "md:col-start-1 md:text-right" : "md:col-start-2")}
      >
        <SpotlightCard as="article" className="p-6 md:p-7">
          <p className="font-mono text-xs tracking-wide text-accent">{job.period}</p>
          <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-fg">{job.role}</h3>
          <p className="mt-1 text-sm text-fg/80">{job.company}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{job.summary}</p>
          <ul className={cn("mt-5 flex flex-wrap gap-1.5", left && "md:justify-end")}>
            {job.tags.map((t) => (
              <li key={t} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </motion.div>
    </li>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="experience" className="relative overflow-x-clip py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          title="Five years of shipping to real users."
          accent={["shipping"]}
          align="center"
          className="mx-auto"
        />

        <div ref={ref} className="relative mt-20 md:mt-28">
          {/* track + animated fill */}
          <div aria-hidden className="absolute top-0 bottom-0 left-4 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            aria-hidden
            style={{ scaleY }}
            className="absolute top-0 bottom-0 left-4 w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent md:left-1/2 md:-translate-x-1/2"
          >
            <span className="absolute bottom-0 left-1/2 h-16 w-[3px] -translate-x-1/2 rounded-full bg-accent blur-[3px]" />
          </motion.div>

          <ol className="space-y-10 md:space-y-0">
            {experience.map((job, i) => (
              <TimelineItem key={job.company} job={job} index={i} />
            ))}
          </ol>
        </div>

        {/* Education + Awards */}
        <RevealGroup className="mt-24 grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {education.map((e) => (
            <RevealItem key={e.degree} className="lg:col-span-1">
              <SpotlightCard className="h-full">
                <GraduationCap className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">{e.degree}</h3>
                <p className="mt-1 text-sm text-fg/80">{e.school}</p>
                <p className="mt-3 text-xs leading-relaxed text-subtle">{e.focus}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
          {awards.map((a) => (
            <RevealItem key={a.title}>
              <SpotlightCard className="h-full">
                <Trophy className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-1 text-sm text-muted">{a.by}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
