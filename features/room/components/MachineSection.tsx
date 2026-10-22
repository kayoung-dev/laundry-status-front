"use client";

import { useState, type RefObject } from "react";
import { sortTypes, typeLabel } from "../machine-view";
import type { useMachineAlerts } from "../hooks/useMachineAlerts";
import type { useMachineReports } from "../hooks/useMachineReports";
import type { MachineSnapshotItem } from "../types";
import MachineCard from "./MachineCard";
import styles from "./MachineSection.module.css";

interface MachineSectionProps {
  machines: MachineSnapshotItem[];
  now: Date | null;
  loading: boolean;
  myMachineId: string | null;
  highlightMachineId: string | null;
  highlightedCardRef: RefObject<HTMLElement | null>;
  alerts: ReturnType<typeof useMachineAlerts>;
  reports: ReturnType<typeof useMachineReports>;
  onRegister: (machineId: string | null) => void;
}

const ALL = "all";

/** "기기 현황": type filter and one card list per machine type. */
export default function MachineSection({
  machines,
  now,
  loading,
  myMachineId,
  highlightMachineId,
  highlightedCardRef,
  alerts,
  reports,
  onRegister,
}: MachineSectionProps) {
  const [filter, setFilter] = useState(ALL);
  const types = sortTypes([...new Set(machines.map((m) => m.type))]);
  const shownTypes = types.filter((type) => filter === ALL || type === filter);

  return (
    <section aria-labelledby="machines-heading" className={styles.section}>
      <div className={styles.head}>
        <h2 id="machines-heading" className={styles.title}>
          기기 현황
        </h2>
        {types.length > 1 && (
          <div role="group" aria-label="기기 종류" className={styles.filter}>
            {[ALL, ...types].map((type) => (
              <button
                key={type}
                type="button"
                className={styles.filterButton}
                aria-pressed={filter === type}
                onClick={() => setFilter(type)}
              >
                {type === ALL ? "전체" : typeLabel(type)}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <p className={styles.empty}>기기 정보를 불러오는 중이에요…</p>}

      {shownTypes.map((type) => (
        <section key={type} aria-label={typeLabel(type)} className={styles.group}>
          <div className={styles.groupHead}>
            <h3 className={styles.groupTitle}>{typeLabel(type)}</h3>
            <span aria-hidden="true" className={styles.rule} />
          </div>
          <ul className={styles.list}>
            {machines
              .filter((m) => m.type === type)
              .map((machine) => {
                const highlighted = machine.machineId === highlightMachineId;
                const mine = machine.machineId === myMachineId;
                return (
                  <li key={machine.machineId}>
                    <MachineCard
                      ref={highlighted ? highlightedCardRef : undefined}
                      machine={machine}
                      now={now}
                      mine={mine}
                      highlighted={highlighted}
                      alertOn={alerts.isOn(machine.machineId)}
                      onToggleAlert={() => alerts.toggle(machine.machineId)}
                      onToggleRegister={() => onRegister(mine ? null : machine.machineId)}
                      reportOpen={reports.openReportFor === machine.machineId}
                      reportAck={reports.reportAck[machine.machineId]}
                      onToggleReport={() => reports.toggleReport(machine.machineId)}
                      onReport={(state) => void reports.report(machine.machineId, state)}
                    />
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </section>
  );
}
