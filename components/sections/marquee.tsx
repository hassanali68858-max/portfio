import { toolbelt } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Infinite, edge-faded marquee of the toolbelt. Pauses on hover. */
export function Marquee({ className }: { className?: string }) {
  const items = [...toolbelt, ...toolbelt];
  return (
    <div
      role="region"
      aria-label="Technologies"
      className={cn("group mask-fade-x flex h-12 items-center overflow-hidden border-t border-line bg-bg/70 backdrop-blur", className)}
    >
      <ul className="animate-marquee flex shrink-0 items-center gap-7 pr-7 group-hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <li
            key={`${t}-${i}`}
            aria-hidden={i >= toolbelt.length}
            className="flex items-center gap-7 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-subtle uppercase transition-colors duration-300 hover:text-fg"
          >
            {t}
            <span className="text-accent" aria-hidden>
              ✦
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
