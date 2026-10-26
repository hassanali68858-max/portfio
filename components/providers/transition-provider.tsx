"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { ease } from "@/lib/utils";

type Phase = "idle" | "cover" | "reveal";

interface TransitionCtx {
  navigate: (href: string, label?: string) => void;
  isTransitioning: boolean;
}

const Ctx = createContext<TransitionCtx>({ navigate: () => {}, isTransitioning: false });
export const usePageTransition = () => useContext(Ctx);

/**
 * Curtain-style page transitions for the App Router.
 * 1. Curtain wipes up and covers the page (with the destination label)
 * 2. Route changes underneath while hidden
 * 3. Curtain continues upward, revealing the new page
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const pendingHref = useRef<string | null>(null);
  const fromPath = useRef(pathname);

  const navigate = useCallback(
    (href: string, nextLabel = "") => {
      if (phase !== "idle") return;
      const targetPath = href.split("#")[0] || "/";
      if (reduce || targetPath === pathname) {
        router.push(href);
        return;
      }
      fromPath.current = pathname;
      pendingHref.current = href;
      setLabel(nextLabel);
      setPhase("cover");
    },
    [phase, pathname, reduce, router]
  );

  // Once the destination route has rendered, reposition scroll and reveal.
  useEffect(() => {
    if (phase !== "cover" || pathname === fromPath.current) return;
    const hash = window.location.hash;
    requestAnimationFrame(() => {
      if (hash && document.querySelector(hash)) {
        lenis?.scrollTo(hash, { immediate: true, offset: -24, force: true });
        if (!lenis) document.querySelector(hash)?.scrollIntoView();
      } else {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
      setTimeout(() => setPhase("reveal"), 120);
    });
  }, [pathname, phase, lenis]);

  // Safety net — never leave the curtain stuck.
  useEffect(() => {
    if (phase !== "cover") return;
    const t = setTimeout(() => setPhase("reveal"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <Ctx.Provider value={{ navigate, isTransitioning: phase !== "idle" }}>
      {children}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="curtain"
            aria-hidden
            className="fixed inset-0 z-[80] flex items-center justify-center bg-elevated"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={
              phase === "cover"
                ? { clipPath: "inset(0% 0% 0% 0%)" }
                : { clipPath: "inset(0% 0% 100% 0%)" }
            }
            transition={{ duration: phase === "cover" ? 0.7 : 0.8, ease: ease.inOut }}
            onAnimationComplete={() => {
              if (phase === "cover" && pendingHref.current) {
                router.push(pendingHref.current, { scroll: false });
                pendingHref.current = null;
              } else if (phase === "reveal") {
                setPhase("idle");
              }
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
            <motion.div
              className="relative flex flex-col items-center gap-4 px-6 text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={phase === "cover" ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
              transition={{ duration: 0.5, delay: phase === "cover" ? 0.25 : 0, ease: ease.out }}
            >
              <span className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Loading</span>
              <span className="font-display text-3xl font-medium tracking-tight text-fg md:text-5xl">
                {label || "Hassan Ali"}
              </span>
              <motion.span
                className="h-px w-40 origin-left bg-gradient-to-r from-accent to-accent-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: ease.out, delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
