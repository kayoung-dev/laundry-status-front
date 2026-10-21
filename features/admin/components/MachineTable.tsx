import type { MachineState } from "@/types/machine";
import type { AuditEntry, DashboardMachine } from "../types";
import MachineRow from "./MachineRow";
import styles from "./MachineTable.module.css";

interface MachineTableProps {
  machines: DashboardMachine[];
  busyMachineId: string | null;
  /** Open audit logs by machine id. */
  audit: Record<string, AuditEntry[]>;
  onOverride: (machineId: string, state: MachineState) => void;
  onClearOverride: (machineId: string) => void;
  onToggleAudit: (machineId: string) => void;
}

export default function MachineTable({
  machines,
  busyMachineId,
  audit,
  onOverride,
  onClearOverride,
  onToggleAudit,
}: MachineTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>세탁실</th>
          <th>기기</th>
          <th>상태</th>
          <th>카메라</th>
          <th>잔여</th>
          <th>에러</th>
          <th>확인 필요</th>
          <th>오버라이드</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        {machines.map((machine) => (
          <MachineRow
            key={machine.machineId}
            machine={machine}
            busy={busyMachineId === machine.machineId}
            auditEntries={audit[machine.machineId]}
            onOverride={(state) => onOverride(machine.machineId, state)}
            onClearOverride={() => onClearOverride(machine.machineId)}
            onToggleAudit={() => onToggleAudit(machine.machineId)}
          />
        ))}
      </tbody>
    </table>
  );
}
