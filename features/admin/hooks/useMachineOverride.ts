"use client";

import { useState } from "react";
import { UnauthorizedError } from "@/lib/api/client";
import type { MachineState } from "@/types/machine";
import { clearMachineOverride, setMachineOverride } from "../api";

interface UseMachineOverrideOptions {
  /** Re-read the dashboard and the machine's audit log after a change. */
  afterChange: (machineId: string) => Promise<void>;
  onUnauthorized: () => void;
  onError: (message: string) => void;
}

/** Set / clear an admin override; `busy` is the machine with a request in flight. */
export function useMachineOverride({ afterChange, onUnauthorized, onError }: UseMachineOverrideOptions) {
  const [busy, setBusy] = useState<string | null>(null);

  async function run(machineId: string, action: () => Promise<void>, failureMessage: string) {
    setBusy(machineId);
    try {
      await action();
      await afterChange(machineId);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      onError(failureMessage);
    } finally {
      setBusy(null);
    }
  }

  function override(machineId: string, state: MachineState) {
    return run(machineId, () => setMachineOverride(machineId, state), "오버라이드 설정에 실패했습니다.");
  }

  function clear(machineId: string) {
    return run(machineId, () => clearMachineOverride(machineId), "오버라이드 해제에 실패했습니다.");
  }

  return { busy, override, clear };
}
