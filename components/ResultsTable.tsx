
import React from 'react';
import { QueryResult } from '../types';

interface ResultsTableProps {
  result: QueryResult | null;
  isLoading: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
        Executing query...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 italic">
        Execute a query to see results
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 font-mono text-sm">
        <div className="font-bold mb-1">Execution Error:</div>
        {result.error}
      </div>
    );
  }

  if (!result.data || result.data.length === 0) {
    return (
      <div className="p-4 text-slate-400 italic">
        Query returned successfully, but no rows were found.
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-full">
      <table className="w-full text-left border-collapse min-w-full">
        <thead className="sticky top-0 bg-slate-800 z-10">
          <tr>
            {result.columns.map((col) => (
              <th key={col} className="px-4 py-2 border-b border-slate-700 text-xs font-semibold text-slate-300 uppercase">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-700/50 transition-colors">
              {result.columns.map((col) => (
                <td key={col} className="px-4 py-2 border-b border-slate-700/50 text-sm text-slate-300 font-mono">
                  {row[col]?.toString() ?? 'NULL'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
