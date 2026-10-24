import button from "@/features/auth/styles/button.module.css";

/** Busy indicator for a primary button. */
export default function Spinner() {
  return (
    <svg className={button.spinner} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="#ffffff40" strokeWidth="2" fill="none" />
      <path d="M9 2a7 7 0 0 1 7 7" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
