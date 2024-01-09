import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Lumina</h1>
        <button className="ghost-button">New Chat</button>
      </div>
      <div className="sidebar-empty">No conversations yet.</div>
    </aside>
  );
};