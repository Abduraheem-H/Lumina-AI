import React from 'react';

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="logo">Lumina</h1>
        <p className="sidebar-note">Chat history coming soon.</p>
      </aside>
      <main className="main">
        <header className="header">New Chat</header>
        <section className="content">
          <p>Start by typing a message.</p>
        </section>
      </main>
    </div>
  );
}