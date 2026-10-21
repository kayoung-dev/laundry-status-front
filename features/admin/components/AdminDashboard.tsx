"use client";

import { useCallback, useState } from "react";
import Message from "@/components/ui/Message";
import PageContainer from "@/components/ui/PageContainer";
import { useAdminMachines } from "../hooks/useAdminMachines";
import { useAdminSession } from "../hooks/useAdminSession";
import { useAuditLog } from "../hooks/useAuditLog";
import { useMachineOverride } from "../hooks/useMachineOverride";
import styles from "./AdminDashboard.module.css";
import MachineTable from "./MachineTable";

/** Admin dashboard (US-008): every machine with live state, overrides and audit log. */
export default function AdminDashboard() {
  // One message slot for the whole page: the latest failure wins, and the next
  // successful dashboard read clears it.
  const [error, setError] = useState<string | null>(null);
  const showError = useCallback((message: string | null) => setError(message), []);

  const { admin, toLogin, logout } = useAdminSession(showError);
  const { machines, liveConnected, reload } = useAdminMachines({
    enabled: admin !== null,
    onUnauthorized: toLogin,
    onError: showError,
  });
  const { audit, toggle: toggleAudit, refresh: refreshAudit } = useAuditLog(toLogin);
  const { busy, override, clear } = useMachineOverride({
    afterChange: async (machineId) => {
      await reload();
      await refreshAudit(machineId);
    },
    onUnauthorized: toLogin,
    onError: showError,
  });

  return (
    <PageContainer width="wide">
      <div className={styles.header}>
        <h1>관리자 대시보드</h1>
        {admin && (
          <span>
            {admin.email} ({admin.role}){" "}
            <button type="button" onClick={() => void logout()}>
              로그아웃
            </button>
          </span>
        )}
      </div>

      {error && <Message tone="danger">{error}</Message>}
      {!admin && !error && <Message tone="warning">인증 확인 중...</Message>}

      {admin && (
        <>
          <button type="button" onClick={() => void reload()}>
            새로고침
          </button>{" "}
          <Message tone="warning" inline>
            {liveConnected ? "실시간 연결됨" : "실시간 연결 끊김 (재연결 중)"}
          </Message>
          <MachineTable
            machines={machines}
            busyMachineId={busy}
            audit={audit}
            onOverride={(machineId, state) => void override(machineId, state)}
            onClearOverride={(machineId) => void clear(machineId)}
            onToggleAudit={toggleAudit}
          />
          {machines.length === 0 && <p>등록된 기기가 없습니다.</p>}
        </>
      )}
    </PageContainer>
  );
}
