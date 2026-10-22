"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MachineState } from "@/types/machine";
import { ALERTS_STORAGE_KEY } from "../constants";
import type { MachineSnapshotItem } from "../types";
import { readStored, writeStored } from "../utils";

/**
 * "끝나면 알림": which machines this browser watches, and a browser
 * notification when a watched machine turns available while the page is open.
 * My machine is watched unless turned off. `onMyMachineDone` fires when my
 * machine finishes, so the caller can clear the registration.
 */
export function useMachineAlerts(
  machines: MachineSnapshotItem[],
  myMachineId: string | null,
  onMyMachineDone: () => void,
) {
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});
  const previousStates = useRef<Record<string, MachineState>>({});

  useEffect(() => {
    setAlerts(readStored<Record<string, boolean>>(ALERTS_STORAGE_KEY, {}));
  }, []);

  const isOn = useCallback(
    (machineId: string) => alerts[machineId] ?? machineId === myMachineId,
    [alerts, myMachineId],
  );

  const setAlert = useCallback((machineId: string, on: boolean | null) => {
    setAlerts((prev) => {
      const next = { ...prev };
      if (on == null) {
        delete next[machineId];
      } else {
        next[machineId] = on;
      }
      writeStored(ALERTS_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (machineId: string) => {
      const on = !isOn(machineId);
      setAlert(machineId, on);
      if (on && "Notification" in window && Notification.permission === "default") {
        void Notification.requestPermission();
      }
    },
    [isOn, setAlert],
  );

  useEffect(() => {
    for (const machine of machines) {
      const before = previousStates.current[machine.machineId];
      previousStates.current[machine.machineId] = machine.state;
      if (before !== "in_use" || machine.state !== "available") {
        continue;
      }
      if (isOn(machine.machineId)) {
        notify(`${machine.label} 사용이 끝났어요`, "지금 가면 바로 쓸 수 있어요.");
        setAlert(machine.machineId, null);
      }
      if (machine.machineId === myMachineId) {
        onMyMachineDone();
      }
    }
  }, [machines, isOn, setAlert, myMachineId, onMyMachineDone]);

  return { isOn, toggle };
}

function notify(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
