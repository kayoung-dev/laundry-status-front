"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DEFAULT_ROOM_PATH, SIGNUP_PATH } from "@/constants/navigation";
import { login } from "@/features/auth/api";
import { LOGIN_ERRORS, SCHOOL_EMAIL_PLACEHOLDER } from "@/features/auth/constants";
import button from "@/features/auth/styles/button.module.css";
import field from "@/features/auth/styles/field.module.css";
import { isSchoolEmail } from "@/features/auth/utils";
import CheckBox from "./CheckBox";
import FormError from "./FormError";
import PasswordInput from "./PasswordInput";
import Spinner from "./Spinner";
import styles from "./LoginForm.module.css";

/** Student login with a school email and password. */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);

  function fail(message: string) {
    setError(message);
    setAttempt((n) => n + 1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) {
      return;
    }
    if (!email.trim() || !password) {
      return fail(LOGIN_ERRORS.empty);
    }
    if (!isSchoolEmail(email)) {
      return fail(LOGIN_ERRORS.notSchool);
    }
    setError("");
    setBusy(true);
    try {
      await login({ email: email.trim(), password, remember });
      router.push(DEFAULT_ROOM_PATH);
    } catch {
      setBusy(false);
      fail(LOGIN_ERRORS.failed);
    }
  }

  const invalid = error !== "" && error !== LOGIN_ERRORS.social;

  return (
    <form className={styles.form} noValidate onSubmit={onSubmit}>
      <h1 className={styles.title}>로그인</h1>

      <label className={field.label} htmlFor="login-email">
        학교 이메일
      </label>
      <input
        id="login-email"
        className={field.input}
        type="email"
        inputMode="email"
        autoComplete="username"
        placeholder={SCHOOL_EMAIL_PLACEHOLDER}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
        }}
        aria-invalid={invalid || undefined}
        aria-describedby="login-error"
      />

      <label className={`${field.label} ${field.gap}`} htmlFor="login-password">
        비밀번호
      </label>
      <PasswordInput
        id="login-password"
        value={password}
        onChange={(value) => {
          setPassword(value);
          setError("");
        }}
        autoComplete="current-password"
        placeholder="비밀번호"
        visible={showPassword}
        onToggleVisible={() => setShowPassword((value) => !value)}
        invalid={invalid}
        describedBy="login-error"
      />

      <FormError id="login-error" message={error} attempt={attempt} />

      <div className={styles.options}>
        <CheckBox checked={remember} onChange={setRemember} size="sm" className={styles.remember}>
          <span className={styles.rememberWide}>로그인 상태 유지</span>
          <span className={styles.rememberShort}>로그인 유지</span>
        </CheckBox>
        <Link href="#" className={`${button.quiet} ${styles.optionLink}`}>
          비밀번호 찾기
        </Link>
      </div>

      <button type="submit" className={`${button.primary} ${styles.submit}`} aria-busy={busy}>
        {busy ? (
          <>
            <Spinner />
            로그인하는 중
          </>
        ) : (
          "로그인"
        )}
      </button>

      <div role="separator" className={styles.separator}>
        <span className={styles.rule} />
        또는
        <span className={styles.rule} />
      </div>
      <button type="button" className={`${button.social} ${styles.social}`} onClick={() => fail(LOGIN_ERRORS.social)}>
        <span aria-hidden="true" className={button.socialMark}>
          G
        </span>
        Google로 계속하기
      </button>

      <p className={styles.signup}>
        계정이 없나요?
        <Link href={SIGNUP_PATH} className={`${button.link} ${styles.signupLink}`}>
          회원가입
        </Link>
      </p>
    </form>
  );
}
