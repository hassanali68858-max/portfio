/**
 * ─────────────────────────────────────────────────────────────
 *  All site content lives here. Edit this file to update the
 *  portfolio — no component changes needed.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Muhammad Hassan Ali",
  shortName: "Hassan Ali",
  initials: "HA",
  title: "AI Engineer & Senior Full-Stack Engineer",
  location: "Finland",
  timezone: "Europe/Helsinki",
  email: "hassanali68858@gmail.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hassanali.vercel.app",
  availability: "Open to new roles & select projects",
  tagline: "I build AI systems that hold up in production.",
  shortBio:
    "AI Engineer and Senior Full-Stack Engineer with 5+ years shipping production systems — from RAG pipelines and multi-agent orchestration to real-time dashboards and offline-first mobile apps.",
  about: [
    "I work where models meet real users. Over the last five years I've shipped Generative AI, classical ML and enterprise JavaScript applications — all into live use, not just notebooks.",
    "My bias is toward the simplest thing that's provably right. At Kinectro I trained LSTMs first, read the data, then pivoted to logistic regression with LDA — the simpler model won on accuracy and was far easier for scientists to trust. That instinct carries through everything I build: grounded LLM answers, cent-level validated financial pipelines, and dashboards that stay calm under hundreds of concurrent streams.",
    "I'm currently completing an M.Sc. in Artificial Intelligence at the University of Jyväskylä and based in Finland.",
  ],
  stats: [
    { value: 5, suffix: "+", label: "Years shipping" },
    { value: 200, suffix: "+", label: "Docs in a live RAG" },
    { value: 40, suffix: "%", label: "Faster research insight" },
  ],
} as const;

// TODO: replace the LinkedIn / GitHub URLs and handles with your real profiles.
export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/", handle: "in/hassan-ali", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/", handle: "@hassanali", icon: "github" },
  { label: "Email", href: `mailto:${site.email}`, handle: site.email, icon: "mail" },
] as const;

export const navItems = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* ───────────────────────── Projects ───────────────────────── */

export type ProjectCategory = "ai" | "web" | "mobile";
export type ProjectArt = "ledger" | "rag" | "agents" | "iot" | "lda" | "fleet";

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  role: string;
  summary: string;
  categories: ProjectCategory[];
  stack: string[];
  art: ProjectArt;
  /** Bento size on desktop */
  size: "xl" | "tall" | "wide" | "sm";
  /** Optional real cover image in /public — replaces the generative art */
  image?: string;
  status?: string;
  overview: string;
  challenge: string;
  approach: string[];
  outcomes: { value: string; label: string }[];
}

export const filters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & ML" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
];

