import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge-2';
import { Target } from 'lucide-react';
import { useMCP } from '@/contexts/MCPContext';

const GoalCard: React.FC = () => {
  const { mcp } = useMCP();
  const cardMinHeight = 'min-h-[160px]';

  // If no MCP or no goals, show sample animated progress bar and content
  if (!mcp || !mcp.goals || mcp.goals.length === 0) {
    // Sample values
    const targetAmount = 25000;
    const targetDate = "Sept 15";
    const progressPercentage = 64;
    const [currentAmount, setCurrentAmount] = useState(0);

    useEffect(() => {
      // Animate progress value
      const animationDuration = 1500;
      const increment = (targetAmount * progressPercentage / 100) / (animationDuration / 16);
      setCurrentAmount(0);
      const timer = setInterval(() => {
        setCurrentAmount(prev => {
          const next = prev + increment;
          if (next >= targetAmount * progressPercentage / 100) {
            clearInterval(timer);
            return targetAmount * progressPercentage / 100;
          }
          return next;
        });
      }, 16);
      return () => clearInterval(timer);
    }, []);

    const getProgressMessage = (percentage: number) => {
      if (percentage >= 80) return "Excellent progress — you're nearly there!";
      if (percentage >= 60) return "You're 64% there — great job!";
      if (percentage >= 40) return "Good momentum — keep it up!";
      return "Just getting started — you've got this!";
    };

    const getProgressColor = (percentage: number) => {
      if (percentage >= 80) return "success";
      if (percentage >= 60) return "info";
      if (percentage >= 40) return "warning";
      return "secondary";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <EnhancedCard className={`backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300 ${cardMinHeight}`}>
          <CardHeader className="border-0 py-4">
            <CardTitle className="inline-flex items-center gap-2">
              <Target className="size-5 text-primary" />
              Financial Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="text-zinc-500 dark:text-zinc-400 text-sm text-center mb-2">
              Upload MCP JSON to view and track your savings goals.
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Save ₹{targetAmount.toLocaleString()} by {targetDate}</span>
                <Badge variant={getProgressColor(progressPercentage) as any} appearance="light" size="sm">
                  {progressPercentage}%
                </Badge>
              </div>
              {/* Progress bar */}
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-pink-500 rounded-full"
                  />
                </div>
              </div>
              {/* Amount display */}
              <div className="flex items-center justify-between">
                <motion.span 
                  className="text-lg font-semibold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ₹{Math.round(currentAmount).toLocaleString()}
                </motion.span>
                <span className="text-sm text-muted-foreground">
                  of ₹{targetAmount.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Progress message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-sm text-muted-foreground italic"
            >
              {getProgressMessage(progressPercentage)}
            </motion.div>
          </CardContent>
        </EnhancedCard>
      </motion.div>
    );
  }

  // Show first goal
  const goal = mcp.goals[0];
  const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.current);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <EnhancedCard className={`backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300 ${cardMinHeight}`}>
        <CardHeader className="border-0 py-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Financial Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium truncate">
                {goal.name} {/* e.g., "Save ₹25,000 by Sept" */}
              </span>
              <Badge variant="info" appearance="light" size="sm">
                {percent}%
              </Badge>
            </div>
            {/* Progress bar */}
            <div className="relative">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-pink-500 rounded-full"
                />
              </div>
            </div>
            {/* Amount display */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                ₹{goal.current.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                of ₹{goal.target.toLocaleString()}
              </span>
            </div>
          </div>
          {/* Progress message */}
          <div className="text-sm text-muted-foreground italic text-right">
            {percent < 100
              ? `₹${remaining.toLocaleString()} to go`
              : 'Goal achieved! 🎉'}
          </div>
        </CardContent>
      </EnhancedCard>
    </motion.div>
  );
};

export default GoalCard;