import type { MachineState } from "@/types/machine";
import styles from "./StatePill.module.css";

interface StatePillProps {
  /** Color of the pill; null = no information yet (gray). */
  state: MachineState | null;
  children: string;
}

/** Rounded label with a colored dot: "빈 세탁기 2", "비어 있음", "준비 중". */
export default function StatePill({ state, children }: StatePillProps) {
  return (
    <span className={styles.pill} data-state={state ?? undefined}>
      <span aria-hidden="true" className={styles.dot} />
      {children}
    </span>
  );
}
