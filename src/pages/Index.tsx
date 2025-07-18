import { useState, useEffect, useMemo } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionList } from '@/components/TransactionList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Download, Trash2, RefreshCw, Target, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transaction, TransactionFormData, TimeFilter, SummaryData } from '@/types/expense';
import { enhancedStorage } from '@/utils/enhancedStorage';
import { dateUtils } from '@/utils/dateUtils';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const savedTransactions = enhancedStorage.getTransactions();
        setTransactions(savedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load your transactions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [toast]);

  // Filter transactions based on time filter
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;
    
    const { start, end } = dateUtils.getFilteredDateRange(timeFilter);
    return transactions.filter(tx => 
      tx.date >= start && tx.date <= end
    );
  }, [transactions, timeFilter]);

  // Calculate summary data
  const summaryData = useMemo((): SummaryData => {
    const totalIncome = filteredTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const handleAddTransaction = (formData: TransactionFormData) => {
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: formData.type,
        date: new Date(),
        category: formData.category || undefined
      };

      enhancedStorage.addTransaction(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Success!",
        description: `${formData.type === 'income' ? 'Income' : 'Expense'} added successfully.`,
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    try {
      enhancedStorage.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      
      toast({
        title: "Deleted",
        description: "Transaction deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = () => {
    try {
      enhancedStorage.clearAllData();
      setTransactions([]);
      
      toast({
        title: "Cleared",
        description: "All transaction data has been cleared.",
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast({
        title: "Error",
        description: "Failed to clear data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Exported",
        description: "Your transaction data has been exported successfully.",
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const savedTransactions = enhancedStorage.getTransactions();
      setTransactions(savedTransactions);
      setIsLoading(false);
      toast({
        title: "Refreshed",
        description: "Data has been refreshed successfully.",
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading your expenses...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Expense Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your finances with ease</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/savings">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Savings Goals
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshData}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportData}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              {transactions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllData}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/savings" className="group">
              <div className="bg-card border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Savings Goals</h3>
                    <p className="text-sm text-muted-foreground">Track your savings progress</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/analytics" className="group">
              <div className="bg-card border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics</h3>
                    <p className="text-sm text-muted-foreground">View detailed insights</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <div className="bg-card border border-border/50 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Total Balance</h3>
                  <p className="text-sm font-medium text-foreground">${summaryData.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="xl:col-span-1">
            <TransactionForm onAddTransaction={handleAddTransaction} />
          </div>

          {/* Summary and List */}
          <div className="xl:col-span-2 space-y-8">
            <SummaryCards data={summaryData} timeFilter={timeFilter} />
            
            <TransactionList
              transactions={filteredTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Expense Tracker. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
