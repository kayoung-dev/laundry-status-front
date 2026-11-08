"use client";

import { useEffect, useSyncExternalStore } from "react";
import { fetchCurrentStudent } from "@/lib/api/student-session";
import type { StudentUser } from "@/types/student";

/** undefined = not known yet, null = signed out. */
type Session = StudentUser | null | undefined;

const listeners = new Set<() => void>();
let session: Session = undefined;
let loading: Promise<void> | null = null;

function emit(next: Session) {
  session = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Asks the API once per page load; a failed request counts as signed out. */
function load() {
  if (!loading) {
    loading = fetchCurrentStudent()
      .then(emit)
      .catch(() => emit(null));
  }
}

/** Call after login (with the user) or logout (with null) so every reader updates. */
export function setStudentSession(user: StudentUser | null) {
  loading = Promise.resolve();
  emit(user);
}

/**
 * The signed-in student, shared by every component that shows it. The
 * session is an httpOnly cookie scripts cannot read, so this asks
 * GET /auth/me. undefined while that is in flight.
 */
export function useStudentSession(): Session {
  useEffect(load, []);
  return useSyncExternalStore(subscribe, () => session, () => undefined);
}