export const projects: Project[] = [
  {
    slug: "ai-bookkeeping",
    title: "AI Bookkeeping for Sole Traders",
    client: "Happy2Tech Oy",
    year: "2026",
    role: "Senior AI Engineer",
    summary:
      "An iOS & Android app that turns receipts, invoices and Wolt payouts into VAT returns and accountant-ready files.",
    categories: ["mobile", "ai"],
    stack: ["React Native", "Expo", "Gemini", "Supabase", "PostgreSQL", "SQLite"],
    art: "ledger",
    size: "xl",
    overview:
      "Finnish sole traders lose hours every month reconciling paper receipts, PDF invoices and delivery-platform payouts. I built and shipped an AI-first bookkeeping app that reads every document, files it correctly and produces VAT returns plus accountant-ready reports.",
    challenge:
      "Financial data leaves no room for 'mostly right'. The model output had to be validated to the cent across four Finnish VAT rates (25.5 / 13.5 / 10 / 0 %), work offline, and stay reliable when the upstream model was overloaded or out of quota.",
    approach: [
      "AI document-reading pipeline: Gemini behind a Supabase Edge Function with schema-constrained JSON and cent-level validation of every VAT line, for photos and PDFs.",
      "Decision logic around the model — income vs. expense by business-ID matching, non-deductible VAT detection, and tips split out of Wolt self-billing invoices.",
      "Production hardening: retries with model fallback on overload and quota errors, a per-user daily AI quota, and API keys kept strictly server-side.",
      "Offline-first sync between SQLite and PostgreSQL with row-level security, SHA-256 duplicate detection, and Google Drive filing with monthly Excel summaries.",
      "P&L, balance sheet, cash-flow and VAT-return reports, a trilingual UI (EN / FI / SV) and biometric app lock.",
    ],
    outcomes: [
      { value: "4", label: "VAT rates validated to the cent" },
      { value: "3", label: "Languages — EN / FI / SV" },
      { value: "100%", label: "Offline-first capture" },
    ],
  },
  {
    slug: "financial-ai-assistant",
    title: "Financial AI Assistant",
    client: "ShuttlePro",
    year: "2024 – 2025",
    role: "AI Engineer",
    summary:
      "A production RAG assistant grounded in 200+ financial documents — retrieval leads every answer, so responses stay source-anchored.",
    categories: ["ai"],
    stack: ["Python", "Sentence-Transformers", "Vector DB", "GPT-4o-mini", "Prompt Engineering"],
    art: "rag",
    size: "tall",
    overview:
      "An end-to-end retrieval-augmented assistant that answers questions over a large internal corpus of financial documents with grounded, source-cited responses.",
    challenge:
      "Generic LLM answers hallucinate on domain-specific finance questions, and the documents themselves couldn't be sent to third-party embedding services.",
    approach: [
      "Embedded 200+ financial documents with a local sentence-transformers model, keeping document content off external services.",
      "Stored vectors for fast similarity search and wired retrieval into GPT-4o-mini so retrieved context leads every answer.",
      "Chose GPT-4o-mini deliberately — strong reasoning at a sustainable per-token cost for production traffic.",
      "Prompted for source-anchored responses, surfacing citations alongside each answer.",
    ],
    outcomes: [
      { value: "200+", label: "Documents embedded" },
      { value: "Local", label: "Embeddings — data stays private" },
      { value: "Cited", label: "Source-anchored answers" },
    ],
  },
  {
    slug: "multi-agent-flight-planner",
    title: "Multi-Agent Flight Planner",
    client: "Independent R&D",
    year: "2025 – Now",
    role: "Architect & Engineer",
    summary:
      "A ReACT-based orchestration layer where cooperating agents scrape live fares and assemble the cheapest end-to-end trip.",
    categories: ["ai"],
    stack: ["Python", "ReACT", "LLM Orchestration", "OpenAI APIs", "Web Search"],
    art: "agents",
    size: "sm",
    status: "In progress",
    overview:
      "A multi-agent system built on the ReACT (reason + act) pattern that plans trips by delegating work to specialised agents.",
    challenge:
      "Travel planning spans many live data sources and trade-offs. A single prompt can't reliably search, compare and consolidate — the work needs to be decomposed.",
    approach: [
      "Agent 1 scrapes live flight details and pricing via web search tooling.",
      "Agent 2 consolidates the cheapest options into a single coherent trip plan.",
      "Roadmap: hotel agent, ground-transport agent, and a top-level itinerary agent that owns the full trip end to end.",
    ],
    outcomes: [
      { value: "2 → 5", label: "Agents, current → planned" },
      { value: "ReACT", label: "Reason + act orchestration" },
      { value: "Live", label: "Real-time fare data" },
    ],
  },
  {
    slug: "realtime-iot-dashboards",
    title: "Real-time IoT Dashboards",
    client: "ShuttlePro",
    year: "2023 – 2026",
    role: "Senior Software Engineer",
    summary:
      "Sub-second React + Highcharts dashboards across hundreds of concurrent IoT streams, backed by Node.js and Cosmos DB.",
    categories: ["web"],
    stack: ["React", "Highcharts", "Node.js", "Cosmos DB", "Azure IoT Hub"],
    art: "iot",
    size: "wide",
    overview:
      "Operational dashboards and device APIs for an IoT ecosystem — live telemetry visualised for operators, with secure bi-directional communication between hardware and Azure.",
    challenge:
      "Hundreds of concurrent data streams updating sub-second will choke a naive charting layer and hammer the database with reads.",
    approach: [
      "Engineered React + Highcharts dashboards tuned for sub-second updates without dropping frames.",
      "Built Node.js Web APIs with Cosmos DB queries optimised for high-throughput reads.",
      "Designed low-latency, secure bi-directional device APIs between hardware and Azure cloud services.",
    ],
    outcomes: [
      { value: "<1s", label: "Update latency" },
      { value: "100s", label: "Concurrent streams" },
      { value: "2-way", label: "Secure device comms" },
    ],
  },
  {
    slug: "simpli-fi-research-portal",
    title: "Simpli-Fi Neural Signal Portal",
    client: "Kinectro",
    year: "2022 – 2023",
    role: "ML Engineer",
    summary:
      "64-channel sensor classification with LDA and live prediction feeds — scientists found trends 40% faster.",
    categories: ["ai", "web"],
    stack: ["Python", "scikit-learn", "TensorFlow", "Azure Functions", "Highcharts", "Angular"],
    art: "lda",
    size: "wide",
    overview:
      "I led the ML side of Kinectro end to end: 64-channel sensor ingestion, preprocessing, classification and real-time results inside a research portal used by the science team.",
    challenge:
      "LSTMs looked like the obvious fit for sequential sensor data — but they overfit, and the science team needed models they could interpret, not just accuracy numbers.",
    approach: [
      "Trained LSTMs first; after enough runs the sequential structure proved weaker than expected. Pivoted to logistic regression with Linear Discriminant Analysis projecting 64 dimensions onto a 2D plane.",
      "Applied Min-Max and Z-score normalisation across all 64 channels so wildly different sensor ranges stopped dominating the projection.",
      "Wrote the full ML workflow as a chain of Azure Function Apps — ingest, preprocess, batch inference, alert dispatch — running with no manual touch.",
      "Built the Simpli-Fi Research Portal with Highcharts visualisations and live prediction feeds.",
    ],
    outcomes: [
      { value: "40%", label: "Faster trend identification" },
      { value: "64 → 2", label: "Dimensions via LDA" },
      { value: "0", label: "Manual pipeline steps" },
    ],
  },
  {
    slug: "trucking-management-pwa",
    title: "Trucking Management System",
    client: "ShuttlePro",
    year: "2023 – 2026",
    role: "Senior Software Engineer",
    summary:
      "Admin portal shipped as both a Progressive Web App and full MERN app — dispatcher routing got measurably faster.",
    categories: ["web", "mobile"],
    stack: ["MongoDB", "Express", "React", "Node.js", "PWA"],
    art: "fleet",
    size: "sm",
    overview:
      "The admin portal for a trucking management platform, delivered as an installable Progressive Web App and a full MERN web application.",
    challenge:
      "Dispatchers work from desks and from the yard. The tool had to be fast on desktop and installable, resilient and touch-friendly on mobile.",
    approach: [
      "Built a single React codebase delivered as both a PWA and a full web app.",
      "Designed Node.js + MongoDB services around dispatcher routing workflows.",
      "Focused UX on the highest-frequency dispatcher actions to cut routing time.",
    ],
    outcomes: [
      { value: "PWA", label: "Installable on any device" },
      { value: "1", label: "Codebase, two targets" },
      { value: "↑", label: "Dispatcher routing speed" },
    ],
  },
];

