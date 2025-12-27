
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface KTChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  userName: string;
}

export const KTChat: React.FC<KTChatProps> = ({ messages, onSendMessage, isTyping, userName }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold">KT</span>
            </div>
            <p className="text-slate-400 text-sm italic">
              "Hi {userName}! Need a hand with this query? Ask me anything!"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask KT for help..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1.5 p-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
