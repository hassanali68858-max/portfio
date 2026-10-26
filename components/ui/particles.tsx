"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight canvas particle field. Pauses off-screen,
 * respects reduced motion (renders a static frame), DPR-aware.
 */
export function Particles({ className, count = 48 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -Math.random() * 0.00018 - 0.00004,
      a: Math.random() * 0.5 + 0.15,
      t: Math.random() * Math.PI * 2,
    }));

    const color = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b93ff";

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const c = color();
      for (const p of pts) {
        if (step) {
          p.x += p.vx * 16;
          p.y += p.vy * 16;
          p.t += 0.01;
          if (p.y < -0.02) p.y = 1.02;
          if (p.x < -0.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -0.02;
        }
        ctx.globalAlpha = p.a * (0.6 + Math.sin(p.t) * 0.4);
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(false);
    const ro = new ResizeObserver(() => {
      resize();
      draw(false);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
