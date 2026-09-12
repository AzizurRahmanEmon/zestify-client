"use client";

import type { ZestyChatSessionSummary } from "@/types/zestyChat";

interface ZestyChatSidebarProps {
  sessions: ZestyChatSessionSummary[];
  activeSessionId: string | null;
  isLoading: boolean;
  formatSessionTime: (date: string) => string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose?: () => void;
  className?: string;
}

const ZestyChatSidebar = ({
  sessions,
  activeSessionId,
  isLoading,
  formatSessionTime,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClose,
  className = "",
}: ZestyChatSidebarProps) => {
  return (
    <aside
      className={`flex h-full w-full flex-col border-r border-gray-200 bg-red-50/40 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-red-100 px-4 py-3">
        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zPink px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-600"
        >
          <i className="fa-solid fa-plus" aria-hidden />
          New chat
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-red-100 lg:hidden"
            aria-label="Close conversation list"
          >
            <i className="fa-solid fa-xmark" aria-hidden />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <p className="px-3 py-6 text-center text-sm text-gray-500">
            Loading conversations…
          </p>
        ) : sessions.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-gray-500">
            Start a new conversation
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => {
              const isActive = session.id === activeSessionId;

              return (
                <li key={session.id}>
                  <div
                    className={`group flex items-start gap-1 rounded-xl transition-colors ${
                      isActive
                        ? "bg-white ring-1 ring-zPink/30 shadow-sm"
                        : "hover:bg-white/80"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectSession(session.id)}
                      className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    >
                      <p
                        className={`truncate text-sm font-medium ${
                          isActive ? "text-zPink" : "text-gray-900"
                        }`}
                      >
                        {session.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatSessionTime(session.lastMessageAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDeleteSession(session.id)}
                      className="mr-1 mt-2 rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Delete ${session.title}`}
                    >
                      <i className="fa-solid fa-trash-can text-sm" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ZestyChatSidebar;
