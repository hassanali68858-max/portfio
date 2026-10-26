"use client";

import Link from "next/link";
import { site } from "@/lib/data";
import { useScrollTo } from "@/lib/hooks/use-scroll-to";

export function Logo() {
  const scrollTo = useScrollTo();
  return (
    <Link
      href="/"
      onClick={(e) => {
        e.preventDefault();
        scrollTo("top");
      }}
      className="group flex items-center gap-2.5 rounded-full"
      aria-label={`${site.name} — back to top`}
    >
      <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[10px] bg-fg font-display text-[13px] font-semibold tracking-tight text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] group-hover:scale-105">
        {site.initials}
        <span className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/0 to-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="hidden font-display text-[15px] font-medium tracking-tight text-fg sm:block">
        {site.shortName}
      </span>
    </Link>
  );
}
