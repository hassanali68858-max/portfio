"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { navItems, site, socials } from "@/lib/data";
import { useScrollTo } from "@/lib/hooks/use-scroll-to";
import { cn, ease } from "@/lib/utils";

export function MobileMenu({ active, onClose }: { active: string | null; onClose: () => void }) {
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  useEffect(() => {
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  const go = (id: string) => {
    onClose();
    // wait for the menu to start closing so the scroll feels intentional
    setTimeout(() => scrollTo(id), 250);
  };

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-40 md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.15 } }}
    >
      <motion.div
        className="glass absolute inset-0"
        initial={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
        animate={{ clipPath: "circle(150% at calc(100% - 36px) 36px)" }}
        exit={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
        transition={{ duration: 0.8, ease: ease.inOut }}
        style={{ background: "color-mix(in oklab, var(--bg) 97%, transparent)" }}
      />
      <div className="relative flex h-full flex-col justify-between px-6 pt-28 pb-10">
        <motion.ul
          className="flex flex-col gap-1"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
            hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
          }}
        >
          {navItems.map((item, i) => (
            <motion.li
              key={item.id}
              className="overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 40, x: -12 },
                show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: ease.out } },
              }}
            >
              <a
                href={`/#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                className={cn(
                  "group flex items-baseline gap-4 py-2 font-display text-5xl font-medium tracking-tight transition-colors",
                  active === item.id ? "text-fg" : "text-muted hover:text-fg"
                )}
              >
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                {item.label}
                {active === item.id && <span className="h-2 w-2 rounded-full bg-accent" />}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.6, ease: ease.out } }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          className="space-y-6"
        >
          <div className="h-px bg-line" />
          <a href={`mailto:${site.email}`} className="block text-lg text-fg">
            {site.email}
          </a>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
