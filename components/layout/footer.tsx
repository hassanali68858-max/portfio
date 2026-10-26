"use client";

import { ArrowUp } from "lucide-react";
import { navItems, site, socials } from "@/lib/data";
import { useScrollTo } from "@/lib/hooks/use-scroll-to";
import { LocalTime } from "@/components/ui/local-time";
import { Magnetic } from "@/components/ui/magnetic";

export function Footer() {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-10">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="max-w-sm font-display text-2xl font-semibold tracking-tight text-fg">{site.tagline}</p>
            <p className="mt-3 text-sm text-muted">{site.title}</p>
          </div>
          <nav aria-label="Footer">
            <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">Navigate</p>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a
                    href={`/#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(n.id);
                    }}
                    className="text-muted transition-colors hover:text-fg"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">Elsewhere</p>
            <ul className="space-y-2.5 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-muted transition-colors hover:text-fg">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 bg-gradient-to-b from-fg/15 to-transparent bg-clip-text text-center font-display text-[clamp(3rem,13vw,11rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-transparent select-none"
        >
          {site.shortName}
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-line pt-8 text-xs text-subtle sm:flex-row">
          <p>
            © {year} {site.name}. Designed & built with Next.js & Motion.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono">
              {site.location} · <LocalTime />
            </span>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => scrollTo("top")}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                aria-label="Back to top"
              >
                <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
