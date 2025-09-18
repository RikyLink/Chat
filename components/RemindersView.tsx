
import React, { useState } from 'react';
import type { Reminder } from '../types';

interface RemindersViewProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const RemindersView: React.FC<RemindersViewProps> = ({ reminders, setReminders }) => {
  const [newReminder, setNewReminder] = useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      text: newReminder,
      createdAt: new Date().toISOString(),
    };

    setReminders(prev => [reminder, ...prev]);
    setNewReminder('');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-primary text-light p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reminders</h1>
        <p className="text-slate-400">Keep track of your important tasks.</p>
      </header>

      <form onSubmit={handleAddReminder} className="mb-6 flex gap-4">
        <input
          type="text"
          value={newReminder}
          onChange={e => setNewReminder(e.target.value)}
          placeholder="Add a new reminder..."
          className="flex-1 bg-secondary rounded-lg px-4 py-3 text-light placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-sky-400 transition-colors disabled:bg-slate-500"
          disabled={!newReminder.trim()}
        >
          Add
        </button>
      </form>
      
      <div className="flex-1 overflow-y-auto space-y-4">
        {reminders.length > 0 ? (
            reminders.map(reminder => (
            <div key={reminder.id} className="bg-secondary p-4 rounded-lg flex justify-between items-center shadow-lg">
                <p className="text-light">{reminder.text}</p>
                <button
                onClick={() => handleDeleteReminder(reminder.id)}
                className="p-2 rounded-full text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
                title="Delete reminder"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                </button>
            </div>
            ))
        ) : (
            <div className="text-center text-slate-500 pt-10">
                <p>No reminders yet. Add one above to get started!</p>
            </div>
        )}
        </div>
    </div>
  );
};

export default RemindersView;
