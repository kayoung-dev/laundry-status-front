import type { IconName } from "@/components/ui/Icon";

// Until there is a room picker (and student login), every "내 세탁실" link goes
// to one configured room.
export const DEFAULT_ROOM = {
  id: process.env.NEXT_PUBLIC_DEFAULT_ROOM_ID ?? "seed-room",
  name: process.env.NEXT_PUBLIC_DEFAULT_ROOM_NAME ?? "비전관 세탁실",
};

export const DEFAULT_ROOM_PATH = `/room/${DEFAULT_ROOM.id}`;

// Residence halls in the header picker. Static until the backend lists rooms
// per hall; picking one only changes the label, every link still goes to DEFAULT_ROOM.
export const HALLS = ["비전관", "은혜관", "하용조관", "벧엘관", "로뎀관", "국제관", "갈대상자관"];

export const DEFAULT_HALL = HALLS[0];

// "#" = the page does not exist yet (내 세탁, 세탁실 위치 need student login / floor maps).
export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  isNew?: boolean;
}

// The header shows this one as the hall picker; the tab bar and footer link it.
export const ROOM_NAV_ITEM: NavItem = { label: "생활관 세탁실", href: DEFAULT_ROOM_PATH, icon: "grid" };

export const PAGE_NAV_ITEMS: NavItem[] = [
  { label: "내 세탁", href: "#", icon: "basket" },
  { label: "세탁실 위치", href: "#", icon: "pin", isNew: true },
];

export const NAV_ITEMS: NavItem[] = [ROOM_NAV_ITEM, ...PAGE_NAV_ITEMS];

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

export interface FooterNav {
  id: "service" | "help" | "ops";
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_NAV: FooterNav[] = [
  {
    id: "service",
    title: "서비스",
    links: NAV_ITEMS.map(({ label, href }) => ({ label, href })),
  },
  {
    id: "help",
    title: "도움말",
    links: [
      { label: "사용 방법", href: "#how" },
      { label: "자주 묻는 질문", href: "#" },
      { label: "상태 제보 안내", href: "#" },
    ],
  },
  {
    id: "ops",
    title: "운영",
    links: [
      { label: "공지사항", href: "#" },
      { label: "문의하기", href: "#" },
    ],
  },
];

// Filled in per deployment.
export const OPERATOR_INFO = "[기숙사 이름] 생활관 · 운영 문의 [연락처]";
