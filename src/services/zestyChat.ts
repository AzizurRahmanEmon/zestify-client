import {
  API_URL,
  COOKIE_SESSION,
  customerFetchInit,
  fetchWithRetry,
  TENANT_ID,
} from "@/lib/api";
import { getCurrentCustomer } from "@/lib/auth";
import { extractApiMessage } from "@/lib/userError";
import type {
  ZestyChatResponse,
  ZestyChatSessionSummary,
  ZestyStoredChatMessage,
  ZestyUiCard,
} from "@/types/zestyChat";

type ZestyChatApiPayload = {
  reply: string;
  sessionId: string;
  uiCard?: ZestyUiCard;
  refreshCustomerLists?: boolean;
};

function guestSessionQuery(guestSessionId: string): string {
  return `guestSessionId=${encodeURIComponent(guestSessionId)}`;
}

function buildGuestSessionParams(guestSessionId: string): string {
  return guestSessionId ? `?${guestSessionQuery(guestSessionId)}` : "";
}

export function isZestyChatConfigured(): boolean {
  return Boolean(TENANT_ID);
}

export async function listZestySessions(
  guestSessionId: string,
): Promise<ZestyChatSessionSummary[]> {
  const customer = getCurrentCustomer();
  const token = customer?.token ?? COOKIE_SESSION;

  const res = await fetchWithRetry(
    `${API_URL}/chat/zesty/sessions${buildGuestSessionParams(guestSessionId)}`,
    customerFetchInit({ token }),
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: { sessions?: ZestyChatSessionSummary[] };
  };

  if (!res.ok || json.success === false) {
    throw new Error(
      json.message ||
        extractApiMessage(JSON.stringify(json)) ||
        "Failed to load chat sessions",
    );
  }

  return json.data?.sessions ?? [];
}

export async function getZestySession(
  sessionId: string,
  guestSessionId: string,
): Promise<{ sessionId: string; messages: ZestyStoredChatMessage[] }> {
  const customer = getCurrentCustomer();
  const token = customer?.token ?? COOKIE_SESSION;

  const res = await fetchWithRetry(
    `${API_URL}/chat/zesty/sessions/${encodeURIComponent(sessionId)}${buildGuestSessionParams(guestSessionId)}`,
    customerFetchInit({ token }),
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: {
      sessionId?: string;
      messages?: ZestyStoredChatMessage[];
    };
  };

  if (!res.ok || json.success === false) {
    throw new Error(
      json.message ||
        extractApiMessage(JSON.stringify(json)) ||
        "Failed to load chat session",
    );
  }

  return {
    sessionId: json.data?.sessionId ?? sessionId,
    messages: json.data?.messages ?? [],
  };
}

export async function deleteZestySession(
  sessionId: string,
  guestSessionId: string,
): Promise<void> {
  const customer = getCurrentCustomer();
  const token = customer?.token ?? COOKIE_SESSION;

  const res = await fetchWithRetry(
    `${API_URL}/chat/zesty/sessions/${encodeURIComponent(sessionId)}${buildGuestSessionParams(guestSessionId)}`,
    customerFetchInit({ method: "DELETE", token }),
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!res.ok || json.success === false) {
    throw new Error(
      json.message ||
        extractApiMessage(JSON.stringify(json)) ||
        "Failed to delete chat session",
    );
  }
}

export async function sendZestyMessage({
  message,
  sessionId,
  guestSessionId,
}: {
  message: string;
  sessionId?: string;
  guestSessionId: string;
}): Promise<ZestyChatResponse> {
  if (!TENANT_ID) {
    throw new Error(
      "NEXT_PUBLIC_TENANT_ID is missing. Zesty chat requires your restaurant tenant ID.",
    );
  }

  const customer = getCurrentCustomer();
  const token = customer?.token ?? COOKIE_SESSION;

  const res = await fetchWithRetry(
    `${API_URL}/chat/zesty`,
    customerFetchInit({
      method: "POST",
      token,
      body: JSON.stringify({
        message,
        guestSessionId,
        ...(sessionId ? { sessionId } : {}),
      }),
    }),
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: ZestyChatApiPayload;
  };

  if (!res.ok || json.success === false) {
    const detail =
      json.message ||
      extractApiMessage(JSON.stringify(json)) ||
      `Chat request failed (${res.status})`;
    throw new Error(detail);
  }

  if (!json.data?.sessionId) {
    throw new Error("Zesty returned an empty response. Please try again.");
  }

  const reply =
    json.data.reply?.trim() ||
    (json.data.uiCard
      ? "Here's what I found — see the details above."
      : "I couldn't generate a reply — please try rephrasing your question.");

  return {
    reply,
    sessionId: json.data.sessionId,
    ...(json.data.uiCard ? { uiCard: json.data.uiCard } : {}),
    ...(json.data.refreshCustomerLists
      ? { refreshCustomerLists: true }
      : {}),
  };
}
