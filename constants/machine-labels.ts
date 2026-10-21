import type { MachineState } from "@/types/machine";

export const STATE_LABEL: Record<MachineState, string> = {
  available: "사용 가능",
  in_use: "사용 중",
  maintenance: "점검 중",
  error: "오류",
  unknown: "확인 불가",
};

export const TYPE_LABEL: Record<string, string> = {
  washer: "세탁기",
  dryer: "건조기",
};
