import { DEFAULT_ROOM } from "@/constants/navigation";

/** Email domains that can sign up or log in; the backend (washon.signup.allowed-email-domains) has the final say. */
export const ALLOWED_EMAIL_DOMAINS = ["handong.ac.kr", "gmail.com"] as const;
export const EMAIL_PLACEHOLDER = "name@handong.ac.kr";
const ALLOWED_EMAIL_TEXT = ALLOWED_EMAIL_DOMAINS.map((domain) => `@${domain}`).join(", ");

export const CODE_LENGTH = 6;
/** How long an emailed sign-up code stays valid. */
export const CODE_TTL_SEC = 300;

export const LOGIN_ERRORS = {
  empty: "이메일과 비밀번호를 모두 입력해 주세요.",
  notAllowed: `${ALLOWED_EMAIL_TEXT} 메일 주소로 로그인해 주세요.`,
  mismatch: "이메일 또는 비밀번호가 맞지 않아요. 다시 확인해 주세요.",
  tooMany: "로그인 시도가 너무 많아요. 1분 뒤에 다시 시도해 주세요.",
  social: "Google 로그인은 아직 준비하고 있어요. 이메일과 비밀번호로 로그인해 주세요.",
  failed: "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
} as const;

export const SIGNUP_STEPS = ["약관 동의", "계정 만들기", "기숙사 정보", "완료"] as const;

export type TermKey = "tos" | "privacy" | "push";

export interface Term {
  key: TermKey;
  name: string;
  required: boolean;
}

export const TERMS: Term[] = [
  { key: "tos", name: "이용약관", required: true },
  { key: "privacy", name: "개인정보 수집·이용", required: true },
  { key: "push", name: "세탁 알림·공지 수신", required: false },
];

// Placeholder text from the design until the operator supplies the real terms.
export const TERM_BODY = [
  { title: "제1조 (목적)", text: "[약관 전문] 이 약관은 WashOn이 제공하는 세탁실 현황 서비스의 이용 조건과 절차를 정하는 것을 목적으로 해요." },
  { title: "제2조 (서비스 내용)", text: "[약관 전문] 서비스는 세탁기·건조기의 사용 상태와 남은 시간, 알림 기능을 제공해요." },
  { title: "제3조 (이용자의 의무)", text: "[약관 전문] 이용자는 실제와 다른 상태를 발견하면 제보 기능으로 알려 주세요." },
];

export const PASSWORD_MIN_LENGTH = 8;

/** Shown under the sign-up email field. */
export const EMAIL_HINT = `${ALLOWED_EMAIL_TEXT} 메일로만 가입할 수 있어요`;

export const SIGNUP_ERRORS = {
  notAllowed: `${ALLOWED_EMAIL_TEXT} 메일 주소를 입력해 주세요.`,
  emailTaken: "이미 가입한 이메일이에요. 로그인해 주세요.",
  codeTooSoon: "인증 코드를 방금 보냈어요. 잠시 후 다시 받아 주세요.",
  mailFailed: "인증 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.",
  codeInvalid: "인증 코드가 맞지 않거나 만료됐어요. 이전 단계에서 코드를 다시 확인해 주세요.",
  invalid: "입력한 정보를 다시 확인해 주세요.",
  codeNotSent: "인증 코드를 먼저 받아 주세요.",
  codeFormat: `메일로 받은 ${CODE_LENGTH}자리 인증 코드를 입력해 주세요.`,
  codeExpired: "인증 코드가 만료됐어요. 다시 받아 주세요.",
  password: "비밀번호 조건을 모두 맞춰 주세요.",
  name: "이름을 입력해 주세요.",
  hall: "거주 생활관을 선택해 주세요.",
  room: "기본 세탁실을 선택해 주세요.",
  failed: "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
} as const;

export interface RoomOption {
  id: string;
  name: string;
}

/** Laundry rooms of a hall. Every hall has the one configured room until the backend maps halls to rooms. */
export function roomsOfHall(hall: string): RoomOption[] {
  return hall ? [{ id: DEFAULT_ROOM.id, name: `${hall} 세탁실` }] : [];
}

export type PanelTone = "morning" | "day" | "evening" | "night";
