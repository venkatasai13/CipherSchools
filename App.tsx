
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ASSIGNMENTS } from './data';
import { Assignment, QueryResult, ChatMessage } from './types';
import { SqlEditor } from './components/SqlEditor';
import { ResultsTable } from './components/ResultsTable';
import { SchemaViewer } from './components/SchemaViewer';
import { createKTChatSession } from './services/geminiService';
import { Login } from './components/Login';
import { KTChat } from './components/KTChat';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('cipher_user'));
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isKTTyping, setIsKTTyping] = useState(false);
  
  // Create a chat session when assignment changes
  const ktChatSession = useMemo(() => {
    if (user && selectedAssignment) {
      const schemaStr = selectedAssignment.sampleTables.map(t => 
        `${t.tableName}(${t.columns.map(c => `${c.columnName} ${c.dataType}`).join(', ')})`
      ).join('; ');
      return createKTChatSession(user, selectedAssignment.question, schemaStr);
    }
    return null;
  }, [user, selectedAssignment]);

  const handleLogin = (name: string) => {
    setUser(name);
    localStorage.setItem('cipher_user', name);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cipher_user');
    setSelectedAssignment(null);
    setChatMessages([]);
  };

  const handleExecute = useCallback(() => {
    if (!selectedAssignment) return;
    setIsExecuting(true);
    setResult(null);

    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
      let mockData: any[] = [];
      let cols: string[] = [];

      try {
        if (selectedAssignment.id === '1') {
          if (normalizedQuery.includes('select * from customers') && normalizedQuery.includes("city = 'new york'")) {
            mockData = selectedAssignment.sampleTables[0].rows.filter(r => r.city === 'New York');
            cols = ['id', 'name', 'email', 'city'];
          } else if (normalizedQuery.includes('select * from customers')) {
             mockData = selectedAssignment.sampleTables[0].rows;
             cols = ['id', 'name', 'email', 'city'];
          } else {
             throw new Error("Syntax Error: Check your WHERE clause or table name.");
          }
        } else if (selectedAssignment.id === '2') {
           if (normalizedQuery.includes('sum(amount)') && normalizedQuery.includes("from orders") && normalizedQuery.includes("2023")) {
             mockData = [{ 'total_sum': 1900.50 }];
             cols = ['total_sum'];
           } else {
             throw new Error("Logic Error: Make sure you are using SUM() and filtering for the year 2023.");
           }
        } else {
          mockData = selectedAssignment.sampleTables[0].rows.slice(0, 2);
          cols = Object.keys(mockData[0] || {});
        }
        setResult({ data: mockData, error: null, columns: cols });
      } catch (err: any) {
        setResult({ data: null, error: err.message, columns: [] });
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  }, [selectedAssignment, query]);

  const handleSendMessage = async (text: string) => {
    if (!ktChatSession) return;
    
    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsKTTyping(true);

    try {
      const result = await ktChatSession.sendMessage({ message: text });
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: result.text || "I'm thinking hard, but couldn't find the right words!", 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("KT AI Chat Error:", error);
      setChatMessages(prev => [...prev, { 
        role: 'model', 
        text: "Sorry, I hit a snag. Can you try that again?", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsKTTyping(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!selectedAssignment) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <nav className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">CipherSQL Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1 border border-slate-700">
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {user.charAt(0)}
              </div>
              <span className="text-sm text-slate-300 font-medium">{user}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors text-sm font-medium">Logout</button>
          </div>
        </nav>

        <div className="p-8 max-w-6xl mx-auto">
          <header className="mb-12 text-center pt-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Welcome back, {user}!</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Your personalized SQL training environment is ready. Select a challenge and let KT guide you.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ASSIGNMENTS.map((assignment) => (
              <div 
                key={assignment.id}
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setChatMessages([]);
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col h-full shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    assignment.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                    assignment.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {assignment.difficulty}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">#{assignment.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-slate-400 text-sm flex-grow leading-relaxed">
                  {assignment.description}
                </p>
                <div className="mt-6 flex items-center text-indigo-400 text-sm font-semibold">
                  Launch Practice 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f172a]">
      {/* Workspace Navigation */}
      <nav className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-md z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setSelectedAssignment(null);
              setResult(null);
              setQuery('');
              setChatMessages([]);
            }}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
          <div className="h-6 w-px bg-slate-800 mx-2" />
          <h2 className="text-white font-bold truncate max-w-[200px]">{selectedAssignment.title}</h2>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-medium text-slate-300">Session: {user}</span>
           </div>
        </div>
      </nav>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar - Problem & Schema */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
          <div className="flex-grow overflow-y-auto p-5 space-y-8 custom-scrollbar">
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Goal</h3>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedAssignment.question}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Schema Explorer</h3>
              <SchemaViewer tables={selectedAssignment.sampleTables} />
            </div>
          </div>
        </div>

        {/* Center - SQL Editor & Results */}
        <div className="flex-grow flex flex-col min-w-0 bg-slate-950">
          <div className="flex-grow p-5 flex flex-col gap-5 overflow-hidden">
            <div className="h-3/5">
              <SqlEditor 
                value={query} 
                onChange={(val) => setQuery(val || '')} 
                onExecute={handleExecute} 
              />
            </div>

            <div className="h-2/5 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-2xl">
              <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Output</span>
                {result && !result.error && (
                   <span className="text-[10px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded">
                     {result.data?.length || 0} rows found
                   </span>
                )}
              </div>
              <div className="flex-grow relative overflow-auto custom-scrollbar">
                <ResultsTable result={result} isLoading={isExecuting} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - KT Chat AI */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          <div className="h-14 px-5 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-[10px] font-bold text-white">KT</span>
            </div>
            <h3 className="text-xs font-bold text-slate-200">KT AI Assistant</h3>
          </div>
          <div className="flex-grow overflow-hidden">
            <KTChat 
              messages={chatMessages} 
              onSendMessage={handleSendMessage} 
              isTyping={isKTTyping} 
              userName={user || ''} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
