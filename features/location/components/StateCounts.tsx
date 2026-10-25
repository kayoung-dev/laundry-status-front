import { LOCATION_STATE_LABEL } from "@/features/location/constants";
import type { StateCount } from "@/features/location/types";
import styles from "./StateCounts.module.css";

/** Tiles with how many machines are free, running and out of service. */
export default function StateCounts({ counts }: { counts: StateCount[] }) {
  return (
    <ul className={styles.grid} aria-label="기기 상태">
      {counts.map((c) => (
        <li key={c.state} className={styles.tile} data-state={c.state}>
          <span className={styles.label}>
            <span aria-hidden="true" className={styles.dot} />
            {LOCATION_STATE_LABEL[c.state]}
          </span>
          <span className={styles.count}>{c.count}</span>
        </li>
      ))}
    </ul>
  );
}
