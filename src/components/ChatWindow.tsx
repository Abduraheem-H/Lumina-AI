import React from 'react';
import { ChatInput } from './ChatInput';

export const ChatWindow = () => {
  return (
    <div className="main">
      <header className="header">New Chat</header>
      <section className="content">
        <p>Start by sending a message.</p>
      </section>
      <footer className="footer">
        <ChatInput />
      </footer>
    </div>
  );
};