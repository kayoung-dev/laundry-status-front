"use client";

import { KIND_FILTERS } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import type { KindFilter } from "@/features/location/types";
import { matchesKind } from "@/features/location/utils";
import HallRow from "./HallRow";
import styles from "./HallList.module.css";

interface HallListProps {
  filter: KindFilter;
  onFilterChange: (filter: KindFilter) => void;
  selectedId: string | null;
  onHover: (id: string) => void;
  /** Phones: a sheet pulled over the map; false when the map is hidden (목록 view). */
  sheet: boolean;
}

/** "생활관 선택" beside the map (a bottom sheet on phones). Hovering a row lights up its block. */
export default function HallList({ filter, onFilterChange, selectedId, onHover, sheet }: HallListProps) {
  const halls = HALL_LIST.filter((h) => matchesKind(h, filter));

  return (
    <section aria-labelledby="hall-list-title" className={styles.panel} data-sheet={sheet || undefined}>
      <span aria-hidden="true" className={styles.grip} />
      <h2 id="hall-list-title" className={styles.title}>
        생활관 선택
      </h2>
      <div className={styles.chips}>
        {KIND_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={styles.chip}
            aria-pressed={f.id === filter}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className={styles.list}>
        {halls.map((h) => (
          <li key={h.id}>
            <HallRow hall={h} filter={filter} variant="row" selected={h.id === selectedId} onHover={onHover} />
          </li>
        ))}
      </ul>
    </section>
  );
}
