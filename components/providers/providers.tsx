"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";
import { TransitionProvider } from "./transition-provider";
import { Cursor } from "@/components/ui/cursor";

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, anchors: false }}>
      {children}
    </ReactLenis>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
        <SmoothScroll>
          <TransitionProvider>
            {children}
            <Cursor />
          </TransitionProvider>
        </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}
