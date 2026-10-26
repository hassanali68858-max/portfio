"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { alsoShipped, filters, projects, type ProjectCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/work/project-card";

export function Work() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter]
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        filters.map((f) => [f.id, f.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(f.id as ProjectCategory)).length])
      ),
    []
  );

  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <SectionHeading
            index="01"
            eyebrow="Selected work"
            title="Production systems, not prototypes."
            accent={["prototypes."]}
            description="A few things I've designed, built and shipped — from LLM pipelines to real-time dashboards and mobile apps."
          />

          <Reveal delay={0.2} blur={false}>
            <LayoutGroup id="filters">
              <div role="tablist" aria-label="Filter projects" className="inline-flex rounded-full border border-line bg-surface p-1">
                {filters.map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f.id)}
                      className={cn(
                        "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 sm:px-4",
                        active ? "text-bg" : "text-muted hover:text-fg"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-fg"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">
                        {f.label}
                        <sup className={cn("ml-1 font-mono text-[9px]", active ? "text-bg/60" : "text-subtle")}>
                          {counts[f.id]}
                        </sup>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </Reveal>
        </div>

        <motion.div
          layout
          className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 md:mt-20 md:auto-rows-[320px] md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Also shipped */}
        <div className="mt-20 grid gap-10 md:grid-cols-[0.6fr_1.4fr]">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.18em] text-subtle uppercase">Also shipped</p>
          </Reveal>
          <RevealGroup className="divide-y divide-line border-y border-line" stagger={0.06}>
            {alsoShipped.map((item) => (
              <RevealItem key={item.title}>
                <div className="group flex items-center justify-between gap-6 py-4 transition-[padding] duration-500 ease-out-expo hover:pl-2">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-display text-lg font-medium tracking-tight text-fg">{item.title}</span>
                    <span className="text-sm text-muted">{item.desc}</span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-subtle transition-colors group-hover:text-accent">
                    {item.year}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
