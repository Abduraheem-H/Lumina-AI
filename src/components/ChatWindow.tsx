import React, { useRef, useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { generateChatResponse } from '../services/gemini';
import { useMutation } from '@tanstack/react-query';
import {
  PanelLeftOpen,
  Sparkles,
  Download,
  FileText,
  FileJson,
  Plus,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const ChatWindow = () => {
  const {
    sessions,
    currentSessionId,
    addMessage,
    isSidebarOpen,
    setSidebarOpen,
    createNewSession,
    promptTemplates,
    theme,
    toggleTheme,
  } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const canExportChat = Boolean(currentSession && currentSession.messages.length > 0);
  const canExportWorkspace = sessions.length > 0;
  const canOpenExport = canExportChat || canExportWorkspace;
  const promptSuggestions =
    promptTemplates.length > 0
      ? promptTemplates.slice(0, 4)
      : [
          'Write a professional email for a job application',
          'Explain quantum computing in simple terms',
          'Create a 7-day workout plan for beginners',
          'Help me debug a React useEffect loop',
        ];
  const lastUserIndex = currentSession
    ? currentSession.messages.reduce(
        (latestIndex, message, index) =>
          message.role === 'user' ? index : latestIndex,
        -1,
      )
    : -1;
  const lastUserMessage =
    currentSession && lastUserIndex >= 0 ? currentSession.messages[lastUserIndex] : null;

  const mutation = useMutation({
    mutationFn: async (messages: any[]) => generateChatResponse(messages),
    onSuccess: (data) => {
      if (currentSessionId) {
        addMessage(currentSessionId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data,
          timestamp: Date.now(),
        });
      }
    },
    onError: (error: any) => {
      if (currentSessionId) {
        addMessage(currentSessionId, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Error: ${error.message ?? 'Unable to fetch response.'}`,
          timestamp: Date.now(),
        });
      }
    },
  });

  const canRegenerate = Boolean(lastUserMessage) && !mutation.isPending;

  const handleSend = (content: string) => {
    let sessionId = currentSessionId;

    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };

    addMessage(sessionId, userMessage);

    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    mutation.mutate(updatedMessages);
  };

  const handleRegenerate = () => {
    if (!currentSession || lastUserIndex < 0) {
      return;
    }
    const history = currentSession.messages.slice(0, lastUserIndex + 1);
    mutation.mutate(history);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, mutation.isPending]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const isModifier = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (isModifier && key === 'b') {
        event.preventDefault();
        setSidebarOpen(!isSidebarOpen);
      }
      if (isModifier && event.shiftKey && key === 'n') {
        event.preventDefault();
        createNewSession();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNewSession, isSidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (!isExportOpen) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (!exportMenuRef.current?.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isExportOpen]);

  const handleExportChat = (formatType: 'md' | 'json') => {
    if (!currentSession) {
      return;
    }
    const title = currentSession.title || 'lumina-chat';
    const safeTitle =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') || 'lumina-chat';
    const stamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `${safeTitle}-${stamp}.${formatType}`;

    if (formatType === 'json') {
      const blob = new Blob([JSON.stringify(currentSession, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setIsExportOpen(false);
      return;
    }

    const lines = currentSession.messages.map((message) => {
      const role = message.role === 'user' ? 'You' : 'Lumina';
      const time = Number.isFinite(message.timestamp)
        ? format(new Date(message.timestamp), 'PPpp')
        : '';
      return `### ${role}${time ? ` - ${time}` : ''}\n\n${message.content}\n`;
    });
    const markdown = `# ${title}\n\nGenerated: ${format(new Date(), 'PPpp')}\n\n${lines.join('\n')}`.trim();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const handleExportWorkspace = (formatType: 'md' | 'json') => {
    if (sessions.length === 0) {
      return;
    }
    const stamp = format(new Date(), 'yyyy-MM-dd');
    const filename = `lumina-workspace-${stamp}.${formatType}`;

    if (formatType === 'json') {
      const payload = {
        exportedAt: new Date().toISOString(),
        sessions,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setIsExportOpen(false);
      return;
    }

    const workspaceContent = sessions
      .map((session) => {
        const header = `## ${session.title || 'Untitled Chat'}`;
        if (session.messages.length === 0) {
          return `${header}\n\n_No messages yet._\n`;
        }
        const messages = session.messages
          .map((message) => {
            const role = message.role === 'user' ? 'You' : 'Lumina';
            const time = Number.isFinite(message.timestamp)
              ? format(new Date(message.timestamp), 'PPpp')
              : '';
            return `### ${role}${time ? ` - ${time}` : ''}\n\n${message.content}\n`;
          })
          .join('\n');
        return `${header}\n\n${messages}`;
      })
      .join('\n');

    const markdown = `# Lumina Workspace\n\nGenerated: ${format(
      new Date(),
      'PPpp',
    )}\n\n${workspaceContent}`.trim();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-brand-bg relative overflow-hidden">
      <header className="h-16 border-b border-brand-border flex items-center px-6 justify-between bg-brand-bg/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <h2 className="text-sm font-medium opacity-80">
            {currentSession?.title || 'New Chat'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => createNewSession()}
            className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-white hover:bg-white/5 transition-all"
            title="New chat (Ctrl/Cmd+Shift+N)"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={handleRegenerate}
            disabled={!canRegenerate}
            className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Regenerate last response"
          >
            <RotateCcw size={16} />
          </button>
          <div ref={exportMenuRef} className="relative">
            <button
              onClick={() => canOpenExport && setIsExportOpen((open) => !open)}
              disabled={!canOpenExport}
              className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export chat"
            >
              <Download size={16} />
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-brand-surface shadow-xl p-2 z-20"
                >
                  <button
                    onClick={() => handleExportChat('md')}
                    disabled={!canExportChat}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileText size={14} />
                    Export Chat (MD)
                  </button>
                  <button
                    onClick={() => handleExportChat('json')}
                    disabled={!canExportChat}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileJson size={14} />
                    Export Chat (JSON)
                  </button>
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    onClick={() => handleExportWorkspace('md')}
                    disabled={!canExportWorkspace}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileText size={14} />
                    Export Workspace (MD)
                  </button>
                  <button
                    onClick={() => handleExportWorkspace('json')}
                    disabled={!canExportWorkspace}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileJson size={14} />
                    Export Workspace (JSON)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-white hover:bg-white/5 transition-all"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium tracking-wider uppercase opacity-60">
            Lumina
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        {!currentSession || currentSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-semibold tracking-tight mb-2"
            >
              How can I help you today?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-muted max-w-md text-sm leading-relaxed"
            >
              Ask questions, generate content, or explore ideas with Lumina.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-2xl">
              {promptSuggestions.map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left text-xs hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full py-4">
            {currentSession.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {mutation.isPending && (
              <div className="flex gap-4 p-6 bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/5 rounded animate-pulse" />
                    <div className="h-2 w-3/4 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-t from-brand-bg via-brand-bg to-transparent pt-12">
        <ChatInput
          onSend={handleSend}
          isLoading={mutation.isPending}
          presets={promptTemplates}
        />
      </div>
    </div>
  );
};
