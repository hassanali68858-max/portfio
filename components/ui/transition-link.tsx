"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { usePageTransition } from "@/components/providers/transition-provider";

type Props = React.ComponentProps<typeof Link> & { label?: string };

/** <Link> that plays the curtain page transition before navigating. */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, label, onClick, children, ...props },
  ref
) {
  const { navigate } = usePageTransition();
  return (
    <Link
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(typeof href === "string" ? href : (href.pathname ?? "/"), label);
      }}
      {...props}
    >
      {children}
    </Link>
  );
});
