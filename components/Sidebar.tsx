
import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  activeView: View;
  setActiveView: (view: View) => void;
  children: React.ReactNode;
}> = ({ view, label, activeView, setActiveView, children }) => (
  <button
    onClick={() => setActiveView(view)}
    className={`flex flex-col items-center justify-center w-full h-20 transition-colors duration-200 ${
      activeView === view ? 'bg-accent text-white' : 'text-slate-400 hover:bg-secondary'
    }`}
    aria-label={label}
    title={label}
  >
    {children}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-20 bg-primary flex flex-col items-center border-r border-secondary">
      <div className="p-2 mt-2 mb-4 text-accent">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5v-2.5h3v2.5h-3zm0-3.5v-2.5h3v2.5h-3zm0-3.5V7h3v2.5h-3z"/>
        </svg>
      </div>
      <nav className="flex flex-col w-full">
        <NavItem view="chat" label="Chat" activeView={activeView} setActiveView={setActiveView}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </NavItem>
        <NavItem view="code" label="Code" activeView={activeView} setActiveView={setActiveView}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </NavItem>
        <NavItem view="reminders" label="Reminders" activeView={activeView} setActiveView={setActiveView}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </NavItem>
      </nav>
    </aside>
  );
};

export default Sidebar;
