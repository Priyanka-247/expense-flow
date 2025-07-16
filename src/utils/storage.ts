import { Transaction } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-transactions';

export const storageUtils = {
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date)
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  },

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  },

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(tx => tx.id !== id);
    this.saveTransactions(filtered);
  },

  clearAllTransactions(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};