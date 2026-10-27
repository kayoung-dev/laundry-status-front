import Link from "next/link";
import { TYPE_LABEL } from "@/constants/machine-labels";
import type { Hall } from "@/features/location/types";
import { countFree, findLaundry, locationPath } from "@/features/location/utils";
import styles from "./FloorList.module.css";

/** Every floor from the top; floors with a laundry room link to their plan. */
export default function FloorList({ hall }: { hall: Hall }) {
  const floors = Array.from({ length: hall.floors }, (_, i) => hall.floors - i);

  return (
    <section aria-labelledby="floor-list-title" className={styles.panel}>
      <h2 id="floor-list-title" className={styles.title}>
        층별 세탁실
      </h2>
      <ul className={styles.list}>
        {floors.map((floor) => {
          const laundry = findLaundry(hall, floor);
          return (
            <li key={floor}>
              {laundry ? (
                <Link href={locationPath(hall.id, floor)} className={styles.row} data-laundry="">
                  <span className={styles.floor}>{floor}층</span>
                  <span className={styles.name}>세탁실</span>
                  <span className={styles.free}>
                    빈 {TYPE_LABEL.washer} {countFree(laundry.machines, "washer")} · 빈 {TYPE_LABEL.dryer} {countFree(laundry.machines, "dryer")}
                  </span>
                </Link>
              ) : (
                <span className={styles.row}>
                  <span className={styles.floor}>{floor}층</span>
                  <span className={styles.name}>세탁실 없음</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
