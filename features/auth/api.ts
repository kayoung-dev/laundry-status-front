import type { TermKey } from "./constants";

// Student accounts are not in the backend yet (only /admin/auth exists), so
// these are stand-ins: each waits like a request would and accepts the input,
// so the screens can be walked through end to end. Replace every body with an
// apiRequest() call from @/lib/api/client once the backend contract exists.

export interface LoginRequest {
  email: string;
  password: string;
  /** Keep the session after the browser closes. */
  remember: boolean;
}

export interface SignupRequest {
  email: string;
  code: string;
  password: string;
  name: string;
  hall: string;
  floor: string | null;
  roomNumber: string | null;
  defaultRoomId: string;
  agreements: Record<TermKey, boolean>;
}

const STAND_IN_DELAY_MS = 900;

function standIn(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, STAND_IN_DELAY_MS));
}

export function login(_request: LoginRequest): Promise<void> {
  return standIn();
}

/** Emails a sign-up code to a school address. */
export function requestSignupCode(_email: string): Promise<void> {
  return standIn();
}

export function signup(_request: SignupRequest): Promise<void> {
  return standIn();
}
