
import React from 'react';
import Editor from '@monaco-editor/react';

interface SqlEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onExecute: () => void;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, onExecute }) => {
  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SQL Editor</span>
        <button
          onClick={onExecute}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1 rounded text-sm font-medium transition-colors shadow-sm"
        >
          Execute Query
        </button>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};
