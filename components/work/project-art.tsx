import Image from "next/image";
import type { Project, ProjectArt as ArtKind } from "@/lib/data";
import { cn } from "@/lib/utils";

/* Deterministic PRNG so server + client render identical art */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() || 1e-6)) * Math.cos(2 * Math.PI * r());
}
const round = (n: number) => Math.round(n * 10) / 10;

const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };

/* ───────────── Ledger — AI bookkeeping ───────────── */
function Ledger() {
  return (
    <>
      {/* receipt */}
      <g transform="rotate(-8 115 120)">
        <path
          d="M70 52h92v118l-7.6 6-7.6-6-7.6 6-7.6-6-7.6 6-7.6-6-7.6 6-7.6-6-7.6 6-7.6-6-7.6 6L70 170z"
          fill="var(--bg-elevated)"
          stroke="var(--border-strong)"
        />
        <rect x="82" y="66" width="40" height="5" rx="2.5" fill="var(--fg)" opacity=".7" />
        {[84, 96, 108, 120].map((y, i) => (
          <g key={y}>
            <rect x="82" y={y} width={[52, 38, 46, 30][i]} height="3.5" rx="1.75" fill="var(--fg-muted)" opacity=".35" />
            <rect x="140" y={y} width="12" height="3.5" rx="1.75" fill="var(--fg-muted)" opacity=".35" />
          </g>
        ))}
        <line x1="82" y1="134" x2="152" y2="134" stroke="var(--border-strong)" strokeDasharray="2 3" />
        <text x="82" y="152" fontSize="8" fill="var(--accent)" style={mono}>VAT 25.5%</text>
        <rect className="animate-scan" x="74" y="60" width="84" height="1.5" fill="var(--accent)" opacity=".9" />
      </g>
      {/* phone */}
      <g className="animate-float">
        <rect x="160" y="22" width="104" height="200" rx="18" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <rect x="196" y="30" width="32" height="6" rx="3" fill="var(--border-strong)" />
        <text x="174" y="58" fontSize="7" fill="var(--fg-muted)" style={mono}>VAT RETURN · OCT</text>
        <text x="174" y="80" fontSize="17" fontWeight="600" fill="var(--fg)">€1,284.50</text>
        <rect x="174" y="90" width="76" height="28" rx="6" fill="var(--accent-soft)" />
        <path d="M178 112l10-8 9 4 10-10 9 5 10-9 10 4 10-6" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        {[128, 146, 164, 182].map((y, i) => (
          <g key={y}>
            <circle cx="180" cy={y + 4} r="4" fill={i === 0 ? "var(--accent)" : "var(--surface-2)"} stroke="var(--border-strong)" strokeWidth=".5" />
            <rect x="190" y={y + 1} width={[40, 34, 44, 28][i]} height="3" rx="1.5" fill="var(--fg-muted)" opacity=".45" />
            <rect x="236" y={y + 1} width="14" height="3" rx="1.5" fill="var(--fg)" opacity=".5" />
          </g>
        ))}
        <rect x="174" y="198" width="76" height="14" rx="7" fill="var(--fg)" />
        <text x="212" y="207.5" fontSize="6.5" fill="var(--bg)" textAnchor="middle" style={mono}>EXPORT REPORT</text>
      </g>
      {/* chips */}
      {[
        { y: 64, t: "✓ validated to the cent", w: 108 },
        { y: 96, t: "13.5% · food", w: 70 },
        { y: 128, t: "Wolt tips split", w: 80 },
      ].map((c, i) => (
        <g key={c.t} transform={`translate(${276 + i * 6} ${c.y})`}>
          <rect width={c.w} height="20" rx="10" fill="var(--bg-elevated)" stroke={i === 0 ? "var(--accent)" : "var(--border-strong)"} />
          <text x={c.w / 2} y="13" fontSize="7" textAnchor="middle" fill={i === 0 ? "var(--accent)" : "var(--fg-muted)"} style={mono}>
            {c.t}
          </text>
        </g>
      ))}
    </>
  );
}

