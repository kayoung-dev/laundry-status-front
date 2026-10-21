"use client";

import { useState } from "react";
import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import { submitReport } from "../api";
import { getDeviceId } from "../utils";

/**
 * "상태가 달라요" flow: which machine's picker is open, and the per-machine
 * result message. device_id is persisted per browser (getDeviceId) so repeated
 * reports from this browser dedupe as one device toward the backend's
 * needs-check threshold.
 */
export function useMachineReports() {
  const [openReportFor, setOpenReportFor] = useState<string | null>(null);
  const [reportAck, setReportAck] = useState<Record<string, string>>({});

  function toggleReport(machineId: string) {
    setOpenReportFor((current) => (current === machineId ? null : machineId));
  }

  async function report(machineId: string, reportedState: MachineState) {
    setOpenReportFor(null);
    setReportAck((prev) => ({ ...prev, [machineId]: "제보 접수 중..." }));
    try {
      await submitReport(machineId, reportedState, getDeviceId());
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

  return { openReportFor, reportAck, toggleReport, report };
}
