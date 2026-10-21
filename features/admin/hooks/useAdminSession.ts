"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UnauthorizedError } from "@/lib/api/client";
import { getCurrentAdmin, logout as logoutRequest } from "../api";
import { LOGIN_PATH } from "../constants";
import type { AdminUser } from "../types";

/**
 * Access control is a client-side check: the session lives in an httpOnly
 * cookie that page scripts cannot read, so this asks the API who it is
 * (GET /admin/auth/me) and redirects to the login page on 401. Every piece of
 * dashboard data comes from an API call the AdminAuthGuard protects, so an
 * unauthenticated visitor sees an empty shell and then the login form.
 */
export function useAdminSession(onError: (message: string) => void) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const toLogin = useCallback(() => router.replace(LOGIN_PATH), [router]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const me = await getCurrentAdmin();
        if (!cancelled) {
          setAdmin(me);
        }
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          toLogin();
          return;
        }
        onError("서버에 연결할 수 없습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toLogin, onError]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Leave either way; a stale cookie just fails the next /admin/auth/me.
    }
    toLogin();
  }, [toLogin]);

  return { admin, toLogin, logout };
}
