"use client";

import { useCallback, useEffect, useState } from "react";
import { MY_MACHINE_STORAGE_KEY } from "../constants";
import { readStored, writeStored } from "../utils";

/**
 * The machine this browser registered as "내 세탁". Kept per browser until
 * student accounts exist; null before mount and when nothing is registered.
 */
export function useMyLaundry() {
  const [myMachineId, setMyMachineId] = useState<string | null>(null);

  useEffect(() => {
    setMyMachineId(readStored<string | null>(MY_MACHINE_STORAGE_KEY, null));
  }, []);

  const register = useCallback((machineId: string | null) => {
    setMyMachineId(machineId);
    writeStored(MY_MACHINE_STORAGE_KEY, machineId);
  }, []);

  return { myMachineId, register };
}
