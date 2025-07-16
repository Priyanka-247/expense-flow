import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { SummaryData, TimeFilter } from '@/types/expense';

interface SummaryCardsProps {
  data: SummaryData;
  timeFilter: TimeFilter;
}

export const SummaryCards = ({ data, timeFilter }: SummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFilterLabel = (filter: TimeFilter) => {
    switch (filter) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  const cards = [
    {
      title: 'Total Income',
      amount: data.totalIncome,
      icon: TrendingUp,
      color: 'income',
      gradient: 'from-income to-income/80',
      shadow: 'shadow-[var(--shadow-income)]'
    },
    {
      title: 'Total Expenses',
      amount: data.totalExpenses,
      icon: TrendingDown,
      color: 'expense',
      gradient: 'from-expense to-expense/80',
      shadow: 'shadow-[var(--shadow-expense)]'
    },
    {
      title: 'Balance',
      amount: data.balance,
      icon: Wallet,
      color: data.balance >= 0 ? 'balance' : 'expense',
      gradient: data.balance >= 0 ? 'from-balance to-balance/80' : 'from-expense to-expense/80',
      shadow: data.balance >= 0 ? 'shadow-[var(--shadow-balance)]' : 'shadow-[var(--shadow-expense)]'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Financial Summary</h2>
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
          <BarChart3 className="w-3 h-3 mr-1" />
          {getFilterLabel(timeFilter)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={card.title}
            className={`relative overflow-hidden border-border/50 ${card.shadow} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10`} />
            <CardHeader className="relative pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <card.icon className={`w-4 h-4 text-${card.color}`} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-1">
                <p className={`text-2xl font-bold text-${card.color} tracking-tight`}>
                  {formatCurrency(card.amount)}
                </p>
                {card.title === 'Balance' && (
                  <p className="text-xs text-muted-foreground">
                    {data.balance >= 0 ? 'You\'re in the green!' : 'Consider reducing expenses'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Transaction Overview</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {data.transactionCount} {data.transactionCount === 1 ? 'Transaction' : 'Transactions'}
            </p>
            <p className="text-sm text-muted-foreground">
              {timeFilter === 'all' ? 'Total recorded' : `In the last ${timeFilter}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};