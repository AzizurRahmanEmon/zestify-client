"use client";

import { useZestyChat } from "@/hooks/useZestyChat";
import ZestyChatPanel from "./ZestyChatPanel";
import ZestyChatSidebar from "./ZestyChatSidebar";

const ZestyChatLayout = () => {
  const chat = useZestyChat({ enableSessionList: true });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
      <div className="flex min-h-[36rem]">
        <div className="hidden w-72 shrink-0 lg:flex">
          <ZestyChatSidebar
            sessions={chat.sessions}
            activeSessionId={chat.activeSessionId}
            isLoading={chat.isLoadingSessions}
            formatSessionTime={chat.formatSessionTime}
            onNewChat={chat.createNewChat}
            onSelectSession={(sessionId) => void chat.loadSession(sessionId)}
            onDeleteSession={(sessionId) => void chat.deleteSession(sessionId)}
            className="h-full"
          />
        </div>

        <ZestyChatPanel
          messages={chat.messages}
          input={chat.input}
          setInput={chat.setInput}
          isSending={chat.isSending}
          isLoadingSession={chat.isLoadingSession}
          isConfigured={chat.isConfigured}
          scrollRef={chat.scrollRef}
          handleSubmit={chat.handleSubmit}
          onOpenSidebar={() => chat.setSidebarOpen(true)}
        />
      </div>

      {chat.sidebarOpen && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/40 lg:hidden"
            aria-label="Close conversation list"
            onClick={() => chat.setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-30 w-[min(100%,20rem)] shadow-xl lg:hidden">
            <ZestyChatSidebar
              sessions={chat.sessions}
              activeSessionId={chat.activeSessionId}
              isLoading={chat.isLoadingSessions}
              formatSessionTime={chat.formatSessionTime}
              onNewChat={chat.createNewChat}
              onSelectSession={(sessionId) => void chat.loadSession(sessionId)}
              onDeleteSession={(sessionId) => void chat.deleteSession(sessionId)}
              onClose={() => chat.setSidebarOpen(false)}
              className="h-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ZestyChatLayout;
