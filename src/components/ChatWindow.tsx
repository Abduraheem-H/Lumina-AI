import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../store/useChatStore';

export const ChatWindow = () => {
  const { sessions, currentSessionId, addMessage, createNewSession } = useChatStore();
  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const handleSend = (content: string) => {
    const sessionId = currentSessionId ?? createNewSession();

    addMessage(sessionId, {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="main">
      <header className="header">{currentSession?.title ?? 'New Chat'}</header>
      <section className="content messages">
        {!currentSession || currentSession.messages.length === 0 ? (
          <p>Start by sending a message.</p>
        ) : (
          currentSession.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </section>
      <footer className="footer">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  );
};