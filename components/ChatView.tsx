
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { startChat } from '../services/geminiService';
import type { Chat } from '@google/genai';

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  // A simple markdown to html for code blocks
  const formatText = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    return text.replace(codeBlockRegex, (match, lang, code) => {
      return `<pre class="bg-gray-900 rounded-md p-4 my-2 overflow-x-auto"><code class="language-${lang || ''}">${code.trim()}</code></pre>`;
    });
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isUser ? 'bg-sky-500' : 'bg-slate-600'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`max-w-xl p-4 rounded-lg shadow-md ${isUser ? 'bg-sky-500 text-white' : 'bg-secondary text-light'}`}>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
      </div>
    </div>
  );
};

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startChat();
    setMessages([
        { id: 'initial', text: 'Hello! I am your developer assistant. Mention me with `@` to start a conversation.', sender: 'ai'}
    ])
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    const currentInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (!currentInput.trim().startsWith('@')) {
      return;
    }

    setIsLoading(true);

    try {
      const prompt = currentInput.trim().substring(1).trim();
      const stream = await chatRef.current.sendMessageStream({ message: prompt });
      
      let aiResponseText = '';
      const aiMessageId = Date.now().toString() + '-ai';
      let firstChunk = true;

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        if (firstChunk) {
            setMessages(prev => [...prev, { id: aiMessageId, text: aiResponseText, sender: 'ai' }]);
            firstChunk = false;
        } else {
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
            ));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { id: Date.now().toString() + '-error', text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-primary">
      <header className="p-4 border-b border-secondary">
        <h1 className="text-xl font-bold text-white">AI Assistant</h1>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
         {isLoading && (
          <div className="flex items-start gap-3 my-4">
             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-slate-600">AI</div>
             <div className="max-w-xl p-4 rounded-lg shadow-md bg-secondary text-light">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-secondary">
        <div className="flex items-center bg-secondary rounded-lg px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message, or use '@' to talk to the AI..."
            className="flex-1 bg-transparent focus:outline-none text-light placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="ml-4 p-2 rounded-full bg-accent text-white disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
