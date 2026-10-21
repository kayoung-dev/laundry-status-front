import { useMemo } from "react";
import { TYPE_LABEL } from "@/constants/machine-labels";
import type { MachineSnapshotItem, TypeSummary } from "../types";
import styles from "./RoomSummary.module.css";

interface RoomSummaryProps {
  machines: MachineSnapshotItem[];
}

/** "세탁기 3대 중 1대 사용 가능" per machine type. */
export default function RoomSummary({ machines }: RoomSummaryProps) {
  const summaries = useMemo(() => {
    const groups = new Map<string, TypeSummary>();
    for (const machine of machines) {
      const group = groups.get(machine.type) ?? { type: machine.type, total: 0, available: 0 };
      group.total += 1;
      if (machine.state === "available") {
        group.available += 1;
      }
      groups.set(machine.type, group);
    }
    return Array.from(groups.values());
  }, [machines]);

  return (
    <section aria-label="room summary" className={styles.summary}>
      {summaries.length === 0 ? (
        <p>기기 정보를 불러오는 중입니다...</p>
      ) : (
        <ul>
          {summaries.map((group) => (
            <li key={group.type}>
              {TYPE_LABEL[group.type] ?? group.type} {group.total}대 중 {group.available}대 사용 가능
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
