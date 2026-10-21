"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Message from "@/components/ui/Message";
import PageContainer from "@/components/ui/PageContainer";
import { ApiError, UnauthorizedError } from "@/lib/api/client";
import { login } from "../api";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
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
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err instanceof ApiError) {
        setError("로그인에 실패했습니다.");
      } else {
        setError("서버에 연결할 수 없습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer width="wide">
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
        {error && <Message tone="danger">{error}</Message>}
      </form>
    </PageContainer>
  );
}
