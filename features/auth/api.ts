import { apiRequest } from "@/lib/api/client";
import type { TermKey } from "./constants";

// Sign-up calls the backend (POST /auth/signup/code, POST /auth/signup);
// failures are ApiErrors whose status signupErrorMessage() turns into text.
// Student login is not in the backend yet, so login() is still a stand-in
// that waits like a request would and accepts the input.

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

/** Emails a sign-up code to an allowed address (204). */
export async function requestSignupCode(email: string): Promise<void> {
  await apiRequest("/auth/signup/code", { method: "POST", body: JSON.stringify({ email }) });
}

/** Creates the student account (201). */
export async function signup(request: SignupRequest): Promise<void> {
  await apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(request) });
}
