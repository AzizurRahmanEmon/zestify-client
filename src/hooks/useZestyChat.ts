"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/date";
import { buildZestyBookingIntentMessage } from "@/lib/zestyDeepLink";
import { getOrCreateZestySessionId } from "@/lib/zestySession";
import { formatUserError } from "@/lib/userError";
import {
  deleteZestySession,
  getZestySession,
  isZestyChatConfigured,
  listZestySessions,
  sendZestyMessage,
} from "@/services/zestyChat";
import type {
  ZestyChatMessage,
  ZestyChatSessionSummary,
  ZestyStoredChatMessage,
} from "@/types/zestyChat";

const ALERT_DURATION = 4000;

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveSessionTitle(firstMessage: string): string {
  const normalized = firstMessage.replace(/\s+/g, " ").trim();
  if (normalized.length <= 40) {
    return normalized || "New conversation";
  }
  return `${normalized.slice(0, 40).trim()}…`;
}

function mapStoredMessages(stored: ZestyStoredChatMessage[]): ZestyChatMessage[] {
  return stored.map((message, index) => ({
    id: `stored-${index}-${message.createdAt}`,
    role: message.role,
    content: message.content,
    ...(message.uiCard ? { uiCard: message.uiCard } : {}),
  }));
}

function sortSessionsByRecency(
  sessions: ZestyChatSessionSummary[],
): ZestyChatSessionSummary[] {
  return [...sessions].sort(
    (left, right) =>
      new Date(right.lastMessageAt).getTime() -
      new Date(left.lastMessageAt).getTime(),
  );
}

export function useZestyChat(options?: { enableSessionList?: boolean }) {
  const enableSessionList = options?.enableSessionList ?? true;
  const searchParams = useSearchParams();
  const [guestSessionId, setGuestSessionId] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ZestyChatSessionSummary[]>([]);
  const [messages, setMessages] = useState<ZestyChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const deepLinkHandledRef = useRef(false);

  const isConfigured = useMemo(() => isZestyChatConfigured(), []);

  useEffect(() => {
    setGuestSessionId(getOrCreateZestySessionId());
  }, []);

  const refreshSessions = useCallback(async () => {
    if (!enableSessionList || !guestSessionId || !isConfigured) {
      return;
    }

    setIsLoadingSessions(true);
    try {
      const list = await listZestySessions(guestSessionId);
      setSessions(sortSessionsByRecency(list));
    } catch (error) {
      toast.error(formatUserError(error, "Failed to load chat history."), {
        autoClose: ALERT_DURATION,
      });
    } finally {
      setIsLoadingSessions(false);
    }
  }, [enableSessionList, guestSessionId, isConfigured]);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const createNewChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
  }, []);

  const loadSession = useCallback(
    async (sessionId: string) => {
      if (!guestSessionId) {
        return;
      }

      setIsLoadingSession(true);
      try {
        const data = await getZestySession(sessionId, guestSessionId);
        setActiveSessionId(data.sessionId);
        setMessages(mapStoredMessages(data.messages));
        setSidebarOpen(false);
      } catch (error) {
        toast.error(formatUserError(error, "Failed to load that conversation."), {
          autoClose: ALERT_DURATION,
        });
      } finally {
        setIsLoadingSession(false);
      }
    },
    [guestSessionId],
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!guestSessionId) {
        return;
      }

      try {
        await deleteZestySession(sessionId, guestSessionId);
        setSessions((prev) => prev.filter((session) => session.id !== sessionId));
        if (activeSessionId === sessionId) {
          createNewChat();
        }
      } catch (error) {
        toast.error(formatUserError(error, "Failed to delete conversation."), {
          autoClose: ALERT_DURATION,
        });
      }
    },
    [activeSessionId, createNewChat, guestSessionId],
  );

  const sendMessage = useCallback(
    async (
      messageOverride?: string,
      options?: { startNewSession?: boolean },
    ) => {
      const trimmed = (messageOverride ?? input).trim();
      if (!trimmed || isSending || isLoadingSession) {
        return;
      }

      if (!isConfigured) {
        toast.error(
          "Chat is unavailable — restaurant tenant ID is not configured.",
          { autoClose: ALERT_DURATION },
        );
        return;
      }

      if (!guestSessionId) {
        return;
      }

      const userMessage: ZestyChatMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmed,
      };

      const sessionForRequest = options?.startNewSession
        ? undefined
        : (activeSessionId ?? undefined);
      const wasNewSession = options?.startNewSession || !activeSessionId;

      if (options?.startNewSession) {
        setActiveSessionId(null);
        setMessages([]);
      }

      setMessages((prev) => [...prev, userMessage]);
      if (!messageOverride) {
        setInput("");
      }
      setIsSending(true);

      try {
        const response = await sendZestyMessage({
          message: trimmed,
          sessionId: sessionForRequest,
          guestSessionId,
        });

        const assistantMessage: ZestyChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: response.reply,
          uiCard: response.uiCard,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setActiveSessionId(response.sessionId);

        if (response.refreshCustomerLists && typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:changed"));
        }

        if (enableSessionList) {
          const now = new Date().toISOString();
          setSessions((prev) => {
            if (wasNewSession) {
              return sortSessionsByRecency([
                {
                  id: response.sessionId,
                  title: deriveSessionTitle(trimmed),
                  lastMessageAt: now,
                  createdAt: now,
                },
                ...prev.filter((session) => session.id !== response.sessionId),
              ]);
            }

            return sortSessionsByRecency(
              prev.map((session) =>
                session.id === response.sessionId
                  ? { ...session, lastMessageAt: now }
                  : session,
              ),
            );
          });
        }
      } catch (error) {
        setMessages((prev) => prev.filter((message) => message.id !== userMessage.id));
        toast.error(formatUserError(error, "Zesty couldn't respond right now."), {
          autoClose: ALERT_DURATION,
        });
      } finally {
        setIsSending(false);
      }
    },
    [
      activeSessionId,
      enableSessionList,
      guestSessionId,
      input,
      isConfigured,
      isLoadingSession,
      isSending,
    ],
  );

  useEffect(() => {
    if (
      deepLinkHandledRef.current ||
      !guestSessionId ||
      !isConfigured ||
      isSending
    ) {
      return;
    }

    const intentMessage = buildZestyBookingIntentMessage(searchParams);
    if (!intentMessage) {
      return;
    }

    deepLinkHandledRef.current = true;
    void sendMessage(intentMessage, { startNewSession: true });
  }, [
    createNewChat,
    guestSessionId,
    isConfigured,
    isSending,
    searchParams,
    sendMessage,
  ]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      void sendMessage();
    },
    [sendMessage],
  );

  return {
    sessions,
    activeSessionId,
    messages,
    input,
    setInput,
    isSending,
    isLoadingSessions,
    isLoadingSession,
    sidebarOpen,
    setSidebarOpen,
    isConfigured,
    scrollRef,
    handleSubmit,
    sendMessage,
    createNewChat,
    loadSession,
    deleteSession,
    refreshSessions,
    formatSessionTime: formatDate,
  };
}
