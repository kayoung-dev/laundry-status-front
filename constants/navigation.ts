import type { IconName } from "@/components/ui/Icon";

// Site-wide navigation shared by the header, bottom tab bar and footer.

// Until there is a room picker (and student login), every "내 세탁실" link goes
// to one configured room.
export const DEFAULT_ROOM = {
  id: process.env.NEXT_PUBLIC_DEFAULT_ROOM_ID ?? "seed-room",
  name: process.env.NEXT_PUBLIC_DEFAULT_ROOM_NAME ?? "비전관 세탁실",
};

export const DEFAULT_ROOM_PATH = `/room/${DEFAULT_ROOM.id}`;

export const LOCATION_PATH = "/location";

export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";

// Residence halls in the header picker. Static until the backend lists rooms
// per hall; picking one changes the label and opens hallRoomPath(hall).
export const HALLS = ["비전관", "은혜관", "하용조관", "벧엘관", "로뎀관", "국제관", "갈대상자관"];

export const DEFAULT_HALL = HALLS[0];

/** Room page of a hall. Every hall shares DEFAULT_ROOM until the backend maps halls to rooms. */
export function hallRoomPath(_hall: string): string {
  return DEFAULT_ROOM_PATH;
}

export type NavId = "room" | "my" | "location";

// "#" = the page does not exist yet (내 세탁 needs student login).
export interface NavItem {
  id: NavId;
  label: string;
  href: string;
  icon: IconName;
  /** Tab bar icon while this is the current page. */
  activeIcon?: IconName;
  isNew?: boolean;
}

// The header shows this one as the hall picker; the tab bar and footer link it.
export const ROOM_NAV_ITEM: NavItem = { id: "room", label: "생활관 세탁실", href: DEFAULT_ROOM_PATH, icon: "grid", activeIcon: "grid-solid" };

export const PAGE_NAV_ITEMS: NavItem[] = [
  { id: "my", label: "내 세탁", href: "#", icon: "basket" },
  { id: "location", label: "세탁실 위치", href: LOCATION_PATH, icon: "pin", isNew: true },
];

export const NAV_ITEMS: NavItem[] = [ROOM_NAV_ITEM, ...PAGE_NAV_ITEMS];

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
      { label: "사용 방법", href: "/#how" },
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
