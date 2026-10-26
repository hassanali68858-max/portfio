"use client";

import { forwardRef } from "react";
import { motion } from "motion/react";
import type { Project } from "@/lib/data";
import { cn, ease } from "@/lib/utils";
import { TransitionLink } from "@/components/ui/transition-link";
import { Magnetic } from "@/components/ui/magnetic";
import { ProjectArt } from "./project-art";

const sizeClasses: Record<Project["size"], string> = {
  xl: "md:col-span-2 md:row-span-2",
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  sm: "",
};

export const ProjectCard = forwardRef<HTMLDivElement, { project: Project; index: number }>(function ProjectCard(
  { project, index },
  ref
) {
  const horizontal = project.size === "wide";
  const compact = project.size === "sm";

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: ease.out, layout: { duration: 0.6, ease: ease.out } }}
      className={cn("min-h-0", sizeClasses[project.size])}
    >
      <TransitionLink
        href={`/work/${project.slug}`}
        label={project.title}
        data-cursor="View"
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-elevated transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
          horizontal && "md:flex-row-reverse"
        )}
      >
        {/* Art */}
        <div
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden border-b border-line md:aspect-auto md:min-h-0 md:flex-1",
            horizontal && "md:border-b-0 md:border-l"
          )}
        >
          <div className="h-full w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]">
            <ProjectArt project={project} priority={index < 2} />
          </div>
          {/* hover overlay */}
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-bg/70 via-bg/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <Magnetic strength={0.5}>
              <span className="inline-flex translate-y-3 items-center gap-2 rounded-full bg-fg px-4 py-2 text-xs font-medium text-bg shadow-lift transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                View case study
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M4.5 11.5l7-7M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Magnetic>
          </div>
          {project.status && (
            <span className="glass absolute top-4 left-4 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted uppercase">
              {project.status}
            </span>
          )}
        </div>

        {/* Copy */}
        <div className={cn("relative flex flex-col gap-3 p-5 md:p-6", horizontal && "md:w-[42%] md:justify-between")}>
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-subtle uppercase">
              <span>{project.client}</span>
              <span className="h-px w-3 bg-line-strong" />
              <span>{project.year}</span>
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-fg md:text-2xl">{project.title}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed text-muted", compact ? "line-clamp-2 md:hidden" : "line-clamp-3")}>
              {project.summary}
            </p>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, compact ? 3 : 5).map((t) => (
              <li
                key={t}
                className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-muted transition-[color,border-color,box-shadow] duration-500 group-hover:border-accent/30 group-hover:text-fg group-hover:shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </TransitionLink>
    </motion.div>
  );
});
