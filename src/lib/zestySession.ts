/** Guest chat session — client-app only (no shared package with admin-dashboard). */
const ZESTY_SESSION_KEY = "zestify_zesty_session_id";

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Guest chat session id — persisted for rate-limit bucketing and continuity. */
export function getOrCreateZestySessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = localStorage.getItem(ZESTY_SESSION_KEY)?.trim();
  if (existing) {
    return existing;
  }

  const sessionId = generateSessionId();
  localStorage.setItem(ZESTY_SESSION_KEY, sessionId);
  return sessionId;
}
