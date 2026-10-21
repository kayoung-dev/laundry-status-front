"use client";

import { useEffect, useRef } from "react";
import Message from "@/components/ui/Message";
import PageContainer from "@/components/ui/PageContainer";
import { useMachineReports } from "../hooks/useMachineReports";
import { useRoomStream } from "../hooks/useRoomStream";
import MachineCard from "./MachineCard";
import RoomSummary from "./RoomSummary";
import styles from "./RoomView.module.css";

interface RoomViewProps {
  roomId: string;
  /** P2-001: machine from the per-machine QR deep link (?machine=), highlighted and scrolled into view. */
  highlightMachineId: string | null;
}

export default function RoomView({ roomId, highlightMachineId }: RoomViewProps) {
  const { machines, connectionStatus } = useRoomStream(roomId);
  const { openReportFor, reportAck, toggleReport, report } = useMachineReports();
  const highlightedCardRef = useRef<HTMLElement | null>(null);
  const hasScrolledToHighlight = useRef(false);

  // Scroll the highlighted card into view once, the first time it renders
  // (i.e. once the SSE snapshot has populated machines and includes the
  // requested machine id). Guarded so later SSE updates don't re-scroll.
  useEffect(() => {
    if (!highlightMachineId || hasScrolledToHighlight.current) {
      return;
    }
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolledToHighlight.current = true;
    }
  }, [highlightMachineId, machines]);

  return (
    <PageContainer width="narrow">
      <h1>세탁실 현황</h1>
      {connectionStatus === "connecting" && (
        <Message tone="warning" size="sm">
          실시간 연결 중...
        </Message>
      )}
      {connectionStatus === "error" && (
        <Message tone="warning" size="sm">
          실시간 연결에 문제가 발생했습니다. 재연결을 시도합니다.
        </Message>
      )}

      <RoomSummary machines={machines} />

      <section aria-label="machine list" className={styles.machineGrid}>
        {machines.map((machine) => {
          const isHighlighted = machine.machineId === highlightMachineId;
          return (
            <MachineCard
              key={machine.machineId}
              ref={isHighlighted ? highlightedCardRef : undefined}
              machine={machine}
              highlighted={isHighlighted}
              reportOpen={openReportFor === machine.machineId}
              reportAck={reportAck[machine.machineId]}
              onToggleReport={() => toggleReport(machine.machineId)}
              onReport={(state) => void report(machine.machineId, state)}
            />
          );
        })}
      </section>
    </PageContainer>
  );
}
