"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/data";

/** Live clock in the owner's timezone — renders nothing on the server to avoid hydration drift. */
export function LocalTime({ className, seconds = false }: { className?: string; seconds?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const text = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: seconds ? "2-digit" : undefined,
        timeZone: site.timezone,
      }).format(now)
    : "--:--";
  return (
    <time className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
