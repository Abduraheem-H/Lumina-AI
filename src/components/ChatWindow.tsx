import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types/chat';

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi there! Ask me anything.',
    timestamp: Date.now(),
  },
  {
    id: '2',
    role: 'user',
    content: 'What can you help with?',
    timestamp: Date.now(),
  },
];

export const ChatWindow = () => {
  return (
    <div className="main">
      <header className="header">New Chat</header>
      <section className="content messages">
        {sampleMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </section>
      <footer className="footer">
        <ChatInput />
      </footer>
    </div>
  );
};