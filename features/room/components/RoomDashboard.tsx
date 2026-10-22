"use client";

import { useCallback, useEffect, useRef } from "react";
import { useNow } from "@/hooks/useNow";
import { useSelectedHall } from "@/hooks/useSelectedHall";
import { useMachineAlerts } from "../hooks/useMachineAlerts";
import { useMachineReports } from "../hooks/useMachineReports";
import { useMyLaundry } from "../hooks/useMyLaundry";
import { useRoomStream } from "../hooks/useRoomStream";
import LocationTile from "./LocationTile";
import MachineSection from "./MachineSection";
import MyLaundryPanel from "./MyLaundryPanel";
import RoomBanner from "./RoomBanner";
import styles from "./RoomDashboard.module.css";
import RoomVerdict from "./RoomVerdict";

interface RoomDashboardProps {
  roomId: string;
  highlightMachineId: string | null;
}

export default function RoomDashboard({ roomId, highlightMachineId }: RoomDashboardProps) {
  const hall = useSelectedHall();
  const now = useNow();
  const { machines, connectionStatus } = useRoomStream(roomId);
  const reports = useMachineReports();
  const { myMachineId, register } = useMyLaundry();
  const clearMine = useCallback(() => register(null), [register]);
  const alerts = useMachineAlerts(machines, myMachineId, clearMine);
  const highlightedCardRef = useRef<HTMLElement | null>(null);
  const hasScrolledToHighlight = useRef(false);

  // Scroll the QR-linked card into view once, the first time it renders (once
  // the SSE snapshot includes it). Guarded so later updates don't re-scroll.
  useEffect(() => {
    if (!highlightMachineId || hasScrolledToHighlight.current) {
      return;
    }
    if (highlightedCardRef.current) {
      highlightedCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      hasScrolledToHighlight.current = true;
    }
  }, [highlightMachineId, machines]);

  const myMachine = machines.find((m) => m.machineId === myMachineId) ?? null;
  const loading = machines.length === 0 && connectionStatus !== "error";

  return (
    <>
      <RoomBanner hall={hall} machines={machines} connectionStatus={connectionStatus} />
      <main className={styles.layout}>
        <div className={styles.primary}>
          <div className={styles.verdictSlot}>
            <RoomVerdict machines={machines} now={now} loading={loading} isAlertOn={alerts.isOn} onToggleAlert={alerts.toggle} />
          </div>
          <div className={styles.machinesSlot}>
            <MachineSection
              machines={machines}
              now={now}
              loading={loading}
              myMachineId={myMachineId}
              highlightMachineId={highlightMachineId}
              highlightedCardRef={highlightedCardRef}
              alerts={alerts}
              reports={reports}
              onRegister={register}
            />
          </div>
          <p className={styles.note}>기기 상태는 세탁실 카메라로 확인해요. 실제와 다르면 카드의 ‘상태가 달라요’로 알려 주세요.</p>
        </div>
        <div className={styles.secondary}>
          <div className={styles.mineSlot}>
            <MyLaundryPanel
              machine={myMachine}
              now={now}
              alertOn={myMachine ? alerts.isOn(myMachine.machineId) : false}
              onToggleAlert={() => myMachine && alerts.toggle(myMachine.machineId)}
              onUnregister={clearMine}
            />
          </div>
          <div className={styles.locationSlot}>
            <LocationTile />
          </div>
        </div>
      </main>
    </>
  );
}