/* ───────────── RAG — vector similarity search ───────────── */
function Rag() {
  const r = rng(7);
  const q = { x: 200, y: 120 };
  const pts = Array.from({ length: 70 }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    return { x: round(200 + Math.cos(a) * d * 175), y: round(120 + Math.sin(a) * d * 100) };
  }).filter((p) => Math.hypot(p.x - q.x, p.y - q.y) > 14);
  const nearest = [...pts].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 5);
  const radius = Math.hypot(nearest[4].x - q.x, nearest[4].y - q.y) + 6;

  return (
    <>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.8} fill="var(--fg-muted)" opacity=".35" />
      ))}
      <circle cx={q.x} cy={q.y} r={radius} fill="var(--accent-soft)" stroke="var(--accent)" strokeDasharray="3 4" className="animate-dash" opacity=".8" />
      {nearest.map((p, i) => (
        <g key={i}>
          <line x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke="var(--accent)" strokeWidth="1" opacity=".7" />
          <circle cx={p.x} cy={p.y} r={3.2} fill="var(--accent-2)" />
        </g>
      ))}
      <circle cx={q.x} cy={q.y} r="10" fill="var(--accent)" opacity=".25" className="svg-pulse" />
      <circle cx={q.x} cy={q.y} r="5" fill="var(--accent)" />
      <g transform="translate(26 22)">
        <rect width="124" height="22" rx="11" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <text x="12" y="14.5" fontSize="7.5" fill="var(--fg-muted)" style={mono}>
          retrieve(query, <tspan fill="var(--accent)">k=5</tspan>)
        </text>
      </g>
      <g transform="translate(266 196)">
        <rect width="110" height="22" rx="11" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <text x="12" y="14.5" fontSize="7.5" fill="var(--fg-muted)" style={mono}>
          → grounded · <tspan fill="var(--accent)">cited</tspan>
        </text>
      </g>
    </>
  );
}

/* ───────────── Multi-agent orchestration ───────────── */
function Agents() {
  const nodes = [
    { x: 200, y: 38, l: "Planner · ReACT", main: true },
    { x: 92, y: 120, l: "Flights agent" },
    { x: 308, y: 120, l: "Consolidator" },
    { x: 92, y: 202, l: "Hotels agent", soon: true },
    { x: 308, y: 202, l: "Itinerary agent", soon: true },
  ];
  const edges = [
    "M200 55 C200 90 92 80 92 103",
    "M200 55 C200 90 308 80 308 103",
    "M140 120 L260 120",
    "M92 137 L92 185",
    "M308 137 L308 185",
  ];
  return (
    <>
      {edges.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth="1.2" />
          <path
            d={d}
            fill="none"
            stroke={i > 2 ? "var(--fg-subtle)" : "var(--accent)"}
            strokeWidth="1.4"
            strokeDasharray="4 6"
            className="animate-dash"
            opacity={i > 2 ? 0.6 : 1}
          />
        </g>
      ))}
      {nodes.map((n) => (
        <g key={n.l} transform={`translate(${n.x - 50} ${n.y - 17})`}>
          <rect
            width="100"
            height="34"
            rx="10"
            fill="var(--bg-elevated)"
            stroke={n.main ? "var(--accent)" : "var(--border-strong)"}
            strokeDasharray={n.soon ? "3 3" : undefined}
          />
          <circle cx="14" cy="17" r="3" fill={n.soon ? "var(--fg-subtle)" : "var(--accent)"} className={n.soon ? "" : "animate-blink"} />
          <text x="24" y="20" fontSize="8" fill={n.soon ? "var(--fg-subtle)" : "var(--fg)"} style={mono}>
            {n.l}
          </text>
        </g>
      ))}
    </>
  );
}

/* ───────────── Real-time IoT telemetry ───────────── */
function Iot() {
  const series = [0, 1, 2].map((s) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = 24 + i * 8.8;
      const y = 120 + s * 22 - Math.sin(i * 0.38 + s * 1.7) * (26 - s * 6) - Math.sin(i * 1.1 + s) * 7 - (s === 0 ? i * 0.9 : 0);
      pts.push(`${round(x)},${round(y)}`);
    }
    return pts;
  });
  const main = series[0];
  const last = main[main.length - 1].split(",").map(Number);
  return (
    <>
      <defs>
        <linearGradient id="iotFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[50, 90, 130, 170, 210].map((y) => (
        <line key={y} x1="24" x2="376" y1={y} y2={y} stroke="var(--border)" />
      ))}
      <polygon points={`24,210 ${main.join(" ")} 376,210`} fill="url(#iotFill)" />
      {series.slice(1).map((p, i) => (
        <polyline key={i} points={p.join(" ")} fill="none" stroke={i === 0 ? "var(--accent-2)" : "var(--fg-subtle)"} strokeWidth="1.2" opacity=".7" />
      ))}
      <polyline points={main.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="9" fill="var(--accent)" opacity=".3" className="svg-pulse" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--accent)" />
      <g transform="translate(24 18)">
        <rect width="58" height="20" rx="10" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <circle cx="13" cy="10" r="3" fill="#22c55e" className="animate-blink" />
        <text x="21" y="13" fontSize="7.5" fill="var(--fg)" style={mono}>LIVE</text>
      </g>
      <text x="376" y="31" fontSize="7.5" textAnchor="end" fill="var(--fg-muted)" style={mono}>
        Δt &lt; 1s · Cosmos DB
      </text>
    </>
  );
}

