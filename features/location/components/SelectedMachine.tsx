"use client";

import Link from "next/link";
import { hallRoomPath } from "@/constants/navigation";
import { selectHall } from "@/hooks/useSelectedHall";
import { LOCATION_STATE_LABEL } from "@/features/location/constants";
import type { Hall, LaundryMachine } from "@/features/location/types";
import { machineName } from "@/features/location/utils";
import StatePill from "./StatePill";
import styles from "./SelectedMachine.module.css";

interface SelectedMachineProps {
  hall: Hall;
  floor: number;
  machine: LaundryMachine;
}

/** The machine picked on the plan, with the way to its live status. */
export default function SelectedMachine({ hall, floor, machine }: SelectedMachineProps) {
  return (
    <section aria-label="고른 기기" className={styles.card} aria-live="polite">
      <div className={styles.top}>
        <span className={styles.where}>
          {hall.name} {floor}층
        </span>
        <StatePill state={machine.state}>{LOCATION_STATE_LABEL[machine.state]}</StatePill>
      </div>
      <h2 className={styles.name}>
        <span aria-hidden="true" className={styles.no} data-state={machine.state}>
          {machine.no}
        </span>
        {machineName(machine)}
      </h2>
      <Link href={hallRoomPath(hall.name)} className={styles.primary} onClick={() => selectHall(hall.name)}>
        이 세탁실 현황 보기
      </Link>
    </section>
  );
}
