"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./room.module.css";

type MachineState = "available" | "in_use" | "done" | "maintenance" | "error" | "unknown";

// P2-002: which part of the wash cycle is running. Absent/null whenever the
// machine isn't in_use, or its OCR text doesn't use the wash-stage
// convention (see backend OcrReading.STAGE_PATTERN) -- both fall back to the
// plain "사용 중" display below, no different from before this story.
type WashStage = "wash" | "rinse" | "spin";

interface MachineSnapshotItem {
  machineId: string;
  type: string;
  label: string;
  state: MachineState;
  remainingMin: number | null;
  washStage: WashStage | null;
  errorCode: string | null;
  overrideActive: boolean;
  version: number;
  updatedAt: string | null;
}

interface MachineChangedPayload {
  machineId: string;
  state: MachineState;
  remainingMin: number | null;
  washStage: WashStage | null;
  errorCode: string | null;
  version: number;
  updatedAt: string | null;
}

type ConnectionStatus = "connecting" | "connected" | "error";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

const STATE_LABEL: Record<MachineState, string> = {
  available: "사용 가능",
  in_use: "사용 중",
  done: "완료 (세탁물 확인 필요)",
  maintenance: "점검 중",
  error: "오류",
  unknown: "확인 불가",
};

const TYPE_LABEL: Record<string, string> = {
  washer: "세탁기",
  dryer: "건조기",
};

// P2-002: stage-specific icon + label, shown next to the remaining-time
// display for an in_use machine with a known stage.
const STAGE_LABEL: Record<WashStage, string> = {
  wash: "🧺 세탁 중",
  rinse: "💧 헹굼 중",
  spin: "🌀 탈수 중",
};

// Options offered in the "상태가 달라요" picker.
const REPORTABLE_STATES: MachineState[] = ["available", "in_use", "done", "error", "unknown"];

// Anonymous per-browser identifier sent as device_id on POST /reports (plan
// section 2: student flow has no login). Persisted in localStorage so
// repeated reports from the same browser count as the same device_id, as
// US-007's needs-check threshold expects.
const DEVICE_ID_STORAGE_KEY = "washon_device_id";

function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const generated = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    // localStorage unavailable (e.g. private mode) -- fall back to a
    // per-call id; reports still work, they just won't dedupe as one device.
    return crypto.randomUUID();
  }
}

