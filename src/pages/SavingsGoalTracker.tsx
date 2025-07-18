import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Award, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { toast } from '@/hooks/use-toast';
import type { SavingsGoal, Achievement } from '@/types/expense';
import { enhancedStorage } from '@/utils/enhancedStorage';

const SavingsGoalTracker: React.FC = () => {
  const { t } = useTranslation();
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    category: '',
    description: ''
  });

  useEffect(() => {
    setSavingsGoals(enhancedStorage.getSavingsGoals());
    setAchievements(enhancedStorage.getAchievements());
  }, []);

  const savingsTips = [
    "Set up automatic transfers to your savings account",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    "Track your spending to identify areas where you can cut back",
    "Consider using a high-yield savings account",
    "Start small - even $5 a week adds up over time",
    "Reduce subscription services you don't actively use",
    "Cook at home more often instead of dining out",
    "Use cashback apps and rewards programs"
  ];

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      frequency: newGoal.frequency,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      category: newGoal.category || undefined,
      description: newGoal.description || undefined
    };

    enhancedStorage.addSavingsGoal(goal);
    setSavingsGoals(enhancedStorage.getSavingsGoals());
    setNewGoal({
      name: '',
      targetAmount: '',
      frequency: 'monthly',
      category: '',
      description: ''
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Savings goal created successfully!"
    });
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    const goals = enhancedStorage.getSavingsGoals();
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = Math.max(0, goal.currentAmount + amount);
        const updatedGoal = {
          ...goal,
          currentAmount: newAmount,
          updatedAt: new Date(),
          status: newAmount >= goal.targetAmount ? 'completed' as const : 'active' as const
        };
        return updatedGoal;
      }
      return goal;
    });
    
    enhancedStorage.saveSavingsGoals(updatedGoals);
    setSavingsGoals(updatedGoals);
    
    toast({
      title: "Updated",
      description: "Goal progress updated successfully!"
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

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
              {t('savingsGoalTracker')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Savings Goals</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Savings Goal</DialogTitle>
                    <DialogDescription>
                      Set up a new savings goal to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goalName">Goal Name *</Label>
                      <Input
                        id="goalName"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        placeholder="e.g., Emergency Fund, Vacation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetAmount">Target Amount *</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={newGoal.frequency} onValueChange={(value: any) => setNewGoal({ ...newGoal, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                        placeholder="e.g., Travel, Emergency, Investment"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <Button onClick={handleCreateGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savingsGoals.map((goal) => (
                <Card key={goal.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>${goal.currentAmount.toFixed(2)}</span>
                        <span>${goal.targetAmount.toFixed(2)}</span>
                      </div>
                      <Progress value={getProgressPercentage(goal.currentAmount, goal.targetAmount)} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}% complete
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, 10)}
                        className="flex-1"
                      >
                        +$10
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, 50)}
                        className="flex-1"
                      >
                        +$50
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, -10)}
                        className="flex-1"
                      >
                        -$10
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Frequency: {goal.frequency}</p>
                      {goal.category && <p>Category: {goal.category}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {savingsGoals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No savings goals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first savings goal to start tracking your progress
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              
              {unlockedAchievements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Unlocked Achievements
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {unlockedAchievements.map((achievement) => (
                      <Card key={achievement.id} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              {achievement.unlockedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {lockedAchievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Achievements</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {lockedAchievements.map((achievement) => (
                      <Card key={achievement.id} className="opacity-75">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl grayscale">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <div className="mt-2">
                                <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {achievement.progress}/{achievement.maxProgress}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Savings Tips
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {savingsTips.map((tip, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{tip}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavingsGoalTracker;