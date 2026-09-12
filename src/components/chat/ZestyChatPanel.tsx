"use client";

import ZestyUiCardRenderer from "@/components/chat/ZestyUiCardRenderer";
import type { ZestyChatMessage } from "@/types/zestyChat";

interface ZestyChatPanelProps {
  messages: ZestyChatMessage[];
  input: string;
  setInput: (value: string) => void;
  isSending: boolean;
  isLoadingSession: boolean;
  isConfigured: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (event: React.FormEvent) => void;
  onOpenSidebar: () => void;
}

const ZestyChatPanel = ({
  messages,
  input,
  setInput,
  isSending,
  isLoadingSession,
  isConfigured,
  scrollRef,
  handleSubmit,
  onOpenSidebar,
}: ZestyChatPanelProps) => {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-gray-900">Chat with Zesty</p>
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <i className="fa-solid fa-clock-rotate-left" aria-hidden />
          History
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex min-h-[20rem] flex-1 flex-col gap-4 overflow-y-auto bg-gray-50/70 p-4 sm:p-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {isLoadingSession ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Loading conversation…
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-gray-500">
              Try &ldquo;What vegan options do you have under $15?&rdquo; or
              &ldquo;Book a table for 4 this Friday.&rdquo;
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? "rounded-br-md bg-zPink text-white"
                      : "rounded-bl-md border border-gray-100 bg-white text-gray-900"
                  }`}
                >
                  {!isUser && (
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zPink">
                      Zesty
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
                    {message.content}
                  </p>
                  {!isUser && message.uiCard && (
                    <ZestyUiCardRenderer uiCard={message.uiCard} />
                  )}
                </div>
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-zPink">
                Zesty
              </p>
              <p className="mt-1 text-sm text-gray-500">Thinking…</p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 bg-white p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="zesty-chat-input" className="sr-only">
            Message Zesty
          </label>
          <input
            id="zesty-chat-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about the menu or make a reservation…"
            disabled={!isConfigured || isSending || isLoadingSession}
            maxLength={2000}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-zPink focus:outline-none focus:ring-2 focus:ring-zPink/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={
              !isConfigured || isSending || isLoadingSession || !input.trim()
            }
            className="inline-flex items-center justify-center rounded-xl bg-zPink px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZestyChatPanel;
