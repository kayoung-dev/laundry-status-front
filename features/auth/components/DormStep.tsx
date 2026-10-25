"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { HALLS } from "@/constants/navigation";
import { SIGNUP_ERRORS, roomsOfHall } from "@/features/auth/constants";
import field from "@/features/auth/styles/field.module.css";
import step from "@/features/auth/styles/step.module.css";
import type { DormForm } from "@/features/auth/types";
import FormError from "./FormError";
import StepActions from "./StepActions";

interface DormStepProps {
  form: DormForm;
  onChange: (patch: Partial<DormForm>) => void;
  onPrev: () => void;
  /** Creates the account; rejects when the server refuses. */
  onSubmit: () => Promise<void>;
}

/** Step 3: name, residence hall, optional floor and room, and the default laundry room. */
export default function DormStep({ form, onChange, onPrev, onSubmit }: DormStepProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const rooms = roomsOfHall(form.hall);

  function fail(message: string) {
    setError(message);
    setAttempt((n) => n + 1);
  }

  function update(patch: Partial<DormForm>) {
    onChange(patch);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) {
      return;
    }
    if (!form.name.trim()) {
      return fail(SIGNUP_ERRORS.name);
    }
    if (!form.hall) {
      return fail(SIGNUP_ERRORS.hall);
    }
    if (!form.roomId) {
      return fail(SIGNUP_ERRORS.room);
    }
    setBusy(true);
    try {
      await onSubmit();
    } catch {
      setBusy(false);
      fail(SIGNUP_ERRORS.failed);
    }
  }

  return (
    <form className={step.step} aria-labelledby="signup-dorm-title" noValidate onSubmit={submit}>
      <h1 id="signup-dorm-title" className={step.title}>
        어느 세탁실을 <br className={step.mobileBreak} />
        주로 쓰나요?
      </h1>

      <label className={field.label} htmlFor="signup-name">
        이름
      </label>
      <input
        id="signup-name"
        className={field.input}
        type="text"
        autoComplete="name"
        placeholder="이름"
        value={form.name}
        onChange={(event) => update({ name: event.target.value })}
      />

      <label className={`${field.label} ${field.gap}`} htmlFor="signup-hall">
        거주 생활관
      </label>
      <div className={field.control}>
        <select
          id="signup-hall"
          className={field.select}
          data-empty={!form.hall || undefined}
          value={form.hall}
          onChange={(event) => update({ hall: event.target.value, roomId: "" })}
        >
          <option value="">생활관을 선택하세요</option>
          {HALLS.map((hall) => (
            <option key={hall} value={hall}>
              {hall}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={14} className={field.chevron} />
      </div>

      <p className={`${field.label} ${field.gap}`} id="signup-unit-label">
        층 · 호실 <span className={field.optional}>(선택)</span>
      </p>
      <div className={field.pair} role="group" aria-labelledby="signup-unit-label">
        <div className={field.control}>
          <input
            className={field.input}
            type="text"
            inputMode="numeric"
            placeholder="예) 3"
            aria-label="층"
            value={form.floor}
            onChange={(event) => update({ floor: event.target.value.replace(/\D/g, "") })}
          />
          <span aria-hidden="true" className={field.suffix}>
            층
          </span>
        </div>
        <div className={field.control}>
          <input
            className={field.input}
            type="text"
            inputMode="numeric"
            placeholder="예) 312"
            aria-label="호실"
            value={form.roomNumber}
            onChange={(event) => update({ roomNumber: event.target.value.replace(/\D/g, "") })}
          />
          <span aria-hidden="true" className={field.suffix}>
            호
          </span>
        </div>
      </div>

      <label className={`${field.label} ${field.gap}`} htmlFor="signup-room">
        기본 세탁실
      </label>
      <div className={field.control}>
        <select
          id="signup-room"
          className={field.select}
          data-empty={!form.roomId || undefined}
          value={form.roomId}
          disabled={!form.hall}
          onChange={(event) => update({ roomId: event.target.value })}
          aria-describedby="signup-room-hint"
        >
          <option value="">{form.hall ? "세탁실을 선택하세요" : "생활관을 먼저 선택하세요"}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={14} className={field.chevron} />
      </div>
      <p id="signup-room-hint" className={field.hint}>
        생활관을 고르면 그 생활관의 세탁실을 고를 수 있어요
      </p>

      <FormError message={error} attempt={attempt} />

      <StepActions onPrev={onPrev} nextLabel="가입하기" busyLabel="가입하는 중" busy={busy} />
    </form>
  );
}
