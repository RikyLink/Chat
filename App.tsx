
import React, { useState } from 'react';
import type { View, Snippet, Reminder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import CodeSnippetsView from './components/CodeSnippetsView';
import RemindersView from './components/RemindersView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('chat');
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('snippets', []);
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatView />;
      case 'code':
        return <CodeSnippetsView snippets={snippets} setSnippets={setSnippets} />;
      case 'reminders':
        return <RemindersView reminders={reminders} setReminders={setReminders} />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-dark font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
