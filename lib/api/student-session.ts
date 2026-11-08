import type { StudentUser } from "@/types/student";
import { UnauthorizedError, studentFetch, studentRequest } from "./client";

// Student session calls shared by every screen (the header's profile menu
// reads them); login itself lives in features/auth/api.ts.

/** The signed-in student, or null without a valid session. */
export async function fetchCurrentStudent(): Promise<StudentUser | null> {
  try {
    return await studentFetch<StudentUser>("/auth/me");
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return null;
    }
    throw err;
  }
}

/** Drops the session cookie. */
export async function logoutStudent(): Promise<void> {
  await studentRequest("/auth/logout", { method: "POST" });
}
