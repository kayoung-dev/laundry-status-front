import { apiRequest, studentFetch } from "@/lib/api/client";
import type { StudentUser } from "@/types/student";
import type { TermKey } from "./constants";

// Failures are ApiErrors; signupErrorMessage() / loginErrorMessage() turn
// their status into text. Session reads and logout shared with the header
// are in @/lib/api/student-session.

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

interface LoginResponse {
  token: string;
  expiresAt: string;
  user: StudentUser;
}

/** Signs in; the API sets the httpOnly session cookie, so this must send credentials. */
export async function login(request: LoginRequest): Promise<StudentUser> {
  const res = await studentFetch<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify(request) });
  return res.user;
}

/** Emails a sign-up code to an allowed address (204). */
export async function requestSignupCode(email: string): Promise<void> {
  await apiRequest("/auth/signup/code", { method: "POST", body: JSON.stringify({ email }) });
}

/** Creates the student account (201). */
export async function signup(request: SignupRequest): Promise<void> {
  await apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(request) });
}
