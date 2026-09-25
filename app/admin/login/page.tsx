"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";
import { API_BASE } from "../admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // credentials: "include" so the API's httpOnly session cookie is
      // stored for the subsequent dashboard calls.
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "이메일 또는 비밀번호가 올바르지 않습니다." : "로그인에 실패했습니다.");
        return;
      }
      router.replace("/admin");
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1>관리자 로그인</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "로그인 중..." : "로그인"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </main>
  );
}
