
import React, { useState, useEffect } from 'react';
import type { Snippet } from '../types';

interface CodeSnippetsViewProps {
  snippets: Snippet[];
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
}

const CodeSnippetsView: React.FC<CodeSnippetsViewProps> = ({ snippets, setSnippets }) => {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (selectedSnippet) {
      setTitle(selectedSnippet.title);
      setLanguage(selectedSnippet.language);
      setCode(selectedSnippet.code);
      setIsCreating(false);
    } else {
      setTitle('');
      setLanguage('javascript');
      setCode('');
    }
  }, [selectedSnippet]);
  
  const handleNewSnippet = () => {
    setSelectedSnippet(null);
    setIsCreating(true);
    setTitle('New Snippet');
    setLanguage('javascript');
    setCode('// Start coding here...');
  };
  
  const handleSave = () => {
    if (!title.trim() || !code.trim()) return;

    if (isCreating) {
      const newSnippet: Snippet = {
        id: Date.now().toString(),
        title,
        language,
        code,
        createdAt: new Date().toISOString(),
      };
      setSnippets(prev => [newSnippet, ...prev]);
      setSelectedSnippet(newSnippet);
      setIsCreating(false);
    } else if (selectedSnippet) {
      const updatedSnippet = { ...selectedSnippet, title, language, code };
      setSnippets(prev => prev.map(s => (s.id === selectedSnippet.id ? updatedSnippet : s)));
      setSelectedSnippet(updatedSnippet);
    }
  };
  
  const handleDelete = () => {
    if (!selectedSnippet) return;
    setSnippets(prev => prev.filter(s => s.id !== selectedSnippet.id));
    setSelectedSnippet(null);
  };
  
  return (
    <div className="flex h-full bg-primary text-light">
      {/* Snippet List */}
      <div className="w-1/3 border-r border-secondary flex flex-col">
        <div className="p-4 border-b border-secondary flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Code Snippets</h2>
          <button onClick={handleNewSnippet} className="p-2 rounded-md bg-accent text-white hover:bg-sky-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {snippets.map(snippet => (
            <div
              key={snippet.id}
              onClick={() => setSelectedSnippet(snippet)}
              className={`p-4 cursor-pointer border-l-4 ${selectedSnippet?.id === snippet.id ? 'bg-secondary border-accent' : 'border-transparent hover:bg-secondary/50'}`}
            >
              <h3 className="font-semibold text-white truncate">{snippet.title}</h3>
              <p className="text-sm text-slate-400">{snippet.language}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Editor View */}
      <div className="w-2/3 flex flex-col">
        {selectedSnippet || isCreating ? (
          <>
            <div className="p-4 border-b border-secondary flex items-center gap-4">
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="flex-1 bg-secondary rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="bg-secondary rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="typescript">TypeScript</option>
                 <option value="shell">Shell</option>
              </select>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 rounded p-4 font-mono text-sm text-light resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                spellCheck="false"
              />
            </div>
            <div className="p-4 border-t border-secondary flex justify-end gap-4">
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors" disabled={isCreating}>Delete</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-md bg-accent text-white hover:bg-sky-400 transition-colors">Save</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <p>Select a snippet to view or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetsView;
