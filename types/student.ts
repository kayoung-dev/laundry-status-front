// Wire shape of the signed-in student (backend AuthenticatedStudent:
// GET /auth/me, POST /auth/login's `user`). Keep field names as sent.
export interface StudentUser {
  id: string;
  email: string;
  name: string;
  hall: string;
  floor: string | null;
  roomNumber: string | null;
  defaultRoomId: string | null;
}
