import type { ReactNode } from "react";
import styles from "./StatusPill.module.css";

export type PillTone = "ready" | "running" | "mine" | "soon";

interface StatusPillProps {
  tone: PillTone;
  size?: "md" | "sm";
  children: ReactNode;
}

/** Rounded machine status label (색과 글자를 함께 — never color alone). */
export default function StatusPill({ tone, size = "md", children }: StatusPillProps) {
  return (
    <span className={styles.pill} data-tone={tone} data-size={size}>
      {children}
    </span>
  );
}
