import React from 'react';
import { useChatStore } from '../store/useChatStore';

export const Sidebar = () => {
  const { sessions, currentSessionId, createNewSession, setCurrentSession } = useChatStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Lumina</h1>
        <button className="ghost-button" onClick={() => createNewSession()}>
          New Chat
        </button>
      </div>
      <div className="sidebar-section">Recent Chats</div>
      <div className="session-list">
        {sessions.length === 0 ? (
          <div className="sidebar-empty">No conversations yet.</div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
              onClick={() => setCurrentSession(session.id)}
            >
              {session.title}
            </button>
          ))
        )}
      </div>
    </aside>
  );
};