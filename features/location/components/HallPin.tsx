"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { Hall } from "@/features/location/types";
import { locationPath } from "@/features/location/utils";
import styles from "./HallPin.module.css";

interface HallPinProps {
  hall: Hall;
  selected: boolean;
  onHover: (id: string) => void;
  onPick: (id: string) => void;
}

/** Name tag above a hall on the campus map. A plain click moves the camera there first, then opens the hall. */
export default function HallPin({ hall, selected, onHover, onPick }: HallPinProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onPick(hall.id);
  }

  return (
    <Link
      href={locationPath(hall.id)}
      className={styles.pin}
      data-selected={selected || undefined}
      aria-label={`${hall.no} ${hall.name}, 구성도 보기`}
      onClick={handleClick}
      onMouseEnter={() => onHover(hall.id)}
      onFocus={() => onHover(hall.id)}
    >
      <span className={styles.name}>{hall.name}</span>
      <span className={styles.no}>{hall.no}</span>
      <span aria-hidden="true" className={styles.stem} />
    </Link>
  );
}
