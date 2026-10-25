import { HALL_LIST } from "@/features/location/hall-data";
import type { KindFilter } from "@/features/location/types";
import { matchesKind } from "@/features/location/utils";
import HallRow from "./HallRow";
import styles from "./HallGrid.module.css";

/** 목록 view: the same halls as the map, as cards keyboards and screen readers move through easily. */
export default function HallGrid({ filter }: { filter: KindFilter }) {
  return (
    <section aria-label="생활관 목록" className={styles.grid}>
      <ul className={styles.list}>
        {HALL_LIST.filter((h) => matchesKind(h, filter)).map((h) => (
          <li key={h.id}>
            <HallRow hall={h} filter={filter} variant="card" />
          </li>
        ))}
      </ul>
    </section>
  );
}
