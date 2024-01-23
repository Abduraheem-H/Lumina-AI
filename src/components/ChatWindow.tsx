import React, { useState } from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../store/useChatStore';
import { generateChatResponse } from '../services/gemini';

export const ChatWindow = () => {
  const { sessions, currentSessionId, addMessage, createNewSession } = useChatStore();
  const currentSession = sessions.find((session) => session.id === currentSessionId);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (content: string) => {
    const sessionId = currentSessionId ?? createNewSession();

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };

    addMessage(sessionId, userMessage);
    setIsLoading(true);

    try {
      const response = await generateChatResponse([
        ...(currentSession?.messages ?? []),
        userMessage,
      ]);

      addMessage(sessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      addMessage(sessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error.message ?? 'Unable to fetch response.'}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
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
        {isLoading && <p className="loading">Lumina is typing...</p>}
      </section>
      <footer className="footer">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  );
};