/** Smaller shipped work shown as a compact list under the bento grid */
export const alsoShipped = [
  { title: "aiqrcreator.com", desc: "SaaS QR platform with Stripe subscriptions", year: "2021" },
  { title: "CNIC Recognition CNN", desc: "TensorFlow/Keras identity-card classifier", year: "2022–23" },
  { title: "Debt Recovery Platform", desc: "Regulatory reports with zero deficiencies", year: "2023–26" },
  { title: "Support Chatbot", desc: "Bot Framework + Dialogflow ticket deflection", year: "2023–26" },
];

/* ───────────────────────── Skills ───────────────────────── */

export const skillRings = [
  { label: "Generative AI & LLMs", value: 94, detail: "RAG · Agents · Prompting" },
  { label: "Full-Stack Engineering", value: 92, detail: "React · Next.js · Node" },
  { label: "Machine Learning", value: 86, detail: "TF · Keras · scikit-learn" },
  { label: "Cloud & DevOps", value: 82, detail: "Azure · AWS · Terraform" },
];

export const skillBars = [
  { label: "Python", value: 93 },
  { label: "TypeScript / JavaScript", value: 95 },
  { label: "React & Next.js", value: 94 },
  { label: "Node.js & FastAPI", value: 90 },
  { label: "RAG & Vector Databases", value: 91 },
  { label: "Azure (Functions, Cosmos, IoT Hub)", value: 85 },
];

