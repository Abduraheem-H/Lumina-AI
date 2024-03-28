import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { useChatStore } from './store/useChatStore';

const queryClient = new QueryClient();

export default function App() {
  const theme = useChatStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-full overflow-hidden font-sans">
        <Sidebar />
        <ChatWindow />
      </div>
    </QueryClientProvider>
  );
}
