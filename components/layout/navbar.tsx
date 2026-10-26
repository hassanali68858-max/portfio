"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { navItems } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { useScrollTo } from "@/lib/hooks/use-scroll-to";
import { cn, ease } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useEffect(() => setScrolled(window.scrollY > 24), []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: ease.out }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full items-center justify-between rounded-full border px-2 py-2 pl-3 transition-[max-width,background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-out-expo",
            scrolled
              ? "glass max-w-[760px] border-line shadow-lift"
              : "max-w-[1200px] border-transparent bg-transparent"
          )}
        >
          <Logo />

          <ul className="hidden items-center md:flex" onPointerLeave={() => setHovered(null)}>
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`/#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.id);
                    }}
                    onPointerEnter={() => setHovered(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-1.5 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg"
                    )}
                  >
                    {item.label}
                  </a>
                  {hovered === item.id && !isActive && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-surface-2"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border border-line-strong bg-surface-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    >
                      <span className="absolute -bottom-px left-1/2 h-px w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
                    </motion.span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" className="hidden md:inline-flex" onClick={() => scrollTo("contact")}>
              Let&apos;s talk
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
            >
              <span className="sr-only">Menu</span>
              <motion.span
                className="absolute h-[1.5px] w-4 rounded-full bg-fg"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                transition={{ duration: 0.4, ease: ease.out }}
              />
              <motion.span
                className="absolute h-[1.5px] w-4 rounded-full bg-fg"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                transition={{ duration: 0.4, ease: ease.out }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu active={active} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