export const toolbelt = [
  "Python", "TypeScript", "React 18", "Next.js", "Node.js", "FastAPI", "OpenAI", "Gemini",
  "Sentence-Transformers", "TensorFlow", "Keras", "scikit-learn", "Supabase", "PostgreSQL",
  "Cosmos DB", "Azure", "AWS", "Terraform", "Highcharts", "React Native", "Expo", "Redis", "Stripe",
];

export const principles = [
  {
    n: "01",
    title: "Ground it in data",
    body: "Retrieved context leads every LLM answer. Validation happens to the cent, not 'close enough'.",
  },
  {
    n: "02",
    title: "Simplest model that wins",
    body: "I'll train the fancy network — then ship the interpretable one if it's more accurate.",
  },
  {
    n: "03",
    title: "Built for the bad day",
    body: "Retries, model fallback, quotas and offline-first sync. Production is where the work begins.",
  },
];

/* ───────────────────────── Experience ───────────────────────── */

export const experience = [
  {
    role: "Senior AI Engineer",
    company: "Happy2Tech Oy",
    period: "May 2026 — Sep 2026",
    summary:
      "Built and shipped an AI bookkeeping app for Finnish sole traders — Gemini document pipeline, offline-first sync and full financial reporting.",
    tags: ["Gemini", "Supabase", "React Native"],
  },
  {
    role: "AI Engineer · Senior Software Engineer",
    company: "ShuttlePro",
    period: "Sep 2023 — Mar 2026",
    summary:
      "Shipped a production RAG assistant, real-time IoT dashboards, a trucking PWA and a compliance-grade debt recovery platform for a major US client.",
    tags: ["RAG", "GPT-4o-mini", "React", "Node.js", "Azure"],
  },
  {
    role: "Software Engineer · ML Engineer",
    company: "Kinectro",
    period: "Jun 2022 — Aug 2023",
    summary:
      "Led ML end to end for 64-channel sensor classification; built the Simpli-Fi Research Portal and a CNN for identity-card recognition.",
    tags: ["LDA", "TensorFlow", "Azure Functions"],
  },
  {
    role: "Software Engineer, CRM & Workflow Automation",
    company: "DANZ Management Consulting",
    period: "Jan 2022 — May 2022",
    summary:
      "Custom Node.js CRMs, real-time cross-system sync and LLM-based chat labelling. 40–60% faster via Redis caching and Bull queues.",
    tags: ["Node.js", "Redis", "LLM APIs"],
  },
];

export const education = [
  {
    degree: "M.Sc. Artificial Intelligence",
    school: "University of Jyväskylä",
    focus: "Machine Learning · Programming of AI · Data Structures & Algorithms",
  },
  {
    degree: "B.Sc. Computer Science",
    school: "University of South Asia",
    focus: "Software Engineering · Database Systems · System Design",
  },
];

export const awards = [
  { title: "2nd Runner-Up, COMPPEC", by: "NUST Competitive Programming Event" },
  { title: "Employee of the Year", by: "For exceptional technical contributions" },
];

export const languages = [
  { name: "English", level: "Professional" },
  { name: "Finnish", level: "Elementary" },
];
