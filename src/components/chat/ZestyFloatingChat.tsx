"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ZestyUiCardRenderer from "@/components/chat/ZestyUiCardRenderer";
import { useZestyChat } from "@/hooks/useZestyChat";
import { isZestyChatConfigured } from "@/services/zestyChat";

const ZestyFloatingChat = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isConfigured = useMemo(() => isZestyChatConfigured(), []);

  const {
    messages,
    input,
    setInput,
    isSending,
    scrollRef,
    handleSubmit,
  } = useZestyChat({ enableSessionList: false });

  if (!isConfigured || pathname === "/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Chat with Zesty"
        >
          <div className="flex items-center justify-between bg-linear-to-r from-red-600 via-orange-500 to-amber-500 px-4 py-3 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                Zesty
              </p>
              <p className="text-sm font-medium">Menu &amp; reservations</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/chat"
                className="rounded-lg px-2 py-1 text-xs font-medium text-white/90 underline-offset-2 hover:text-white hover:underline"
              >
                Open full chat
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 hover:bg-white/15"
                aria-label="Close Zesty chat"
              >
                <i className="fa-solid fa-xmark" aria-hidden />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex max-h-80 min-h-48 flex-col gap-3 overflow-y-auto bg-gray-50/80 p-3"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-gray-500">
                Ask about the menu, dietary options, or book a table.
              </p>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isUser
                        ? "rounded-br-md bg-zPink text-white"
                        : "rounded-bl-md border border-gray-100 bg-white text-gray-900"
                    }`}
                  >
                    {!isUser && (
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-zPink">
                        Zesty
                      </p>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    {!isUser && message.uiCard && (
                      <ZestyUiCardRenderer uiCard={message.uiCard} />
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 bg-white p-3"
          >
            <div className="flex gap-2">
              <label htmlFor="zesty-floating-chat-input" className="sr-only">
                Message Zesty
              </label>
              <input
                id="zesty-floating-chat-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Zesty…"
                disabled={isSending}
                maxLength={2000}
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-zPink focus:outline-none focus:ring-2 focus:ring-zPink/20 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-xl bg-zPink px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="floating-btn h-14 px-5 text-sm shadow-lg"
        aria-expanded={open}
        aria-label={open ? "Close Zesty assistant" : "Open Zesty assistant"}
      >
        <i className="fa-solid fa-comment-dots text-lg" aria-hidden />
        <span className="hidden sm:inline">Ask Zesty</span>
      </button>
    </div>
  );
};

export default ZestyFloatingChat;
