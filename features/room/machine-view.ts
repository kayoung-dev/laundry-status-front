import { STATE_LABEL, TYPE_LABEL } from "@/constants/machine-labels";
import { formatClock } from "@/lib/time";
import type { WashStage } from "@/types/machine";
import { CYCLE_MIN, DEFAULT_CYCLE_MIN, SOON_MIN, STAGE_END_RATIO, STAGE_NAME, TYPE_ORDER, WASH_STAGES } from "./constants";
import type { MachineSnapshotItem, MachineView, StepView, TypeCount } from "./types";

export function typeLabel(type: string): string {
  return TYPE_LABEL[type] ?? type;
}

export function sortTypes(types: string[]): string[] {
  const rank = (type: string) => (TYPE_ORDER.includes(type) ? TYPE_ORDER.indexOf(type) : TYPE_ORDER.length);
  return [...types].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

export function countByType(machines: MachineSnapshotItem[]): TypeCount[] {
  const counts = new Map<string, TypeCount>();
  for (const machine of machines) {
    const count = counts.get(machine.type) ?? { type: machine.type, total: 0, available: 0 };
    count.total += 1;
    if (machine.state === "available") {
      count.available += 1;
    }
    counts.set(machine.type, count);
  }
  return sortTypes([...counts.keys()]).map((type) => counts.get(type)!);
}

/** Share of the cycle already done, from minutes left and the type's typical cycle. */
function elapsedRatio(type: string, remainingMin: number): number {
  const total = Math.max(CYCLE_MIN[type] ?? DEFAULT_CYCLE_MIN, remainingMin);
  return (total - remainingMin) / total;
}

/** The OCR stage when sent, else a guess from how far the cycle is. */
function currentStage(stage: WashStage | null, ratio: number | null): WashStage | null {
  if (stage) {
    return stage;
  }
  if (ratio == null) {
    return null;
  }
  return WASH_STAGES.find((s) => ratio < STAGE_END_RATIO[s]) ?? "spin";
}

function washSteps(current: WashStage, ratio: number | null): StepView[] {
  const currentIndex = WASH_STAGES.indexOf(current);
  return WASH_STAGES.map((stage, index) => {
    const start = index === 0 ? 0 : STAGE_END_RATIO[WASH_STAGES[index - 1]];
    const end = STAGE_END_RATIO[stage];
    if (index < currentIndex) {
      return { name: STAGE_NAME[stage], status: "done", fill: 1 };
    }
    if (index > currentIndex) {
      return { name: STAGE_NAME[stage], status: "todo", fill: 0 };
    }
    // The OCR stage wins over the time estimate, so keep the fill inside this step.
    const fill = ratio == null ? 0.5 : Math.min(0.95, Math.max(0.05, (ratio - start) / (end - start)));
    return { name: STAGE_NAME[stage], status: "current", fill };
  });
}

export function describeMachine(machine: MachineSnapshotItem, now: Date | null): MachineView {
  const { label, state, type } = machine;
  const base: MachineView = {
    tone: "unknown",
    badge: STATE_LABEL[state],
    dialLabel: "",
    dialValue: "",
    dialNumeric: false,
    dialSub: "",
    dialAria: `${label}, ${STATE_LABEL[state]}`,
    progress: 0,
    title: "",
    sub: "",
    steps: null,
    bar: null,
    meta: "",
    remainingMin: null,
    canNotify: false,
    canRegister: false,
  };

  if (state === "available") {
    return {
      ...base,
      tone: "free",
      badge: "비어 있음",
      dialLabel: "지금",
      dialValue: "비어 있음",
      dialAria: `${label}, 비어 있음`,
      progress: 1,
      title: "바로 사용 가능",
      canRegister: true,
    };
  }

  if (state === "in_use") {
    const left = machine.remainingMin;
    const ratio = left == null ? null : elapsedRatio(type, left);
    const soon = left != null && left <= SOON_MIN;
    const endAt = left != null && now ? formatClock(now, left) : "";
    const view: MachineView = {
      ...base,
      tone: soon ? "soon" : "busy",
      badge: soon ? "곧 끝나요" : "동작 중",
      dialLabel: left == null ? "지금" : "남은 시간",
      dialValue: left == null ? "사용 중" : `${left}분`,
      dialNumeric: left != null,
      dialSub: endAt ? `${endAt} 종료` : "",
      dialAria:
        left == null
          ? `${label}, 사용 중`
          : `${label}, 진행률 ${Math.round((ratio ?? 0) * 100)}퍼센트, ${left}분 남음`,
      progress: ratio ?? 0,
      meta: endAt ? `${endAt} 종료 예정` : "끝나는 시간을 확인하고 있어요",
      remainingMin: left,
      canNotify: true,
    };
    if (type === "washer") {
      const stage = currentStage(machine.washStage, ratio);
      if (stage) {
        view.title = `${STAGE_NAME[stage]} 중`;
        view.sub = `3단계 중 ${WASH_STAGES.indexOf(stage) + 1}단계`;
        view.steps = washSteps(stage, ratio);
      } else {
        view.title = "세탁 중";
      }
    } else {
      view.title = type === "dryer" ? "건조 중" : "사용 중";
      if (ratio != null) {
        view.sub = `${Math.round(ratio * 100)}% 진행`;
        view.bar = ratio;
      }
    }
    return view;
  }

  if (state === "maintenance" || state === "error") {
    return {
      ...base,
      tone: "off",
      dialLabel: state === "error" ? "오류" : "점검",
      dialValue: "사용 불가",
      title: "사용할 수 없어요",
      meta:
        state === "error"
          ? machine.errorCode
            ? `기기에 오류 코드 ${machine.errorCode}가 떠 있어요`
            : "기기에 오류가 떠 있어요"
          : "관리실에서 점검하고 있어요",
    };
  }

  return {
    ...base,
    tone: "unknown",
    dialLabel: "상태",
    dialValue: "확인 중",
    title: "상태를 확인하고 있어요",
    meta: "카메라에서 최근 신호가 없어요. 실제와 다르면 알려 주세요.",
  };
}

/** The machine of `type` that frees up first, among those in use with a known end time. */
export function nextToFinish(machines: MachineSnapshotItem[], type: string): MachineSnapshotItem | null {
  return (
    machines
      .filter((m) => m.type === type && m.state === "in_use" && m.remainingMin != null)
      .sort((a, b) => a.remainingMin! - b.remainingMin!)[0] ?? null
  );
}
