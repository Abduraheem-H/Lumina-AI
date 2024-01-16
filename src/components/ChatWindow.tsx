import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '../store/useChatStore';

export const ChatWindow = () => {
  const { messages, addMessage } = useChatStore();

  const handleSend = (content: string) => {
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="main">
      <header className="header">New Chat</header>
      <section className="content messages">
        {messages.length === 0 ? (
          <p>Start by sending a message.</p>
        ) : (
          messages.map((message) => (
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