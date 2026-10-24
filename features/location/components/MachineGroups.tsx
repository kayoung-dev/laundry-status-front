"use client";

import Icon from "@/components/ui/Icon";
import { LOCATION_STATE_LABEL } from "@/features/location/constants";
import type { LaundryMachine } from "@/features/location/types";
import { countStates, machineName } from "@/features/location/utils";
import styles from "./MachineGroups.module.css";

interface MachineGroupsProps {
  machines: LaundryMachine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Every machine on the floor, grouped by state; picking one shows it on the room plan. */
export default function MachineGroups({ machines, selectedId, onSelect }: MachineGroupsProps) {
  return (
    <section aria-label={`기기 ${machines.length}대`} className={styles.panel}>
      {countStates(machines).map(({ state, count }) => (
        <div key={state} className={styles.group} data-state={state}>
          <h3 className={styles.heading}>
            <span aria-hidden="true" className={styles.dot} />
            {LOCATION_STATE_LABEL[state]}
            <span className={styles.count}>{count}대</span>
          </h3>
          <ul className={styles.items}>
            {machines
              .filter((m) => m.state === state)
              .map((m) => (
                <li key={m.id}>
                  <button type="button" className={styles.item} aria-pressed={m.id === selectedId} onClick={() => onSelect(m.id)}>
                    <span aria-hidden="true" className={styles.no}>
                      {m.no}
                    </span>
                    <span className={styles.name}>{machineName(m)}</span>
                    <Icon name="chevron-right" className={styles.chevron} />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
