import type { ReactNode } from "react";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "success" | "info" | "danger";

interface BadgeProps {
  tone?: BadgeTone;
  /** Bold text in the tone's text color, for alerts. */
  emphasis?: boolean;
  children: ReactNode;
}

/** Small inline label. */
export default function Badge({ tone = "neutral", emphasis = false, children }: BadgeProps) {
  return (
    <span className={styles.badge} data-tone={tone} data-emphasis={emphasis || undefined}>
      {children}
    </span>
  );
}
