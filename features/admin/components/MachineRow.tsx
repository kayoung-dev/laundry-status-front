import Badge from "@/components/ui/Badge";
import type { MachineState } from "@/types/machine";
import type { AuditEntry, DashboardMachine } from "../types";
import AuditLogList from "./AuditLogList";
import MachineStateBadge from "./MachineStateBadge";
import styles from "./MachineRow.module.css";
import OverrideActions from "./OverrideActions";

interface MachineRowProps {
  machine: DashboardMachine;
  busy: boolean;
  /** Present while the audit log is open. */
  auditEntries?: AuditEntry[];
  onOverride: (state: MachineState) => void;
  onClearOverride: () => void;
  onToggleAudit: () => void;
}

export default function MachineRow({
  machine,
  busy,
  auditEntries,
  onOverride,
  onClearOverride,
  onToggleAudit,
}: MachineRowProps) {
  return (
    <tr>
      <td>{machine.roomName}</td>
      <td>{machine.label}</td>
      <td>
        <MachineStateBadge state={machine.state} />
      </td>
      <td>
        {machine.cameraDown ? (
          <Badge tone="danger" emphasis>
            카메라 연결 끊김
          </Badge>
        ) : (
          "-"
        )}
      </td>
      <td>{machine.remainingMin ?? "-"}</td>
      <td>{machine.errorCode ?? "-"}</td>
      <td className={machine.needsCheck ? styles.needsCheck : undefined}>
        {machine.needsCheck ? `확인 필요 (제보 ${machine.reportCount}건)` : "-"}
      </td>
      <td>{machine.overrideActive ? `ON (${machine.overrideBy ?? "?"})` : "OFF"}</td>
      <td>
        <OverrideActions
          busy={busy}
          overrideActive={machine.overrideActive}
          onOverride={onOverride}
          onClear={onClearOverride}
          onToggleAudit={onToggleAudit}
        />
        {auditEntries && <AuditLogList entries={auditEntries} />}
      </td>
    </tr>
  );
}
