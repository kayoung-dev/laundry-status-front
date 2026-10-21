import { apiRequest, apiUrl } from "@/lib/api/client";
import type { MachineState } from "@/types/machine";

export function roomStreamUrl(roomId: string): string {
  return apiUrl(`/rooms/${roomId}/stream`);
}

/** US-007: anonymous student report (no auth). */
export async function submitReport(machineId: string, reportedState: MachineState, deviceId: string): Promise<void> {
  await apiRequest("/reports", {
    method: "POST",
    body: JSON.stringify({
      machine_id: machineId,
      reported_state: reportedState,
      device_id: deviceId,
    }),
  });
}
