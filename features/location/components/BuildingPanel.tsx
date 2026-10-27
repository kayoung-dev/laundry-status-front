import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { LAUNDRY_PENDING } from "@/features/location/constants";
import type { Hall } from "@/features/location/types";
import { countStates, hallMachines, kindSummary, laundryFloorsLabel, locationPath } from "@/features/location/utils";
import FloorList from "./FloorList";
import StateCounts from "./StateCounts";
import styles from "./BuildingPanel.module.css";

/** Beside the hall view: where the laundry rooms are, machine states and every floor. */
export default function BuildingPanel({ hall }: { hall: Hall }) {
  const machines = hallMachines(hall);
  const first = hall.laundries[0];

  return (
    <div className={styles.panel}>
      <section aria-labelledby="laundry-summary-title" className={styles.summary}>
        {first ? (
          <>
            <div className={styles.heading}>
              <span className={styles.eyebrow}>
                {hall.laundries.length === 1 ? "세탁실은 한 곳이에요" : `세탁실은 ${hall.laundries.length}곳이에요`}
              </span>
              <h2 id="laundry-summary-title" className={styles.title}>
                {laundryFloorsLabel(hall)} · {kindSummary(machines)}
              </h2>
            </div>
            <StateCounts counts={countStates(machines)} />
            <Link href={locationPath(hall.id, first.floor)} className={styles.primary}>
              {first.floor}층 배치도 보기
              <Icon name="chevron-right" size={14} />
            </Link>
          </>
        ) : (
          <div className={styles.heading}>
            <span className={styles.eyebrow}>{hall.name}</span>
            <h2 id="laundry-summary-title" className={styles.title}>
              {LAUNDRY_PENDING}
            </h2>
            <p className={styles.note}>관리자가 세탁실을 등록하면 층과 기기 번호를 보여드려요.</p>
          </div>
        )}
      </section>
      <FloorList hall={hall} />
    </div>
  );
}
