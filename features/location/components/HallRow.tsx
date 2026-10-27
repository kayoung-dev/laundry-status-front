import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { TYPE_LABEL } from "@/constants/machine-labels";
import { LAUNDRY_PENDING } from "@/features/location/constants";
import type { Hall, KindFilter } from "@/features/location/types";
import { countFree, hallMachines, laundryFloorsLabel, locationPath } from "@/features/location/utils";
import StatePill from "./StatePill";
import styles from "./HallRow.module.css";

interface HallRowProps {
  hall: Hall;
  filter: KindFilter;
  selected?: boolean;
  /** "card" = the 목록 view grid, "row" = the list beside the map. */
  variant: "row" | "card";
  onHover?: (id: string) => void;
}

/** One hall: number, name, where its laundry rooms are and how many machines are free. */
export default function HallRow({ hall, filter, selected, variant, onHover }: HallRowProps) {
  const machines = hallMachines(hall);
  const kind = filter === "dryer" ? "dryer" : "washer";
  const known = machines.length > 0;
  const free = countFree(machines, kind);
  const sub = known ? `세탁실 ${laundryFloorsLabel(hall)} · ${machines.length}대${hall.note ? ` · ${hall.note}` : ""}` : LAUNDRY_PENDING;
  const pill = known ? `빈 ${TYPE_LABEL[kind]} ${free}` : "준비 중";

  return (
    <Link
      href={locationPath(hall.id)}
      className={styles.row}
      data-variant={variant}
      data-selected={selected || undefined}
      onMouseEnter={onHover && (() => onHover(hall.id))}
      onFocus={onHover && (() => onHover(hall.id))}
    >
      <span className={styles.text}>
        <span className={styles.name}>
          <span className={styles.no}>{hall.no}</span>
          {hall.name}
        </span>
        <span className={styles.sub}>{sub}</span>
      </span>
      <StatePill state={free > 0 ? "available" : null}>{pill}</StatePill>
      {variant === "card" && <Icon name="chevron-right" className={styles.chevron} />}
    </Link>
  );
}
