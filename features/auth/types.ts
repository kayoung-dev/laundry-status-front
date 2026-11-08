import type { TermKey } from "./constants";

export type Agreements = Record<TermKey, boolean>;

/** Sign-up step 2. */
export interface AccountForm {
  email: string;
  code: string;
  password: string;
  confirm: string;
  /** When the last code was sent (ms), or null before the first one. */
  codeSentAt: number | null;
  /** The server accepted `code` for `email` (POST /auth/signup/code/verify). */
  codeVerified: boolean;
}

/** Sign-up step 3. */
export interface DormForm {
  name: string;
  hall: string;
  floor: string;
  roomNumber: string;
  roomId: string;
}
