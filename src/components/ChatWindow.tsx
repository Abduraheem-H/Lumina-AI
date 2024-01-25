import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../store/useChatStore';
import { generateChatResponse } from '../services/gemini';
import { useMutation } from '@tanstack/react-query';

export const ChatWindow = () => {
  const { sessions, currentSessionId, addMessage, createNewSession } = useChatStore();
  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const mutation = useMutation({
    mutationFn: async (messages: any[]) => generateChatResponse(messages),
    onSuccess: (response) => {
      if (!currentSessionId) {
        return;
      }

      addMessage(currentSessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      });
    },
    onError: (error: any) => {
      if (!currentSessionId) {
        return;
      }

      addMessage(currentSessionId, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error.message ?? 'Unable to fetch response.'}`,
        timestamp: Date.now(),
      });
    },
  });

  const handleSend = (content: string) => {
    const sessionId = currentSessionId ?? createNewSession();

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };

    addMessage(sessionId, userMessage);
    mutation.mutate([...(currentSession?.messages ?? []), userMessage]);
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
        {mutation.isPending && <p className="loading">Lumina is typing...</p>}
      </section>
      <footer className="footer">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  );
};