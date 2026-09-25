"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import {
  API_BASE,
  AdminUser,
  AuditEntry,
  DashboardMachine,
  MachineState,
  UnauthorizedError,
  adminFetch,
} from "./admin-api";

const STATE_LABEL: Record<MachineState, string> = {
  available: "사용 가능",
  in_use: "사용 중",
  done: "완료",
  maintenance: "점검 중",
  error: "오류",
  unknown: "확인 불가",
};

// Mirrors OVERRIDABLE_STATES in backend/src/main/java/dev/washon/admin (OverrideRequest/AdminService).
const OVERRIDABLE_STATES: MachineState[] = ["maintenance", "error", "unknown"];

/**
 * Admin dashboard (US-008). Access control is a client-side check: the
 * session lives in an httpOnly cookie that page scripts cannot read, so this
 * page asks the API who it is (GET /admin/auth/me) and redirects to
 * /admin/login on 401. The page itself holds no secrets -- every piece of
 * data on it comes from an API call the AdminAuthGuard protects, so an
 * unauthenticated visitor sees an empty shell and then the login form.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [machines, setMachines] = useState<DashboardMachine[]>([]);
  const [audit, setAudit] = useState<Record<string, AuditEntry[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const toLogin = useCallback(() => router.replace("/admin/login"), [router]);

  const loadMachines = useCallback(async () => {
    try {
      setMachines(await adminFetch<DashboardMachine[]>("/admin/machines"));
      setError(null);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        toLogin();
        return;
      }
      setError("기기 목록을 불러오지 못했습니다.");
    }
  }, [toLogin]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const me = await adminFetch<AdminUser>("/admin/auth/me");
        if (cancelled) {
          return;
        }
        setAdmin(me);
        await loadMachines();
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          toLogin();
          return;
        }
        setError("서버에 연결할 수 없습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMachines, toLogin]);

  async function override(machineId: string, state: MachineState) {
    setBusy(machineId);
    try {
      await adminFetch(`/admin/machines/${machineId}/override`, {
        method: "POST",
        body: JSON.stringify({ state }),
      });
      await loadMachines();
      await loadAudit(machineId, true);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        toLogin();
        return;
      }
      setError("오버라이드 설정에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  }

  async function clearOverride(machineId: string) {
    setBusy(machineId);
    try {
      await adminFetch(`/admin/machines/${machineId}/override/clear`, { method: "POST" });
      await loadMachines();
      await loadAudit(machineId, true);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        toLogin();
        return;
      }
      setError("오버라이드 해제에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  }

  /** Audit log view for one machine (AC #5); `force` refreshes an open one. */
  async function loadAudit(machineId: string, force = false) {
    if (!force && audit[machineId]) {
      setAudit((prev) => {
        const next = { ...prev };
        delete next[machineId];
        return next;
      });
      return;
    }
    try {
      const entries = await adminFetch<AuditEntry[]>(
        `/admin/machines/${machineId}/events?source=admin_override&limit=20`,
      );
      setAudit((prev) => ({ ...prev, [machineId]: entries }));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        toLogin();
      }
    }
  }

  async function logout() {
    await fetch(`${API_BASE}/admin/auth/logout`, { method: "POST", credentials: "include" });
    toLogin();
  }

  return (
    <main className={styles.page}>
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

      {error && <p className={styles.error}>{error}</p>}
      {!admin && !error && <p className={styles.message}>인증 확인 중...</p>}

      {admin && (
        <>
          <button type="button" onClick={() => void loadMachines()}>
            새로고침
          </button>
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
                <tr key={machine.machineId}>
                  <td>{machine.roomName}</td>
                  <td>{machine.label}</td>
                  <td>
                    <span className={styles.badge} data-state={machine.state}>
                      {STATE_LABEL[machine.state]}
                    </span>
                  </td>
                  <td>
                    {machine.cameraDown ? (
                      <span className={styles.cameraDownBadge}>카메라 연결 끊김</span>
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
                    <div className={styles.actions}>
                      {OVERRIDABLE_STATES.map((state) => (
                        <button
                          key={state}
                          type="button"
                          disabled={busy === machine.machineId}
                          onClick={() => void override(machine.machineId, state)}
                        >
                          {STATE_LABEL[state]}로 지정
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={busy === machine.machineId || !machine.overrideActive}
                        onClick={() => void clearOverride(machine.machineId)}
                      >
                        해제
                      </button>
                      <button type="button" onClick={() => void loadAudit(machine.machineId)}>
                        감사 로그
                      </button>
                    </div>
                    {audit[machine.machineId] && (
                      <ul className={styles.audit}>
                        {audit[machine.machineId].length === 0 && <li>오버라이드 기록 없음</li>}
                        {audit[machine.machineId].map((entry) => (
                          <li key={entry.id}>
                            {new Date(entry.createdAt).toLocaleString("ko-KR")} ·{" "}
                            {entry.override?.action === "set" ? "지정" : "해제"} ({STATE_LABEL[entry.state]}) ·{" "}
                            {entry.override?.adminEmail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {machines.length === 0 && <p>등록된 기기가 없습니다.</p>}
        </>
      )}
    </main>
  );
}
