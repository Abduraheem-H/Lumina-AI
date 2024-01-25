import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-shell">
        <Sidebar />
        <ChatWindow />
      </div>
    </QueryClientProvider>
  );
}