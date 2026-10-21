"use client";

import { useEffect, useMemo, useState } from "react";
import { roomStreamUrl } from "../api";
import type { ConnectionStatus, MachineChangedPayload, MachineSnapshotItem, RoomSnapshotPayload } from "../types";

/**
 * Live machine list of one room from GET /rooms/{roomId}/stream: a `snapshot`
 * on connect, then `machine_changed` patches. Sorted by label.
 */
export function useRoomStream(roomId: string) {
  const [machines, setMachines] = useState<Record<string, MachineSnapshotItem>>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const source = new EventSource(roomStreamUrl(roomId));

    source.addEventListener("snapshot", (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as RoomSnapshotPayload;
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

  return { machines: machineList, connectionStatus };
}
