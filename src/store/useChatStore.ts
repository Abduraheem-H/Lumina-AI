import { create } from 'zustand';
import { ChatSession, Message } from '../types/chat';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  createNewSession: () => string;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSessionId: null,

  createNewSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSessionId: newSession.id,
    }));

    return newSession.id;
  },

  setCurrentSession: (id) => set({ currentSessionId: id }),

  addMessage: (sessionId, message) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: Date.now(),
            }
          : session,
      ),
    }));
  },
}));