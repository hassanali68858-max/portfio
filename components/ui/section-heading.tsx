import { cn } from "@/lib/utils";
import { TextReveal } from "./text-reveal";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string[];
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal blur={false} y={10}>
        <p
          className={cn(
            "mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-subtle uppercase",
            align === "center" && "justify-center"
          )}
        >
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          {eyebrow}
        </p>
      </Reveal>
      <TextReveal
        text={title}
        accent={accent}
        wordClassName="text-gradient"
        className="text-4xl leading-[1.05] font-semibold md:text-6xl"
      />
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