export default function RoomPage() {
  const params = useParams();
  const roomId = typeof params?.roomId === "string" ? params.roomId : undefined;

  // P2-001: per-machine QR deep link, e.g. /room/{roomId}?machine={machineId}
  // (see backend GET /machines/{machineId}/qr-target). When present, that
  // machine's card is highlighted and scrolled into view below.
  const searchParams = useSearchParams();
  const highlightMachineId = searchParams?.get("machine") ?? null;
  const highlightedCardRef = useRef<HTMLElement | null>(null);
  const hasScrolledToHighlight = useRef(false);

  const [machines, setMachines] = useState<Record<string, MachineSnapshotItem>>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [openReportFor, setOpenReportFor] = useState<string | null>(null);
  const [reportAck, setReportAck] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const source = new EventSource(`${API_BASE}/rooms/${roomId}/stream`);

    source.addEventListener("snapshot", (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as {
        roomId: string;
        machines: MachineSnapshotItem[];
      };
      const next: Record<string, MachineSnapshotItem> = {};
      for (const machine of payload.machines) {
        next[machine.machineId] = machine;
      }
      setMachines(next);
      setConnectionStatus("connected");
    });

    source.addEventListener("machine_changed", (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as MachineChangedPayload;
      setMachines((prev) => {
        const existing = prev[payload.machineId];
        if (!existing) {
          return prev;
        }
        return {
          ...prev,
          [payload.machineId]: {
            ...existing,
            state: payload.state,
            remainingMin: payload.remainingMin,
            washStage: payload.washStage,
            errorCode: payload.errorCode,
            version: payload.version,
            updatedAt: payload.updatedAt,
          },
        };
      });
      setConnectionStatus("connected");
    });

    source.onerror = () => {
      setConnectionStatus("error");
    };

    return () => {
      source.close();
    };
  }, [roomId]);

  const machineList = useMemo(
    () => Object.values(machines).sort((a, b) => a.label.localeCompare(b.label)),
    [machines],
  );

  // Scroll the highlighted card into view once, the first time it renders
  // (i.e. once the SSE snapshot has populated machineList and includes the
  // requested machine id). Guarded so later SSE updates don't re-scroll.
  useEffect(() => {
    if (!highlightMachineId || hasScrolledToHighlight.current) {
      return;
    }
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolledToHighlight.current = true;
    }
  }, [highlightMachineId, machineList]);

  const summaryByType = useMemo(() => {
    const groups = new Map<string, { total: number; available: number }>();
    for (const machine of machineList) {
      const group = groups.get(machine.type) ?? { total: 0, available: 0 };
      group.total += 1;
      if (machine.state === "available") {
        group.available += 1;
      }
      groups.set(machine.type, group);
    }
    return Array.from(groups.entries());
  }, [machineList]);

  // US-007: POST /reports, anonymous (no auth), device_id persisted per
  // browser via getDeviceId so repeated reports from this browser dedupe as
  // one device toward the backend's needs-check threshold.
  async function submitReport(machineId: string, reportedState: MachineState) {
    setOpenReportFor(null);
    setReportAck((prev) => ({ ...prev, [machineId]: "제보 접수 중..." }));
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_id: machineId,
          reported_state: reportedState,
          device_id: getDeviceId(),
        }),
      });
      if (!res.ok) {
        throw new Error(`report failed with status ${res.status}`);
      }
      setReportAck((prev) => ({
        ...prev,
        [machineId]: `"${STATE_LABEL[reportedState]}" 상태로 제보가 접수되었습니다`,
      }));
    } catch {
      setReportAck((prev) => ({
        ...prev,
        [machineId]: "제보 접수에 실패했습니다. 다시 시도해주세요.",
      }));
    }
  }

  return (
    <main className={styles.page}>
      <h1>세탁실 현황</h1>
      {connectionStatus === "connecting" && <p className={styles.status}>실시간 연결 중...</p>}
      {connectionStatus === "error" && (
        <p className={styles.status}>실시간 연결에 문제가 발생했습니다. 재연결을 시도합니다.</p>
      )}

      <section aria-label="room summary" className={styles.summary}>
        {summaryByType.length === 0 ? (
          <p>기기 정보를 불러오는 중입니다...</p>
        ) : (
          <ul>
            {summaryByType.map(([type, group]) => (
              <li key={type}>
                {TYPE_LABEL[type] ?? type} {group.total}대 중 {group.available}대 사용 가능
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="machine list" className={styles.machineGrid}>
        {machineList.map((machine) => {
          const isHighlighted = machine.machineId === highlightMachineId;
          return (
            <article
              key={machine.machineId}
              ref={isHighlighted ? highlightedCardRef : undefined}
              className={isHighlighted ? `${styles.card} ${styles.cardHighlighted}` : styles.card}
              data-state={machine.state}
              data-highlighted={isHighlighted || undefined}
            >
              <h2>{machine.label}</h2>
              <p className={styles.stateLabel}>
                {/* P2-002: known stage gets its own icon+label next to the state;
                    unknown/null stage falls back to the plain Phase-1 state label. */}
                {machine.state === "in_use" && machine.washStage
                  ? STAGE_LABEL[machine.washStage]
                  : STATE_LABEL[machine.state]}
              </p>
              {machine.state === "in_use" && machine.remainingMin != null && (
                <p>남은 시간: {machine.remainingMin}분</p>
              )}
              {machine.state === "error" && machine.errorCode && <p>에러 코드: {machine.errorCode}</p>}

              <button
                type="button"
                onClick={() =>
                  setOpenReportFor((current) => (current === machine.machineId ? null : machine.machineId))
                }
              >
                상태가 달라요
              </button>

              {openReportFor === machine.machineId && (
                <div role="group" aria-label="상태 제보" className={styles.reportPicker}>
                  <p>실제 상태를 선택해주세요:</p>
                  {REPORTABLE_STATES.map((state) => (
                    <button key={state} type="button" onClick={() => void submitReport(machine.machineId, state)}>
                      {STATE_LABEL[state]}
                    </button>
                  ))}
                </div>
              )}

              {reportAck[machine.machineId] && <p className={styles.reportAck}>{reportAck[machine.machineId]}</p>}
            </article>
          );
        })}
      </section>
    </main>
  );
}
