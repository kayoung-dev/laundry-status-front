import Icon from "@/components/ui/Icon";
import button from "@/features/auth/styles/button.module.css";
import field from "@/features/auth/styles/field.module.css";
import styles from "./PasswordInput.module.css";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder: string;
  /** Shared with a confirm field, so the parent owns it. */
  visible: boolean;
  onToggleVisible: () => void;
  invalid?: boolean;
  describedBy?: string;
}

/** Password field with a show/hide toggle inside its right edge. */
export default function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  visible,
  onToggleVisible,
  invalid,
  describedBy,
}: PasswordInputProps) {
  return (
    <div className={field.control}>
      <input
        id={id}
        className={`${field.input} ${styles.input}`}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <button
        type="button"
        className={`${button.icon} ${styles.toggle}`}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={visible}
        onClick={onToggleVisible}
      >
        <Icon name={visible ? "eye" : "eye-off"} size={18} />
      </button>
    </div>
  );
}
