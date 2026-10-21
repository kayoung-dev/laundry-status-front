"use client";

import { useCallback, useState } from "react";
import { UnauthorizedError } from "@/lib/api/client";
import { getOverrideAuditLog } from "../api";
import type { AuditEntry } from "../types";

/** Per-machine override audit log (AC #5), opened and closed from the row. */
export function useAuditLog(onUnauthorized: () => void) {
  const [audit, setAudit] = useState<Record<string, AuditEntry[]>>({});

  const load = useCallback(
    async (machineId: string) => {
      try {
        const entries = await getOverrideAuditLog(machineId);
        setAudit((prev) => ({ ...prev, [machineId]: entries }));
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          onUnauthorized();
        }
      }
    },
    [onUnauthorized],
  );

  /** Opens the log, or closes it if it is already open. */
  function toggle(machineId: string) {
    if (audit[machineId]) {
      setAudit((prev) => {
        const next = { ...prev };
        delete next[machineId];
        return next;
      });
      return;
    }
    void load(machineId);
  }

  return { audit, toggle, refresh: load };
}
