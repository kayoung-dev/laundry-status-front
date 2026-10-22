import type { IconName } from "@/components/ui/Icon";

export const HERO_POINTS = ["실시간 기기 현황", "끝나면 알림", "학생 제보로 정확하게"];

export interface Feature {
  icon: IconName;
  title: string;
  body: string;
  link?: { label: string; href: string };
}

export const FEATURES: Feature[] = [
  {
    icon: "grid-accent",
    title: "실시간 기기 현황",
    body: "비어 있음, 사용 중, 곧 끝남을 기기마다 색과 글자로 함께 보여 줘요.",
  },
  {
    icon: "clock-lg",
    title: "다음 빈자리",
    body: "모두 사용 중일 땐 어떤 기기가 언제 끝나는지 순서대로 알려 줘요.",
  },
  {
    icon: "flag",
    title: "상태 제보",
    body: "화면과 실제가 다르면 카드에서 바로 알려 주세요. 같은 제보가 모이면 관리자가 확인해요.",
  },
  {
    icon: "pin",
    title: "기기 위치 안내",
    body: "처음 가는 세탁실도 몇 층 어디에 어떤 기기가 있는지 그림으로 찾아요.",
    link: { label: "세탁실 위치 보기 →", href: "#" },
  },
];
