"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Item = {
  ring: boolean;
  x: number;
  y: number;
  z: number;
  a: number;
  r: number;
  hub: boolean;
  sx: number;
  sy: number;
  zz: number;
};

function parseColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];
  return fallback;
}

/**
 * "Neural core" — a rotating 3D point-cloud sphere with an orbital ring and
 * pulsing synapse links, drawn on a 2D canvas (no WebGL / three.js needed).
 * - leans toward the pointer
 * - reads --accent / --bg so it follows the theme
 * - pauses off-screen; renders one still frame with reduced motion
 */
export function NeuralCore({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Theme colours (refreshed when the <html> class changes)
    let accent: [number, number, number] = [139, 147, 255];
    let bg: [number, number, number] = [8, 8, 10];
    let dark = true;
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = parseColor(cs.getPropertyValue("--accent"), accent);
      bg = parseColor(cs.getPropertyValue("--bg"), bg);
      dark = document.documentElement.classList.contains("dark");
    };
    readTheme();
    const mo = new MutationObserver(() => {
      readTheme();
      if (!running) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Geometry: Fibonacci sphere + tilted orbital ring
    const N = 1900;
    const GA = Math.PI * (3 - Math.sqrt(5));
    const items: Item[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N;
      const rr = Math.sqrt(1 - y * y);
      const a = i * GA;
      items.push({ ring: false, x: Math.cos(a) * rr, y, z: Math.sin(a) * rr, a: 0, r: 0, hub: i % 61 === 0, sx: 0, sy: 0, zz: 0 });
    }
    const RN = 320;
    for (let j = 0; j < RN; j++) {
      items.push({ ring: true, x: 0, y: 0, z: 0, a: (j / RN) * Math.PI * 2, r: 1.5 + (j % 4) * 0.035, hub: false, sx: 0, sy: 0, zz: 0 });
    }
    const hubs = items.filter((p) => p.hub);
    const tiltX = 1.12;
    const tiltZ = 0.28;
    const ctX = Math.cos(tiltX), stX = Math.sin(tiltX), ctZ = Math.cos(tiltZ), stZ = Math.sin(tiltZ);

    // Pointer (eased)
    const target = { x: 0, y: 0 };
    const m = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    const t0 = performance.now();
    const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    function draw(now: number) {
      const t = reduce ? 6 : (now - t0) / 1000;
      m.x += (target.x - m.x) * 0.05;
      m.y += (target.y - m.y) * 0.05;
      ctx!.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.29;

      // Occlusion disc (theme bg) so the core reads IN FRONT of the wordmark
      let g = ctx!.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.45);
      g.addColorStop(0, rgba(bg, dark ? 0.92 : 0.86));
      g.addColorStop(0.6, rgba(bg, dark ? 0.6 : 0.55));
      g.addColorStop(1, rgba(bg, 0));
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.45, 0, Math.PI * 2);
      ctx!.fill();
      g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
      g.addColorStop(0, rgba(accent, dark ? 0.26 : 0.16));
      g.addColorStop(1, rgba(accent, 0));
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
      ctx!.fill();

      const ry = t * 0.16 + m.x * 1.2;
      const rx = -0.3 + m.y * 0.8;
      const cyr = Math.cos(ry), syr = Math.sin(ry), cxr = Math.cos(rx), sxr = Math.sin(rx);
      const pulse = 1 + Math.sin(t * 1.4) * 0.018;

      for (const p of items) {
        let x: number, y: number, z: number;
        if (!p.ring) {
          const n = Math.sin(p.x * 3.1 + t * 0.9) * Math.sin(p.y * 2.7 - t * 0.7) * Math.sin(p.z * 3.3 + t * 0.55);
          const d = pulse * (1 + 0.15 * n);
          x = p.x * d;
          y = p.y * d;
          z = p.z * d;
        } else {
          const aa = p.a + t * 0.22;
          const x0 = Math.cos(aa) * p.r;
          const z0 = Math.sin(aa) * p.r;
          const y1 = -z0 * stX;
          z = z0 * ctX;
          x = x0 * ctZ - y1 * stZ;
          y = x0 * stZ + y1 * ctZ;
        }
        const xr = x * cyr + z * syr;
        const zr = -x * syr + z * cyr;
        const yr = y * cxr - zr * sxr;
        const zz = y * sxr + zr * cxr;
        const f = 3.2 / (3.2 + zz);
        p.sx = cx + xr * R * f;
        p.sy = cy + yr * R * f;
        p.zz = zz;
      }
      items.sort((a, b) => b.zz - a.zz);

      // Synapse links between front-facing hubs
      ctx!.lineWidth = 0.6;
      for (let h = 0; h < hubs.length; h++) {
        const A = hubs[h];
        const B = hubs[(h + 7) % hubs.length];
        if (A.zz < 0.2 && B.zz < 0.2) {
          ctx!.strokeStyle = rgba(accent, 0.12 + 0.25 * Math.max(0, Math.sin(t * 1.5 + h)));
          ctx!.beginPath();
          ctx!.moveTo(A.sx, A.sy);
          ctx!.lineTo(B.sx, B.sy);
          ctx!.stroke();
        }
      }

      // Front points mix toward white (dark theme) or deepen (light theme)
      const mixTo = dark ? [255, 255, 255] : [20, 22, 60];
      for (const q of items) {
        const dep = Math.max(0, Math.min(1, (1 - q.zz / 1.6) / 2));
        const w = dep * dep * (dark ? 0.65 : 0.45);
        const c = [
          Math.round(accent[0] + (mixTo[0] - accent[0]) * w),
          Math.round(accent[1] + (mixTo[1] - accent[1]) * w),
          Math.round(accent[2] + (mixTo[2] - accent[2]) * w),
        ];
        const alpha = 0.12 + 0.88 * dep;
        let size = q.ring ? 0.7 + 1.5 * dep : 0.55 + 1.75 * dep;
        if (q.hub) {
          size += 1.6;
          ctx!.fillStyle = rgba(c, alpha * 0.25);
          ctx!.beginPath();
          ctx!.arc(q.sx, q.sy, size * 3, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.fillStyle = rgba(c, alpha);
        ctx!.beginPath();
        ctx!.arc(q.sx, q.sy, size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    fit();
    draw(performance.now());
    const ro = new ResizeObserver(() => {
      fit();
      if (!running) draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Rotating 3D point-cloud sphere representing a neural network"
      className={cn("block h-full w-full", className)}
    />
  );
}
