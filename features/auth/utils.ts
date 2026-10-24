import { PASSWORD_MIN_LENGTH, SCHOOL_EMAIL_PATTERN, type PanelTone } from "./constants";

export function isSchoolEmail(email: string): boolean {
  return SCHOOL_EMAIL_PATTERN.test(email.trim());
}

export interface PasswordCheck {
  label: string;
  ok: boolean;
}

/** The sign-up password rules, each with whether it is met. */
export function checkPassword(password: string, confirm: string): PasswordCheck[] {
  return [
    { label: `${PASSWORD_MIN_LENGTH}자 이상`, ok: password.length >= PASSWORD_MIN_LENGTH },
    { label: "영문·숫자 포함", ok: /[A-Za-z]/.test(password) && /\d/.test(password) },
    { label: "두 비밀번호 일치", ok: password !== "" && password === confirm },
  ];
}

/** Time of day that colors the login photo panel. */
export function panelTone(now: Date | null): PanelTone {
  if (!now) {
    return "day";
  }
  const hour = now.getHours();
  if (hour >= 5 && hour < 10) {
    return "morning";
  }
  if (hour >= 10 && hour < 17) {
    return "day";
  }
  if (hour >= 17 && hour < 20) {
    return "evening";
  }
  return "night";
}

/** "04:59" from seconds left. */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
