import React from 'react';

interface MessageBubbleProps {
  author: 'user' | 'assistant';
  text: string;
}

export const MessageBubble = ({ author, text }: MessageBubbleProps) => {
  return (
    <div className={`message ${author}`}>
      <div className="message-label">{author === 'user' ? 'You' : 'Lumina'}</div>
      <div className="message-text">{text}</div>
    </div>
  );
};