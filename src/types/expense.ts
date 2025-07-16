export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  category?: string;
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export type TimeFilter = 'week' | 'month' | 'year' | 'all';

export interface TransactionFormData {
  amount: string;
  description: string;
  type: 'income' | 'expense';
  category?: string;
}