
import React from 'react';
import { Table } from '../types';

interface SchemaViewerProps {
  tables: Table[];
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ tables }) => {
  return (
    <div className="space-y-6">
      {tables.map((table) => (
        <div key={table.tableName} className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden shadow-sm">
          <div className="px-3 py-2 bg-slate-700 border-b border-slate-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-bold text-slate-200">{table.tableName}</span>
          </div>
          <div className="p-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left font-medium pb-2">Column</th>
                  <th className="text-left font-medium pb-2">Type</th>
                </tr>
              </thead>
              <tbody className="font-mono text-slate-300">
                {table.columns.map((col) => (
                  <tr key={col.columnName}>
                    <td className="py-1">{col.columnName}</td>
                    <td className="py-1 text-slate-500">{col.dataType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
