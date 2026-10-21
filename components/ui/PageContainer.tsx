import type { ReactNode } from "react";
import styles from "./PageContainer.module.css";

interface PageContainerProps {
  /** narrow: student views (720px), wide: admin tables (64rem). */
  width?: "narrow" | "wide";
  children: ReactNode;
}

/** Page-level `<main>` with a centered, width-limited column. */
export default function PageContainer({ width = "narrow", children }: PageContainerProps) {
  return (
    <main className={styles.container} data-width={width}>
      {children}
    </main>
  );
}
