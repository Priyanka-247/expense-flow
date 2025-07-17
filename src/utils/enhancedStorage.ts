import { Transaction, SavingsGoal, Achievement, Tag, Category, AppSettings, BackupData } from '@/types/expense';

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense-tracker-transactions',
  SAVINGS_GOALS: 'expense-tracker-savings-goals',
  ACHIEVEMENTS: 'expense-tracker-achievements',
  TAGS: 'expense-tracker-tags',
  CATEGORIES: 'expense-tracker-categories',
  SETTINGS: 'expense-tracker-settings',
};

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF6B6B', icon: '🍕', order: 1, type: 'expense' },
  { id: '2', name: 'Transportation', color: '#4ECDC4', icon: '🚗', order: 2, type: 'expense' },
  { id: '3', name: 'Shopping', color: '#45B7D1', icon: '🛍️', order: 3, type: 'expense' },
  { id: '4', name: 'Entertainment', color: '#96CEB4', icon: '🎬', order: 4, type: 'expense' },
  { id: '5', name: 'Bills & Utilities', color: '#FFEAA7', icon: '💡', order: 5, type: 'expense' },
  { id: '6', name: 'Healthcare', color: '#DDA0DD', icon: '⚕️', order: 6, type: 'expense' },
  { id: '7', name: 'Education', color: '#98D8C8', icon: '📚', order: 7, type: 'expense' },
  { id: '8', name: 'Salary', color: '#6BCF7F', icon: '💰', order: 8, type: 'income' },
  { id: '9', name: 'Freelance', color: '#4D7C0F', icon: '💻', order: 9, type: 'income' },
  { id: '10', name: 'Investments', color: '#059669', icon: '📈', order: 10, type: 'income' },
];

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Transaction',
    description: 'Add your first transaction',
    icon: '🎯',
    condition: 'transactions >= 1',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '2',
    name: 'Savings Starter',
    description: 'Create your first savings goal',
    icon: '💰',
    condition: 'savings_goals >= 1',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '3',
    name: 'Thousand Club',
    description: 'Save $1,000 in total',
    icon: '💎',
    condition: 'total_savings >= 1000',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1000,
  },
  {
    id: '4',
    name: 'Budget Master',
    description: 'Track expenses for 30 days',
    icon: '📊',
    condition: 'tracking_days >= 30',
    isUnlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: '5',
    name: 'Goal Achiever',
    description: 'Complete your first savings goal',
    icon: '🏆',
    condition: 'completed_goals >= 1',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '6',
    name: 'Consistency Champion',
    description: 'Add transactions for 7 consecutive days',
    icon: '🔥',
    condition: 'consecutive_days >= 7',
    isUnlocked: false,
    progress: 0,
    maxProgress: 7,
  },
];

// Default settings
const defaultSettings: AppSettings = {
  language: 'en',
  theme: 'system',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  notifications: true,
  backupFrequency: 'weekly',
};

class EnhancedStorage {
  // Transactions
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date),
        tags: tx.tags || [],
      }));
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions);
  }

  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      this.saveTransactions(transactions);
    }
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(tx => tx.id !== id);
    this.saveTransactions(filtered);
  }

  // Savings Goals
  getSavingsGoals(): SavingsGoal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      }));
    } catch (error) {
      console.error('Error loading savings goals:', error);
      return [];
    }
  }

  saveSavingsGoals(goals: SavingsGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving savings goals:', error);
    }
  }

  addSavingsGoal(goal: SavingsGoal): void {
    const goals = this.getSavingsGoals();
    goals.push(goal);
    this.saveSavingsGoals(goals);
  }

  updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): void {
    const goals = this.getSavingsGoals();
    const index = goals.findIndex(goal => goal.id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates, updatedAt: new Date() };
      this.saveSavingsGoals(goals);
    }
  }

  deleteSavingsGoal(id: string): void {
    const goals = this.getSavingsGoals();
    const filtered = goals.filter(goal => goal.id !== id);
    this.saveSavingsGoals(filtered);
  }

  // Achievements
  getAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!stored) {
        this.saveAchievements(defaultAchievements);
        return defaultAchievements;
      }
      
      const parsed = JSON.parse(stored);
      return parsed.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
      }));
    } catch (error) {
      console.error('Error loading achievements:', error);
      return defaultAchievements;
    }
  }

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  unlockAchievement(id: string): void {
    const achievements = this.getAchievements();
    const index = achievements.findIndex(achievement => achievement.id === id);
    if (index !== -1 && !achievements[index].isUnlocked) {
      achievements[index].isUnlocked = true;
      achievements[index].unlockedAt = new Date();
      this.saveAchievements(achievements);
    }
  }

  updateAchievementProgress(id: string, progress: number): void {
    const achievements = this.getAchievements();
    const index = achievements.findIndex(achievement => achievement.id === id);
    if (index !== -1) {
      achievements[index].progress = Math.min(progress, achievements[index].maxProgress);
      if (achievements[index].progress >= achievements[index].maxProgress) {
        achievements[index].isUnlocked = true;
        achievements[index].unlockedAt = new Date();
      }
      this.saveAchievements(achievements);
    }
  }

  // Tags
  getTags(): Tag[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((tag: any) => ({
        ...tag,
        createdAt: new Date(tag.createdAt),
      }));
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  }

  saveTags(tags: Tag[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  }

  addTag(tag: Tag): void {
    const tags = this.getTags();
    tags.push(tag);
    this.saveTags(tags);
  }

  updateTag(id: string, updates: Partial<Tag>): void {
    const tags = this.getTags();
    const index = tags.findIndex(tag => tag.id === id);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...updates };
      this.saveTags(tags);
    }
  }

  deleteTag(id: string): void {
    const tags = this.getTags();
    const filtered = tags.filter(tag => tag.id !== id);
    this.saveTags(filtered);
  }

  // Categories
  getCategories(): Category[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!stored) {
        this.saveCategories(defaultCategories);
        return defaultCategories;
      }
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading categories:', error);
      return defaultCategories;
    }
  }

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
    }
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories();
    const filtered = categories.filter(category => category.id !== id);
    this.saveCategories(filtered);
  }

  reorderCategories(categories: Category[]): void {
    const updatedCategories = categories.map((category, index) => ({
      ...category,
      order: index + 1,
    }));
    this.saveCategories(updatedCategories);
  }

  // Settings
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) {
        this.saveSettings(defaultSettings);
        return defaultSettings;
      }
      
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  updateSettings(updates: Partial<AppSettings>): void {
    const settings = this.getSettings();
    const updatedSettings = { ...settings, ...updates };
    this.saveSettings(updatedSettings);
  }

  // Backup & Restore
  createBackup(): BackupData {
    return {
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      tags: this.getTags(),
      savingsGoals: this.getSavingsGoals(),
      achievements: this.getAchievements(),
      settings: this.getSettings(),
      version: '1.0.0',
      createdAt: new Date(),
    };
  }

  restoreBackup(backup: BackupData): void {
    try {
      if (backup.transactions) this.saveTransactions(backup.transactions);
      if (backup.categories) this.saveCategories(backup.categories);
      if (backup.tags) this.saveTags(backup.tags);
      if (backup.savingsGoals) this.saveSavingsGoals(backup.savingsGoals);
      if (backup.achievements) this.saveAchievements(backup.achievements);
      if (backup.settings) this.saveSettings(backup.settings);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  exportData(): string {
    const backup = this.createBackup();
    return JSON.stringify(backup, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const backup = JSON.parse(jsonData);
      this.restoreBackup(backup);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const enhancedStorage = new EnhancedStorage();