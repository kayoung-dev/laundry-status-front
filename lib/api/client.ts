// The only place that calls fetch() against the WashOn API.
//
// Admin auth is the httpOnly `washon_admin_session` cookie the API sets at
// login, so admin calls must opt into sending credentials cross-origin
// (frontend :3000 -> backend :8081). The cookie is unreadable from JS by
// design, which is why "am I logged in?" is a request to /admin/auth/me
// rather than a cookie check.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

/** Absolute API URL, e.g. for an EventSource. */
export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

/** A non-2xx API response. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Thrown for a 401 so callers can redirect to the login page. */
export class UnauthorizedError extends ApiError {
  constructor() {
    super(401, "unauthorized");
  }
}

async function request(path: string, init: RequestInit): Promise<Response> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: init.body ? { "Content-Type": "application/json", ...(init.headers ?? {}) } : init.headers,
  });
  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new ApiError(res.status, `${init.method ?? "GET"} ${path} failed with status ${res.status}`);
  }
  return res;
}

/** Public (student) API call without credentials. */
export function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return request(path, init);
}

/** Admin API call with the session cookie; use when the response body is not needed. */
export function adminRequest(path: string, init: RequestInit = {}): Promise<Response> {
  return request(path, { ...init, credentials: "include" });
}

/** Admin API call with the session cookie, returning the parsed JSON body. */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await adminRequest(path, init);
  return (await res.json()) as T;
}
