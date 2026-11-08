import { ApiError } from "@/lib/api/client";
import { ALLOWED_EMAIL_DOMAINS, LOGIN_ERRORS, PASSWORD_MIN_LENGTH, SIGNUP_ERRORS, type PanelTone } from "./constants";

/** An address on one of ALLOWED_EMAIL_DOMAINS (exact domain, not a subdomain). */
export function isAllowedEmail(email: string): boolean {
  const match = /^[^@\s]+@([^@\s]+)$/.exec(email.trim().toLowerCase());
  return match != null && (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(match[1]);
}

/** Login error message for a failed POST /auth/login (backend StudentAuthService). */
export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return LOGIN_ERRORS.mismatch;
  }
  if (error instanceof ApiError && error.status === 429) {
    return LOGIN_ERRORS.tooMany;
  }
  return LOGIN_ERRORS.failed;
}

/** Sign-up error message for a failed POST /auth/signup/code or /auth/signup (status codes: backend SignupService). */
export function signupErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return SIGNUP_ERRORS.failed;
  }
  switch (error.status) {
    case 400:
      return SIGNUP_ERRORS.invalid;
    case 409:
      return SIGNUP_ERRORS.emailTaken;
    case 422:
      return SIGNUP_ERRORS.codeInvalid;
    case 429:
      return SIGNUP_ERRORS.codeTooSoon;
    case 503:
      return SIGNUP_ERRORS.mailFailed;
    default:
      return SIGNUP_ERRORS.failed;
  }
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
