"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface HomeLinkProps {
  className?: string;
  children: ReactNode;
}

/**
 * Logo link to `/`. Already on `/` (e.g. scrolled down or at `/#how`), a plain
 * Link only drops the hash, so this also scrolls back to the top.
 */
export default function HomeLink({ className, children }: HomeLinkProps) {
  const pathname = usePathname();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") {
      return;
    }
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <Link href="/" aria-label="WashOn 홈" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