/* ───────────── LDA — 64 → 2 dimensions ───────────── */
function Lda() {
  const r = rng(42);
  const a = Array.from({ length: 46 }, () => ({ x: round(140 + gauss(r) * 34), y: round(150 + gauss(r) * 24) }));
  const b = Array.from({ length: 46 }, () => ({ x: round(262 + gauss(r) * 34), y: round(92 + gauss(r) * 24) }));
  return (
    <>
      <line x1="40" y1="214" x2="370" y2="214" stroke="var(--border-strong)" />
      <line x1="40" y1="20" x2="40" y2="214" stroke="var(--border-strong)" />
      <text x="370" y="228" fontSize="7.5" textAnchor="end" fill="var(--fg-subtle)" style={mono}>LD1</text>
      <text x="30" y="26" fontSize="7.5" textAnchor="end" fill="var(--fg-subtle)" style={mono}>LD2</text>
      <line x1="120" y1="30" x2="300" y2="210" stroke="var(--fg)" strokeDasharray="4 5" opacity=".45" className="animate-dash" />
      {a.map((p, i) => (
        <circle key={`a${i}`} cx={p.x} cy={p.y} r="2.6" fill="var(--accent)" opacity=".85" />
      ))}
      {b.map((p, i) => (
        <circle key={`b${i}`} cx={p.x} cy={p.y} r="2.6" fill="none" stroke="var(--accent-2)" strokeWidth="1.2" />
      ))}
      <g transform="translate(286 170)">
        <rect width="86" height="34" rx="8" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <circle cx="12" cy="12" r="2.6" fill="var(--accent)" />
        <text x="20" y="14.5" fontSize="7" fill="var(--fg-muted)" style={mono}>class A</text>
        <circle cx="12" cy="24" r="2.6" fill="none" stroke="var(--accent-2)" strokeWidth="1.2" />
        <text x="20" y="26.5" fontSize="7" fill="var(--fg-muted)" style={mono}>class B</text>
      </g>
      <text x="58" y="34" fontSize="7.5" fill="var(--fg-muted)" style={mono}>64 ch → 2D</text>
    </>
  );
}

/* ───────────── Fleet routing PWA ───────────── */
function Fleet() {
  const route = "M54 196 C 110 196, 112 128, 168 128 S 230 70, 282 76 S 330 52, 348 40";
  return (
    <>
      {[
        "M0 60 C 80 70, 160 40, 400 64",
        "M0 150 C 120 160, 260 120, 400 140",
        "M90 0 C 100 80, 70 160, 96 240",
        "M250 0 C 236 90, 270 160, 246 240",
        "M0 220 C 140 200, 260 228, 400 200",
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--border-strong)" strokeWidth="5" opacity=".5" strokeLinecap="round" />
      ))}
      <path d={route} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" opacity=".35" />
      <path d={route} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" className="animate-dash" />
      <circle cx="54" cy="196" r="6" fill="var(--bg-elevated)" stroke="var(--accent)" strokeWidth="2" />
      <g transform="translate(348 40)">
        <circle r="12" fill="var(--accent)" opacity=".25" className="svg-pulse" />
        <path d="M0 4 C-8 -4 -7 -14 0 -14 S 8 -4 0 4z" fill="var(--accent)" transform="translate(0 -2)" />
      </g>
      <g>
        <rect x="-9" y="-6" width="18" height="12" rx="3" fill="var(--fg)" />
        <animateMotion dur="7s" repeatCount="indefinite" path={route} rotate="auto" />
      </g>
      <g transform="translate(24 20)">
        <rect width="96" height="22" rx="11" fill="var(--bg-elevated)" stroke="var(--border-strong)" />
        <text x="12" y="14.5" fontSize="7.5" fill="var(--fg-muted)" style={mono}>
          ETA · <tspan fill="var(--accent)">optimised</tspan>
        </text>
      </g>
    </>
  );
}

const ART: Record<ArtKind, () => React.ReactElement> = {
  ledger: Ledger,
  rag: Rag,
  agents: Agents,
  iot: Iot,
  lda: Lda,
  fleet: Fleet,
};

/** Generative cover art for a project (or a real image when `project.image` is set). */
export function ProjectArt({ project, className, priority }: { project: Project; className?: string; priority?: boolean }) {
  const Art = ART[project.art];
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* ambient backdrop */}
      <div aria-hidden className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 40%, var(--accent-soft), transparent 70%), radial-gradient(40% 50% at 85% 10%, color-mix(in oklab, var(--accent-2) 14%, transparent), transparent 70%)",
        }}
      />
      {project.image ? (
        <Image
          src={project.image}
          alt={`${project.title} cover`}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <svg
          viewBox="0 0 400 240"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full p-3"
          role="img"
          aria-label={`${project.title} illustration`}
        >
          <Art />
        </svg>
      )}
    </div>
  );
}
