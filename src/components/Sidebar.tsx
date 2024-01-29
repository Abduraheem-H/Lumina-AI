import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { sessions, currentSessionId, createNewSession, setCurrentSession } = useChatStore();

  return (
    <div className="h-screen w-72 bg-brand-surface border-r border-brand-border flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Lumina</h1>
      </div>

      <div className="px-4 mb-4">
        <button
          onClick={() => createNewSession()}
          className="w-full px-4 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="px-3 py-2 text-xs text-brand-muted">No conversations yet.</div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl transition-all",
                currentSessionId === session.id
                  ? "bg-white/10 text-white"
                  : "text-brand-muted hover:bg-white/5 hover:text-white",
              )}
              onClick={() => setCurrentSession(session.id)}
            >
              <p className="text-sm font-medium truncate">{session.title}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};