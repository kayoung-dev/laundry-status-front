import Icon from "@/components/ui/Icon";
import styles from "./FormError.module.css";

interface FormErrorProps {
  id?: string;
  message: string;
  /** Bumped on every failed try so the same message shakes again. */
  attempt: number;
}

/** Live region for a form's error message; renders nothing while there is none. */
export default function FormError({ id, message, attempt }: FormErrorProps) {
  return (
    <div id={id} aria-live="polite">
      {message && (
        <p key={attempt} className={styles.error}>
          <Icon name="alert-circle" className={styles.icon} />
          {message}
        </p>
      )}
    </div>
  );
}
