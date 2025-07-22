import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnhancedCard, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge-2';
import { Target } from 'lucide-react';

const GoalCard = () => {
  const [currentAmount, setCurrentAmount] = useState(0);
  const targetAmount = 25000;
  const targetDate = "Sept 15";
  const progressPercentage = 64;

  useEffect(() => {
    // Animate progress value
    const animationDuration = 1500;
    const increment = (targetAmount * progressPercentage / 100) / (animationDuration / 16);
    
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
  }, [targetAmount, progressPercentage]);

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
      <EnhancedCard className="backdrop-blur-md bg-card/70 border-border/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-0 py-4">
          <CardTitle className="inline-flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Savings Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
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
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
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
};

export default GoalCard;