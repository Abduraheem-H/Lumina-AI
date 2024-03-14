import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const timeLabel = Number.isFinite(message.timestamp)
    ? format(new Date(message.timestamp), 'p')
    : '';

  const handleCopy = async () => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className={cn(
        'group flex gap-4 p-6 transition-colors',
        isAssistant ? 'bg-white/[0.02]' : 'bg-transparent',
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isAssistant ? 'bg-white/10 text-white' : 'bg-white text-black',
        )}
      >
        {isAssistant ? <Sparkles size={16} /> : <User size={16} />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-40">
            {isAssistant ? 'Lumina AI' : 'You'}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-brand-muted opacity-0 group-hover:opacity-100 transition-all">
            {timeLabel && <span>{timeLabel}</span>}
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/10"
              title={copied ? 'Copied' : 'Copy message'}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
