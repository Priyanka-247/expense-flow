import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { MonthlyTrendsChart } from '@/components/charts/MonthlyTrendsChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { IncomeExpenseBarChart } from '@/components/charts/IncomeExpenseBarChart';
import { enhancedStorage } from '@/utils/enhancedStorage';
import type { Transaction, MonthlyTrendData, CategoryData, ChartData } from '@/types/expense';

const Analytics: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransactions = enhancedStorage.getTransactions();
        setTransactions(savedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate monthly trends data
  const monthlyTrendsData = useMemo((): MonthlyTrendData[] => {
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(tx => {
      const monthKey = tx.date.toISOString().substring(0, 7); // YYYY-MM
      const month = new Date(tx.date.getFullYear(), tx.date.getMonth()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (tx.type === 'income') {
        data.income += tx.amount;
      } else {
        data.expenses += tx.amount;
      }
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const month = new Date(monthKey + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        return {
          month,
          income: data.income,
          expenses: data.expenses,
          savings: data.income - data.expenses
        };
      });
  }, [transactions]);

  // Generate category pie chart data
  const categoryData = useMemo((): CategoryData[] => {
    const categories = enhancedStorage.getCategories();
    const categoryTotals = new Map<string, number>();
    
    // Calculate totals by category for expenses only
    transactions
      .filter(tx => tx.type === 'expense' && tx.category)
      .forEach(tx => {
        const categoryName = tx.category!;
        categoryTotals.set(categoryName, (categoryTotals.get(categoryName) || 0) + tx.amount);
      });

    const totalExpenses = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0);
    
    if (totalExpenses === 0) return [];

    return Array.from(categoryTotals.entries())
      .map(([name, value]) => {
        const category = categories.find(c => c.name === name);
        return {
          name,
          value,
          color: category?.color || '#8884d8',
          percentage: (value / totalExpenses) * 100
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Show top 8 categories
  }, [transactions]);

  // Generate bar chart data
  const barChartData = useMemo((): ChartData[] => {
    const monthlyData = new Map<string, { income: number; expenses: number }>();
    
    transactions.forEach(tx => {
      const monthKey = tx.date.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      if (tx.type === 'income') {
        data.income += tx.amount;
      } else {
        data.expenses += tx.amount;
      }
    });

    return Array.from(monthlyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Show last 6 months
      .map(([monthKey, data]) => {
        const month = new Date(monthKey + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        return {
          month,
          income: data.income,
          expenses: data.expenses,
          balance: data.income - data.expenses
        };
      });
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading Analytics...</h2>
          <p className="text-muted-foreground">Analyzing your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/index" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Analytics
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              Add some transactions to see your analytics
            </p>
            <Link to="/index">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trends
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <IncomeExpenseBarChart data={barChartData} />
                <CategoryPieChart data={categoryData} />
              </div>
              <MonthlyTrendsChart data={monthlyTrendsData} />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <MonthlyTrendsChart data={monthlyTrendsData} />
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Monthly Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      ${monthlyTrendsData.length > 0 
                        ? (monthlyTrendsData.reduce((sum, data) => sum + data.income, 0) / monthlyTrendsData.length).toFixed(2)
                        : '0.00'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Monthly Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">
                      ${monthlyTrendsData.length > 0 
                        ? (monthlyTrendsData.reduce((sum, data) => sum + data.expenses, 0) / monthlyTrendsData.length).toFixed(2)
                        : '0.00'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Monthly Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      ${monthlyTrendsData.length > 0 
                        ? (monthlyTrendsData.reduce((sum, data) => sum + data.savings, 0) / monthlyTrendsData.length).toFixed(2)
                        : '0.00'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoryPieChart data={categoryData} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Detailed view of your spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${category.value.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <IncomeExpenseBarChart data={barChartData} />
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Best Performing Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {barChartData.length > 0 && (() => {
                      const bestMonth = barChartData.reduce((best, current) => 
                        current.balance > best.balance ? current : best
                      );
                      return (
                        <div>
                          <p className="text-lg font-semibold">{bestMonth.month}</p>
                          <p className="text-green-600">+${bestMonth.balance.toFixed(2)}</p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Highest Expense Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {barChartData.length > 0 && (() => {
                      const highestExpenseMonth = barChartData.reduce((highest, current) => 
                        current.expenses > highest.expenses ? current : highest
                      );
                      return (
                        <div>
                          <p className="text-lg font-semibold">{highestExpenseMonth.month}</p>
                          <p className="text-red-600">${highestExpenseMonth.expenses.toFixed(2)}</p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Analytics;