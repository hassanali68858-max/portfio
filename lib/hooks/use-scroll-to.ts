"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";
import { usePathname, useRouter } from "next/navigation";

/** Smoothly scroll to a section id, navigating home first when on a sub-page */
export function useScrollTo() {
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();

  return useCallback(
    (id: string) => {
      if (pathname !== "/") {
        router.push(id === "top" ? "/" : `/#${id}`);
        return;
      }
      const target = id === "top" ? 0 : (`#${id}` as const);
      if (lenis) {
        lenis.scrollTo(target, { offset: id === "top" ? 0 : -24, duration: 1.4 });
      } else if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
      history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
    },
    [lenis, pathname, router]
  );
}
