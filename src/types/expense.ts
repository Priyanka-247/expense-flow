export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: Date;
  category?: string;
  tags?: string[];
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
  tags?: string[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
  category?: string;
  description?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  usageCount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  type: 'income' | 'expense' | 'both';
  budget?: number;
  description?: string;
}

export interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface ChartData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface BackupData {
  transactions: Transaction[];
  categories: Category[];
  tags: Tag[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  settings: AppSettings;
  version: string;
  createdAt: Date;
}