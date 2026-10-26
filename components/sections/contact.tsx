"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { site, socials } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LocalTime } from "@/components/ui/local-time";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { ContactForm } from "./contact-form";

const iconMap = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  mail: (p: React.SVGProps<SVGSVGElement>) => <Mail {...(p as object)} />,
};

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${site.email}`;
        }
      }}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 text-left transition-colors duration-300 hover:border-line-strong hover:bg-surface-2"
      aria-label={`Copy email address ${site.email}`}
    >
      <span className="truncate font-display text-lg font-medium tracking-tight text-fg md:text-xl">{site.email}</span>
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:text-fg">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check className="h-4 w-4 text-emerald-500" />
            </motion.span>
          ) : (
            <motion.span key="i" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute -top-9 right-0 rounded-md bg-fg px-2 py-1 text-[11px] font-medium whitespace-nowrap text-bg"
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((s) => {
        const Icon = iconMap[s.icon];
        return (
          <li key={s.label}>
            <a
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={s.label}
              className="group flex h-12 items-center rounded-full border border-line bg-surface pr-4 pl-4 text-muted transition-all duration-500 ease-out-expo hover:border-transparent hover:bg-accent hover:pr-5 hover:text-accent-fg hover:shadow-[0_8px_30px_-6px_var(--accent)]"
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]" />
              <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-out-expo group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
                <span className="overflow-hidden text-sm font-medium whitespace-nowrap">
                  <span className="pl-2.5">{s.label}</span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function LocationCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5">
      <div aria-hidden className="absolute inset-0 bg-dots opacity-80 [mask-image:radial-gradient(ellipse_at_70%_50%,#000_10%,transparent_70%)]" />
      {/* pin */}
      <div aria-hidden className="absolute top-1/2 right-[22%] -translate-y-1/2">
        <span className="animate-pulse-ring absolute -inset-3 rounded-full border border-accent/60" />
        <span className="animate-pulse-ring absolute -inset-3 rounded-full border border-accent/40 [animation-delay:1.2s]" />
        <motion.span
          className="relative block h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_4px_var(--accent)]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="relative">
        <p className="font-mono text-[11px] tracking-[0.18em] text-subtle uppercase">Based in</p>
        <p className="mt-1 font-display text-xl font-semibold tracking-tight">{site.location}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-emerald-500")} />
          <LocalTime seconds className="font-mono tabular-nums" /> local time
        </p>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{ background: "radial-gradient(60% 60% at 50% 100%, var(--accent-soft), transparent 70%)" }}
      />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col">
          <SectionHeading
            index="04"
            eyebrow="Contact"
            title="Let's build something that ships."
            accent={["ships."]}
            description={`${site.availability}. Whether it's an LLM product, a full-stack build or a full-time role — I'd love to hear about it.`}
          />
          <Reveal delay={0.2} className="mt-10 space-y-4">
            <CopyEmail />
            <LocationCard />
            <div className="pt-2">
              <SocialLinks />
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
