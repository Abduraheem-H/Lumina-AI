import React from 'react';
import { Sidebar } from './components/Sidebar';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <header className="header">New Chat</header>
        <section className="content">
          <p>Start by sending a message.</p>
        </section>
      </main>
    </div>
  );
}