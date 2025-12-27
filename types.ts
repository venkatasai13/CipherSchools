
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Column {
  columnName: string;
  dataType: string;
}

export interface Table {
  tableName: string;
  columns: Column[];
  rows: any[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  question: string;
  sampleTables: Table[];
  expectedOutput: {
    type: 'table' | 'single_value' | 'column' | 'count';
    value: any;
  };
}

export interface QueryResult {
  data: any[] | null;
  error: string | null;
  columns: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
