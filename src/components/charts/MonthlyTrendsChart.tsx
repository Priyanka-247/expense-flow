import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { MonthlyTrendData } from '@/types/expense';

interface MonthlyTrendsChartProps {
  data: MonthlyTrendData[];
  className?: string;
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ 
  data,
  className = ''
}) => {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('dashboard.monthlyTrends')}</CardTitle>
        <CardDescription>
          Track your financial trends over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(var(--income))"
                strokeWidth={2}
                name={t('transactions.income')}
                dot={{ fill: 'hsl(var(--income))' }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--expense))"
                strokeWidth={2}
                name={t('transactions.expense')}
                dot={{ fill: 'hsl(var(--expense))' }}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="hsl(var(--balance))"
                strokeWidth={2}
                name="Savings"
                dot={{ fill: 'hsl(var(--balance))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};