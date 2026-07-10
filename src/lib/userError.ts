/** When true, alerts/toasts may include HTTP status and raw response bodies (dev). */
export const SHOW_DETAILED_API_ERRORS = (() => {
  const raw = process.env.NEXT_PUBLIC_SHOW_DETAILED_API_ERRORS?.trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return process.env.NODE_ENV !== "production";
})();

function messageFromJson(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  ) {
    const message = (value as { message: string }).message.trim();
    return message || null;
  }
  return null;
}

export function extractApiMessage(raw: string): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      return messageFromJson(JSON.parse(trimmed));
    } catch {
      // fall through
    }
  }

  const embedded = trimmed.match(/:\s*(\{[\s\S]*\})\s*$/);
  if (embedded?.[1]) {
    try {
      return messageFromJson(JSON.parse(embedded[1]));
    } catch {
      // fall through
    }
  }

  const start = trimmed.indexOf("{");
  if (start !== -1) {
    try {
      return messageFromJson(JSON.parse(trimmed.slice(start)));
    } catch {
      // fall through
    }
  }

  return null;
}

const TECHNICAL_ERROR =
  /^(?:request|login|registration|payment|checkout|subscription|verification) failed/i;

/**
 * Formats an error for customer-facing alerts and toasts.
 * In production (or when NEXT_PUBLIC_SHOW_DETAILED_API_ERRORS=false),
 * only the API `message` field is shown when available.
 */
export function formatUserError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  if (!raw.trim()) return fallback;

  if (SHOW_DETAILED_API_ERRORS) return raw;

  const apiMessage = extractApiMessage(raw);
  if (apiMessage) return apiMessage;

  if (TECHNICAL_ERROR.test(raw) || /\(\d{3}\)/.test(raw)) {
    return fallback;
  }

  return raw;
}
