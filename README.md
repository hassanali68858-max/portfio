# Muhammad Hassan Ali — Portfolio

A production-ready personal portfolio built with **Next.js 15 (App Router)**, **Tailwind CSS v4** and **Motion** (Framer Motion).

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck && npm run lint
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it at vercel.com/new — framework preset **Next.js** is auto-detected, no config needed.
3. (Optional) Add environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` — your domain (used for metadata, sitemap, OG).
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — enables real email delivery from the contact form via [Resend](https://resend.com). Without them the form still validates and the API returns success (messages are logged server-side).

## Editing content

**All copy lives in `lib/data.ts`** — name, bio, projects, case studies, skills, experience, education, awards and social links. No component changes needed.

- Replace the placeholder LinkedIn / GitHub URLs in `socials` (marked `TODO`).
- To use a real project screenshot instead of the generative cover art, drop an image in `/public` and set `image: "/your-image.jpg"` on the project.
- Skill percentages (`skillRings`, `skillBars`) are self-assessed — tune them to taste.

## Structure

```
app/
  layout.tsx            fonts, metadata, providers, navbar
  page.tsx              home — hero, marquee, work, about, experience, contact
  template.tsx          per-route settle-in animation
  work/[slug]/page.tsx  statically generated case studies
  api/contact/route.ts  validated contact endpoint (Resend optional)
  sitemap.ts, robots.ts, icon.svg, not-found.tsx
components/
  providers/   theme (next-themes), Lenis smooth scroll, MotionConfig, curtain page transitions
  layout/      navbar (glass, active pill), mobile menu, scroll progress, footer
  sections/    hero ("Monolith": wordmark + 3D neural core canvas), marquee, work, about, experience, contact
  work/        bento project card, generative SVG project art, case study
  ui/          magnetic, button, text reveal, reveal, tilt card, spotlight card, cursor,
               theme toggle, progress ring, skill bar, particles, floating field, counter
lib/
  data.ts      all content
  hooks/       active section, media queries, smooth scroll-to
```

## Design & motion notes

- **Tokens** — colours are CSS variables in `app/globals.css` (`:root` = light, `.dark` = dark), mapped into Tailwind via `@theme inline`. One accent (indigo) with a violet secondary for gradients.
- **Type** — Inter (body, self-hosted variable font), Geist Sans (display), Geist Mono (labels). No build-time font fetches.
- **Theme switch** — circular "ink" reveal from the click point using the View Transitions API, with a colour cross-fade fallback.
- **Page transitions** — `TransitionLink` triggers a curtain that covers the page, swaps the route underneath, then lifts away.
- **Accessibility** — semantic landmarks, skip link, visible focus rings, ARIA on tabs/menu/form errors, and `prefers-reduced-motion` respected everywhere (Motion `reducedMotion="user"`, Lenis disabled, CSS animations neutralised, custom cursor + magnetic effects off).
- **Performance** — static generation for every route, no external images (art is inline SVG), canvas particles pause off-screen, `optimizePackageImports` for icons/motion.
