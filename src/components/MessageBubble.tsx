import React from 'react';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-4 p-6 transition-colors',
        isAssistant ? 'bg-white/[0.02]' : 'bg-transparent',
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold',
          isAssistant ? 'bg-white/10 text-white' : 'bg-white text-black',
        )}
      >
        {isAssistant ? 'AI' : 'You'}
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-40">
          {isAssistant ? 'Lumina AI' : 'You'}
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};