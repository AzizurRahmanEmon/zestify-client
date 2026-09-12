const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]?\d|2[0-3]):[0-5]\d$/;

function parseIsoDate(date: string): Date | null {
  if (!ISO_DATE_PATTERN.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatFriendlyDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeLabel(time: string): string {
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) {
    return time;
  }

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Builds an initial user message from /chat?date=&time=&partySize= deep-link params.
 * Returns null when params are missing or malformed — caller falls back to empty chat.
 */
export function buildZestyBookingIntentMessage(
  searchParams: Pick<URLSearchParams, "get">,
): string | null {
  const date = searchParams.get("date")?.trim();
  const time = searchParams.get("time")?.trim();
  const partySizeRaw = searchParams.get("partySize")?.trim();

  if (!date || !time) {
    return null;
  }

  const parsedDate = parseIsoDate(date);
  if (!parsedDate || !TIME_PATTERN.test(time)) {
    return null;
  }

  let message = `I'd like to book a table for ${formatFriendlyDate(parsedDate)} at ${formatTimeLabel(time)}`;

  if (partySizeRaw) {
    const partySize = Number.parseInt(partySizeRaw, 10);
    if (Number.isFinite(partySize) && partySize > 0) {
      message += ` for ${partySize} ${partySize === 1 ? "guest" : "guests"}`;
    }
  }

  return `${message}.`;
}
