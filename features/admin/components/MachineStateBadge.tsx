import Badge, { type BadgeTone } from "@/components/ui/Badge";
import { STATE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";

const STATE_TONE: Record<MachineState, BadgeTone> = {
  available: "success",
  in_use: "info",
  maintenance: "danger",
  error: "danger",
  unknown: "neutral",
};

export default function MachineStateBadge({ state }: { state: MachineState }) {
  return <Badge tone={STATE_TONE[state]}>{STATE_LABEL[state]}</Badge>;
}
