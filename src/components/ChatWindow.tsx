import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';

export const ChatWindow = () => {
  return (
    <div className="main">
      <header className="header">New Chat</header>
      <section className="content messages">
        <MessageBubble author="assistant" text="Hi there! Ask me anything." />
        <MessageBubble author="user" text="What can you help with?" />
      </section>
      <footer className="footer">
        <ChatInput />
      </footer>
    </div>
  );
};