import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../store/useChatStore';
import { generateChatResponse } from '../services/gemini';
import { useMutation } from '@tanstack/react-query';

const suggestions = [
  'Write a professional email for a job application',
  'Explain quantum computing in simple terms',
  'Create a 7-day workout plan for beginners',
  'Help me debug a React useEffect loop',
];

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
          <div className="empty-state">
            <h3>How can I help you today?</h3>
            <p>Ask questions, generate content, or explore new ideas.</p>
            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
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