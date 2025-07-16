import { TimeFilter } from '@/types/expense';

export const dateUtils = {
  getFilteredDateRange(filter: TimeFilter): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date();
    const end = new Date(now);

    switch (filter) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
      default:
        start.setFullYear(2000);
        break;
    }

    return { start, end };
  },

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return this.formatDate(date);
  }
};