import { STATE_LABEL } from "@/constants/machine-labels";
import type { AuditEntry } from "../types";
import styles from "./AuditLogList.module.css";

export default function AuditLogList({ entries }: { entries: AuditEntry[] }) {
  return (
    <ul className={styles.audit}>
      {entries.length === 0 && <li>오버라이드 기록 없음</li>}
      {entries.map((entry) => (
        <li key={entry.id}>
          {new Date(entry.createdAt).toLocaleString("ko-KR")} · {entry.override?.action === "set" ? "지정" : "해제"}{" "}
          ({STATE_LABEL[entry.state]}) · {entry.override?.adminEmail}
        </li>
      ))}
    </ul>
  );
}
