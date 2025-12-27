
import { Assignment } from './types';

export const ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Customer Directory',
    difficulty: 'Easy',
    description: 'Retrieve all customer details to generate a mailing list.',
    question: 'Write a query to select all columns from the "customers" table where the city is "New York".',
    sampleTables: [
      {
        tableName: 'customers',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' },
          { columnName: 'email', dataType: 'TEXT' },
          { columnName: 'city', dataType: 'TEXT' }
        ],
        rows: [
          { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York' },
          { id: 2, name: 'Jane Smith', email: 'jane@test.org', city: 'Los Angeles' },
          { id: 3, name: 'Mike Ross', email: 'mike@pearson.com', city: 'New York' },
          { id: 4, name: 'Rachel Zane', email: 'rachel@law.com', city: 'Chicago' }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { id: 1, name: 'John Doe', email: 'john@example.com', city: 'New York' },
        { id: 3, name: 'Mike Ross', email: 'mike@pearson.com', city: 'New York' }
      ]
    }
  },
  {
    id: '2',
    title: 'Revenue Analysis',
    difficulty: 'Medium',
    description: 'Calculate the total revenue generated from high-value orders.',
    question: 'Find the total sum of "amount" from the "orders" table for all orders placed in 2023.',
    sampleTables: [
      {
        tableName: 'orders',
        columns: [
          { columnName: 'order_id', dataType: 'INTEGER' },
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'amount', dataType: 'REAL' },
          { columnName: 'order_date', dataType: 'TEXT' }
        ],
        rows: [
          { order_id: 101, customer_id: 1, amount: 250.00, order_date: '2023-01-15' },
          { order_id: 102, customer_id: 2, amount: 450.50, order_date: '2023-05-20' },
          { order_id: 103, customer_id: 1, amount: 15.00, order_date: '2022-12-01' },
          { order_id: 104, customer_id: 3, amount: 1200.00, order_date: '2023-11-10' }
        ]
      }
    ],
    expectedOutput: {
      type: 'single_value',
      value: 1900.50
    }
  },
  {
    id: '3',
    title: 'Top Performers',
    difficulty: 'Hard',
    description: 'Identify employees who have exceeded their sales targets.',
    question: 'List the names of employees who have made more than 2 sales, along with their total sales count.',
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'emp_id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'TEXT' }
        ],
        rows: [
          { emp_id: 1, name: 'Alice' },
          { emp_id: 2, name: 'Bob' },
          { emp_id: 3, name: 'Charlie' }
        ]
      },
      {
        tableName: 'sales',
        columns: [
          { columnName: 'sale_id', dataType: 'INTEGER' },
          { columnName: 'emp_id', dataType: 'INTEGER' },
          { columnName: 'amount', dataType: 'REAL' }
        ],
        rows: [
          { sale_id: 1, emp_id: 1, amount: 100 },
          { sale_id: 2, emp_id: 1, amount: 200 },
          { sale_id: 3, emp_id: 1, amount: 150 },
          { sale_id: 4, emp_id: 2, amount: 500 },
          { sale_id: 5, emp_id: 2, amount: 50 },
          { sale_id: 6, emp_id: 3, amount: 1000 }
        ]
      }
    ],
    expectedOutput: {
      type: 'table',
      value: [
        { name: 'Alice', sales_count: 3 }
      ]
    }
  }
];
