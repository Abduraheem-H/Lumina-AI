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
    <div className="flex-1 flex flex-col h-screen bg-brand-bg">
      <header className="h-16 border-b border-brand-border flex items-center px-6 bg-brand-bg/50">
        <h2 className="text-sm font-medium opacity-80">
          {currentSession?.title ?? 'New Chat'}
        </h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-2xl font-semibold tracking-tight mb-2">
              How can I help you today?
            </h3>
            <p className="text-brand-muted max-w-md text-sm leading-relaxed">
              Ask questions, generate content, or explore new ideas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-2xl">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left text-xs hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full py-4">
            {currentSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {mutation.isPending && (
              <div className="px-6 py-4 text-xs text-brand-muted">Lumina is typing...</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-t from-brand-bg via-brand-bg to-transparent pt-12">
        <ChatInput onSend={handleSend} isLoading={mutation.isPending} />
      </div>
    </div>
  );
};