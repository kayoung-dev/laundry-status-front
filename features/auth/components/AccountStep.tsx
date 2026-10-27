"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { useNow } from "@/hooks/useNow";
import { requestSignupCode } from "@/features/auth/api";
import { CODE_LENGTH, CODE_TTL_SEC, SCHOOL_EMAIL_PLACEHOLDER, SIGNUP_ERRORS } from "@/features/auth/constants";
import button from "@/features/auth/styles/button.module.css";
import field from "@/features/auth/styles/field.module.css";
import step from "@/features/auth/styles/step.module.css";
import type { AccountForm } from "@/features/auth/types";
import { checkPassword, formatCountdown, isSchoolEmail } from "@/features/auth/utils";
import FormError from "./FormError";
import PasswordInput from "./PasswordInput";
import StepActions from "./StepActions";
import styles from "./AccountStep.module.css";

interface AccountStepProps {
  form: AccountForm;
  onChange: (patch: Partial<AccountForm>) => void;
  onPrev: () => void;
  onNext: () => void;
}

function secondsLeft(sentAt: number | null, now: number): number {
  return sentAt == null ? 0 : Math.max(0, CODE_TTL_SEC - Math.floor((now - sentAt) / 1000));
}

/** Step 2: verify a school email with an emailed code and choose a password. */
export default function AccountStep({ form, onChange, onPrev, onNext }: AccountStepProps) {
  const now = useNow(1000);
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const sent = form.codeSentAt != null;
  const left = secondsLeft(form.codeSentAt, now?.getTime() ?? form.codeSentAt ?? 0);
  const checks = checkPassword(form.password, form.confirm);

  function fail(message: string) {
    setError(message);
    setAttempt((n) => n + 1);
  }

  function update(patch: Partial<AccountForm>) {
    onChange(patch);
    setError("");
  }

  async function sendCode() {
    if (sending) {
      return;
    }
    if (!isSchoolEmail(form.email)) {
      return fail(SIGNUP_ERRORS.notSchool);
    }
    setError("");
    setSending(true);
    try {
      await requestSignupCode(form.email.trim());
      onChange({ codeSentAt: Date.now(), code: "" });
    } catch {
      fail(SIGNUP_ERRORS.failed);
    } finally {
      setSending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSchoolEmail(form.email)) {
      return fail(SIGNUP_ERRORS.notSchool);
    }
    if (!sent) {
      return fail(SIGNUP_ERRORS.codeNotSent);
    }
    if (secondsLeft(form.codeSentAt, Date.now()) === 0) {
      return fail(SIGNUP_ERRORS.codeExpired);
    }
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(form.code)) {
      return fail(SIGNUP_ERRORS.codeFormat);
    }
    if (!checks.every((check) => check.ok)) {
      return fail(SIGNUP_ERRORS.password);
    }
    onNext();
  }

  return (
    <form className={step.step} aria-labelledby="signup-account-title" noValidate onSubmit={onSubmit}>
      <h1 id="signup-account-title" className={step.title}>
        학교 메일로 <br className={step.mobileBreak} />
        계정을 만들어요
      </h1>

      <label className={field.label} htmlFor="signup-email">
        학교 이메일
      </label>
      <div className={field.control}>
        <input
          id="signup-email"
          className={`${field.input} ${styles.email}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={SCHOOL_EMAIL_PLACEHOLDER}
          value={form.email}
          onChange={(event) => update({ email: event.target.value })}
          aria-describedby="signup-email-hint"
        />
        <button type="button" className={button.inline} onClick={sendCode} disabled={sending}>
          {sending ? "보내는 중" : sent ? "다시 받기" : "인증 코드 받기"}
        </button>
      </div>
      <div id="signup-email-hint" aria-live="polite">
        {sent ? (
          <p className={field.success}>
            <Icon name="check-badge" size={14} className={styles.sentIcon} />
            <span>
              인증 코드를 보냈어요<span className={styles.sentMore}>. 메일함을 확인해 주세요.</span>
            </span>
          </p>
        ) : (
          <p className={field.hint}>학교 메일(ac.kr) 주소로만 가입할 수 있어요</p>
        )}
      </div>

      <label className={`${field.label} ${field.gap}`} htmlFor="signup-code">
        인증 코드
      </label>
      <div className={field.control}>
        <input
          id="signup-code"
          className={`${field.input} ${field.code} ${styles.codeInput}`}
          type="text"
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          autoComplete="one-time-code"
          placeholder={`${CODE_LENGTH}자리 숫자`}
          disabled={!sent}
          value={form.code}
          onChange={(event) => update({ code: event.target.value.replace(/\D/g, "") })}
        />
        {sent && (
          <span className={`${field.suffix} ${styles.timer}`} data-expired={left === 0 || undefined}>
            <span className="sr-only">남은 시간 </span>
            {formatCountdown(left)}
          </span>
        )}
      </div>

      <label className={`${field.label} ${field.gap}`} htmlFor="signup-password">
        비밀번호
      </label>
      <PasswordInput
        id="signup-password"
        value={form.password}
        onChange={(password) => update({ password })}
        autoComplete="new-password"
        placeholder="비밀번호"
        visible={showPassword}
        onToggleVisible={() => setShowPassword((value) => !value)}
        describedBy="signup-password-rules"
      />
      <input
        className={`${field.input} ${styles.confirm}`}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="비밀번호 확인"
        aria-label="비밀번호 확인"
        value={form.confirm}
        onChange={(event) => update({ confirm: event.target.value })}
        aria-describedby="signup-password-rules"
      />
      <ul id="signup-password-rules" aria-label="비밀번호 조건" className={styles.rules}>
        {checks.map((check) => (
          <li key={check.label} className={styles.rule} data-ok={check.ok || undefined}>
            <Icon name="check-badge" size={14} className={styles.ruleIcon} />
            {check.label}
            <span className="sr-only">{check.ok ? " 충족" : " 미충족"}</span>
          </li>
        ))}
      </ul>

      <FormError message={error} attempt={attempt} />

      <StepActions onPrev={onPrev} nextLabel="다음" />
    </form>
  );
}
